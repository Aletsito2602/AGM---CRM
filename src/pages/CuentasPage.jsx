import React, { useState, useMemo, useRef, useEffect } from 'react';
import mt5Api from '../services/mt5Api';
import { auth, db } from '../services/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

// Datos de ejemplo para challenges
const fakeChallengesData = [
  {
    id: 1,
    numeroChallenge: 'AGM-1234',
    trader: 'Juan Pérez',
    email: 'juan@email.com',
    fase: 'Fase 1',
    capital: 10000,
    balance: 10200,
    equity: 10150,
    estado: 'Activo',
    fechaInicio: '2024-03-01',
    fechaFin: '2024-03-31',
    objetivo: '8%',
    drawdown: '5%',
    diasRestantes: 15,
    ultimaActualizacion: '2024-03-15 14:30',
    notas: 'Challenge en buen estado',
    tipo: 'Demo',
    violaciones: [],
    historialRetiros: [],
    ultimaOperacion: {
      fecha: '2024-03-15 14:30',
      simbolo: 'EURUSD',
      tipo: 'Compra',
      volumen: 0.1,
      precio: 1.0850,
      sl: 1.0800,
      tp: 1.0900
    }
  },
  {
    id: 2,
    numeroChallenge: 'AGM-1235',
    trader: 'María García',
    email: 'maria@email.com',
    fase: 'Fase 2',
    capital: 10000,
    balance: 10800,
    equity: 10750,
    estado: 'Inactivo',
    fechaInicio: '2024-03-01',
    fechaFin: '2024-03-31',
    objetivo: '5%',
    drawdown: '4%',
    diasRestantes: 15,
    ultimaActualizacion: '2024-03-15 16:45',
    notas: 'Challenge inactivo por violación de reglas',
    tipo: 'Demo',
    violaciones: [],
    historialRetiros: [],
    ultimaOperacion: null
  },
  {
    id: 3,
    numeroChallenge: 'AGM-1236',
    trader: 'Carlos López',
    email: 'carlos@email.com',
    fase: 'Real',
    capital: 25000,
    balance: 24500,
    equity: 24400,
    estado: 'Inactivo',
    fechaInicio: '2024-03-01',
    fechaFin: null,
    objetivo: '8%',
    drawdown: '5%',
    diasRestantes: null,
    ultimaActualizacion: '2024-03-15 10:15',
    notas: 'Challenge fondeado inactivo',
    tipo: 'Fondeado',
    violaciones: [],
    historialRetiros: [
      {
        fecha: '2024-03-01',
        monto: 1000,
        estado: 'Completado'
      }
    ],
    ultimaOperacion: null
  },
  {
    id: 4,
    numeroChallenge: 'AGM-1237',
    trader: 'Ana Martínez',
    email: 'ana@email.com',
    fase: 'Real',
    capital: 50000,
    balance: 51200,
    equity: 51100,
    estado: 'Activo',
    fechaInicio: '2024-03-01',
    fechaFin: null,
    objetivo: '5%',
    drawdown: '4%',
    diasRestantes: null,
    ultimaActualizacion: '2024-03-15 09:30',
    notas: 'Challenge fondeado con buen rendimiento',
    tipo: 'Fondeado',
    violaciones: [],
    historialRetiros: [],
    ultimaOperacion: null
  }
];

// Tooltip visual reutilizable
const Tooltip = ({ text }) => {
  const [visible, setVisible] = useState(false);
  const iconRef = useRef(null);
  const tooltipRef = useRef(null);
  const tooltipBoxStyle = {
    width: '260px',
    background: 'linear-gradient(135deg, #232b3e 60%, #1a1a1a 100%)',
    color: '#e0e6f0',
    textAlign: 'left',
    borderRadius: '10px',
    padding: '14px 16px',
    position: 'absolute',
    zIndex: 2147483647,
    top: '135%',
    left: '50%',
    marginLeft: '-130px',
    opacity: 1,
    fontSize: '1em',
    boxShadow: '0 4px 16px rgba(40,60,100,0.25)',
    border: '1px solid #2c3e50',
    pointerEvents: 'auto',
    transition: 'opacity 0.3s',
    lineHeight: 1.5
  };
  React.useEffect(() => {
    function handleClickOutside(event) {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target) &&
        iconRef.current &&
        !iconRef.current.contains(event.target)
      ) {
        setVisible(false);
      }
    }
    if (visible) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [visible]);
  return (
    <span style={{ position: 'relative', display: 'inline-block', marginLeft: 5 }}>
      <span
        ref={iconRef}
        style={{ cursor: 'pointer', color: '#17a2b8', fontWeight: 'bold' }}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setTimeout(() => setVisible(false), 200)}
        onClick={() => setVisible(v => !v)}
        tabIndex={0}
        aria-label="Mostrar información"
      >
        ℹ️
      </span>
      {visible && (
        <span
          ref={tooltipRef}
          style={tooltipBoxStyle}
          onMouseEnter={() => setVisible(true)}
          onMouseLeave={() => setVisible(false)}
        >
          {text}
        </span>
      )}
    </span>
  );
};

const kpiDescriptions = {
  'Total Challenges': 'Cantidad total de challenges creados en la plataforma.',
  'Capital Total': 'Suma total del capital gestionado en todos los challenges.',
  'Challenges Activos': 'Challenges que actualmente están activos y operando.',
  'Challenges en Advertencia': 'Challenges que presentan algún tipo de advertencia o riesgo.',
  'Challenges Inactivos': 'Challenges que no están activos actualmente.',
};

const CuentasPage = () => {
  const [user, loadingAuth, errorAuth] = useAuthState(auth);
  const [tradingAccounts, setTradingAccounts] = useState([]);
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [accountsError, setAccountsError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroFase, setFiltroFase] = useState('todos');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [showBalanceReal, setShowBalanceReal] = useState(false);
  const [filtroCapital, setFiltroCapital] = useState('todos');
  const [filtroFechaInicio, setFiltroFechaInicio] = useState('');
  const [filtroFechaFin, setFiltroFechaFin] = useState('');
  const [showMt5Modal, setShowMt5Modal] = useState(false);
  const [mt5FormData, setMt5FormData] = useState({
    name: '',
    email: '',
    leverage: 100,
    deposit: 5000,
    challenge_type: 'one_step',
    group: 'challenge\\onestep',
    purchase_id: '',
    phone: ''
  });
  const [mt5Error, setMt5Error] = useState('');
  const [mt5Success, setMt5Success] = useState('');

  useEffect(() => {
    if (user && db) {
      const fetchTradingAccounts = async () => {
        setLoadingAccounts(true);
        try {
          const q = query(collection(db, "tradingAccounts"), where("userId", "==", user.uid));
          const querySnapshot = await getDocs(q);
          const accountsData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            // Ensure createdAt is a JS Date object if it's a Firestore Timestamp
            createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : new Date(doc.data().createdAt)
          }));
          setTradingAccounts(accountsData);
          setAccountsError(null);
        } catch (err) {
          console.error("Error fetching trading accounts: ", err);
          setAccountsError("Error al cargar las cuentas de trading.");
          setTradingAccounts([]); // Clear accounts on error
        } finally {
          setLoadingAccounts(false);
        }
      };
      fetchTradingAccounts();
    } else if (!user && !loadingAuth) {
      // Handle case where user is not logged in and auth is not loading
      setLoadingAccounts(false);
      setTradingAccounts([]);
      // Optionally redirect to login or show a message
    }
  }, [user, loadingAuth, db]);

  const accountsFiltrados = useMemo(() => {
    return tradingAccounts.filter(account => {
      const searchTermLower = searchTerm.toLowerCase();
      const matchesSearch = 
        (account.accountNumber && account.accountNumber.toLowerCase().includes(searchTermLower)) ||
        (user && user.displayName && user.displayName.toLowerCase().includes(searchTermLower)) || // Assuming you might want to search by user name
        (user && user.email && user.email.toLowerCase().includes(searchTermLower));
      
      // Adapt filter logic for tradingAccount fields
      const matchesFase = filtroFase === 'todos' || (account.challengePhase && account.challengePhase === filtroFase);
      const matchesEstado = filtroEstado === 'todos' || (account.status && account.status === filtroEstado);
      // Example: Mapping filtroTipo to account.serverType or account.challengeType
      const matchesTipo = filtroTipo === 'todos' || 
                          (account.serverType && account.serverType.toLowerCase().includes(filtroTipo.toLowerCase())) || 
                          (account.challengeType && account.challengeType.toLowerCase().includes(filtroTipo.toLowerCase()));
      
      let matchesCapital = true;
      if (filtroCapital !== 'todos') {
        const capitalFilter = parseInt(filtroCapital);
        // Assuming challengeAmountNumber is the field to filter by
        matchesCapital = account.challengeAmountNumber >= capitalFilter && account.challengeAmountNumber < capitalFilter + 10000; 
      }

      // const matchesObjetivo = filtroObjetivo === 'todos' || account.selectedProfitTargetP1 === filtroObjetivo; // Example
      // const matchesDrawdown = filtroDrawdown === 'todos' || account.drawdown === filtroDrawdown; // Need field for this

      const accountDate = account.createdAt instanceof Date ? account.createdAt : (account.createdAt && new Date(account.createdAt));
      const matchesFecha = 
        (!filtroFechaInicio || (accountDate && accountDate >= new Date(filtroFechaInicio))) && 
        (!filtroFechaFin || (accountDate && accountDate <= new Date(filtroFechaFin)));

      return matchesSearch && matchesFase && matchesEstado && matchesTipo && 
             matchesCapital && /*matchesObjetivo && matchesDrawdown &&*/ matchesFecha;
    });
  }, [searchTerm, filtroFase, filtroEstado, filtroTipo, filtroCapital, 
      /*filtroObjetivo, filtroDrawdown,*/ filtroFechaInicio, filtroFechaFin, tradingAccounts, user]);

  const handleAction = (action, account) => {
    setSelectedAccount(account);
    setModalType(action);
    setShowModal(true);
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Activa': return '#28a745';
      case 'Inactivo': return '#dc3545';
      case 'Pendiente': return '#ffc107';
      default: return '#6c757d';
    }
  };

  const calcularEstadisticas = () => {
    const totalCuentas = tradingAccounts.length;
    const capitalTotal = tradingAccounts.reduce((sum, acc) => sum + (acc.challengeAmountNumber || 0), 0);
    const cuentasActivas = tradingAccounts.filter(acc => acc.status === 'Activa').length;
    return {
      'Total Cuentas': totalCuentas,
      'Capital Total': `$${capitalTotal.toLocaleString()}`,
      'Cuentas Activas': cuentasActivas,
    };
  };

  const handleMt5Submit = async (e) => {
    e.preventDefault();
    setMt5Error('');
    setMt5Success('');

    if (!user) {
      setMt5Error("Debes iniciar sesión para crear una cuenta.");
      return;
    }

    // Validaciones básicas
    if (!mt5FormData.name.trim()) {
      setMt5Error("El nombre es obligatorio.");
      return;
    }
    if (!mt5FormData.email.trim() || !/\S+@\S+\.\S+/.test(mt5FormData.email)) {
      setMt5Error("El correo electrónico no es válido.");
      return;
    }
    if (!mt5FormData.purchase_id.trim()) {
        setMt5Error("El ID de compra es obligatorio.");
        return;
    }
    if (!mt5FormData.phone.trim()) {
        setMt5Error("El teléfono es obligatorio.");
        return;
    }

    // Mostrar indicador de carga aquí si es necesario
    console.log("Enviando datos para crear cuenta MT5:", { ...mt5FormData, userId: user.uid });

    try {
      // Obtener el token de Firebase
      const token = await user.getIdToken();
      
      // Llamar a la API con el token y los datos del formulario
      const response = await mt5Api.createAccount(token, mt5FormData);
      console.log("Respuesta de creación de cuenta:", response);
      setMt5Success(`Cuenta ${response.data?.login || 'nueva'} creada con éxito.`);
      setShowMt5Modal(false);
      
      // Limpiar el formulario
      setMt5FormData({
        name: '',
        email: '',
        leverage: 100,
        deposit: 1000,
        challenge_type: 'one_step',
        group: 'challenge\\onestep',
        purchase_id: '',
        phone: ''
      });
      
      // Aquí podrías volver a cargar las cuentas para incluir la nueva
      // fetchTradingAccounts(); // Si tienes esta función separada y disponible
    } catch (error) {
      console.error("Error al crear cuenta MT5:", error);
      const errorMessage = error.response?.data?.error || error.message || "Error desconocido al crear la cuenta.";
      setMt5Error(`Error: ${errorMessage}`);
    }
  };

  const handleMt5InputChange = (e) => {
    const { name, value } = e.target;
    setMt5FormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  if (loadingAuth || loadingAccounts) {
    return <div style={{ textAlign: 'center', padding: '50px', fontSize: '1.2em', color: '#e0e6f0' }}>Cargando datos de cuentas...</div>;
  }

  if (errorAuth) {
    return <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>Error de autenticación: {errorAuth.message}</div>;
  }

  if (accountsError) {
    return <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>{accountsError}</div>;
  }

  if (!user) {
    return <div style={{ textAlign: 'center', padding: '50px', fontSize: '1.2em', color: '#e0e6f0' }}>Por favor, inicia sesión para ver tus cuentas.</div>;
  }
  
  const estadisticas = calcularEstadisticas();

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h1 style={{ margin: 0, color: '#b0c4de' }}>Gestión de Cuentas de Trading</h1>
        <button
          onClick={() => setShowMt5Modal(true)}
          style={{
            padding: '12px 24px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1em',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#218838'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#28a745'}
        >
          <span>➕</span>
          Crear Cuenta MT5
        </button>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        {Object.entries(estadisticas).map(([key, value]) => (
          <div key={key} style={kpiCardStyle}>
            <h3 style={{ color: '#b0c4de', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: 4 }}>
              {key}
              <Tooltip text={kpiDescriptions[key] || "Descripción no disponible"} />
            </h3>
            <p style={{ fontSize: '24px', margin: 0, color: '#b0c4de' }}>{value}</p>
          </div>
        ))}
      </div>

      <div style={{ 
        marginBottom: '20px', 
        padding: '20px', 
        backgroundColor: '#2c2c2c', 
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px'
        }}>
          <div>
            <input
              type="text"
              placeholder="Buscar por N° Cuenta, Trader, Email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={filterInputStyle}
            />
          </div>
          <div>
            <select 
              value={filtroTipo} 
              onChange={(e) => setFiltroTipo(e.target.value)}
              style={filterSelectStyle}
            >
              <option value="todos">Todos los Tipos</option>
              <option value="Demo">Demo</option>
              <option value="Fondeado">Fondeado</option>
            </select>
          </div>
          <div>
            <select 
              value={filtroFase} 
              onChange={(e) => setFiltroFase(e.target.value)}
              style={filterSelectStyle}
            >
              <option value="todos">Todas las Fases</option>
              <option value="Fase 1">Fase 1</option>
              <option value="Fase 2">Fase 2</option>
              <option value="Real">Real</option>
            </select>
          </div>
          <div>
            <select 
              value={filtroEstado} 
              onChange={(e) => setFiltroEstado(e.target.value)}
              style={filterSelectStyle}
            >
              <option value="todos">Todos los Estados</option>
              <option value="Activa">Activa</option>
              <option value="Inactivo">Inactivo</option>
              <option value="Pendiente">Pendiente</option>
            </select>
          </div>
          <div>
            <select 
              value={filtroCapital} 
              onChange={(e) => setFiltroCapital(e.target.value)}
              style={filterSelectStyle}
            >
              <option value="todos">Todos los Capitales</option>
              <option value="10000">$10,000</option>
              <option value="25000">$25,000</option>
              <option value="50000">$50,000</option>
              <option value="100000">$100,000</option>
            </select>
          </div>
          <div>
            <input
              type="date"
              value={filtroFechaInicio}
              onChange={(e) => setFiltroFechaInicio(e.target.value)}
              style={filterInputStyle}
              placeholder="Fecha Inicio"
            />
          </div>
          <div>
            <input
              type="date"
              value={filtroFechaFin}
              onChange={(e) => setFiltroFechaFin(e.target.value)}
              style={filterInputStyle}
              placeholder="Fecha Fin"
            />
          </div>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>N° Cuenta</th>
              <th style={thStyle}>Tipo de Cuenta</th>
              <th style={thStyle}>Fase</th>
              <th style={thStyle}>Monto del Challenge</th>
              <th style={thStyle}>Balance Actual</th>
              <th style={thStyle}>Estado</th>
              <th style={thStyle}>Fecha Creación</th>
              <th style={thStyle}>Servidor</th>
            </tr>
          </thead>
          <tbody>
            {accountsFiltrados.map((account) => (
              <tr key={account.id} style={trStyle}>
                <td style={tdStyle}>{account.accountNumber}</td>
                <td style={tdStyle}>{account.accountStyle} ({account.accountType})</td>
                <td style={tdStyle}>{account.challengePhase}</td>
                <td style={tdStyle}>{account.challengeAmountString}</td>
                <td style={tdStyle}>${(account.balanceActual || 0).toLocaleString()}</td>
                <td style={{ ...tdStyle, color: getEstadoColor(account.status) }}>{account.status}</td>
                <td style={tdStyle}>{account.createdAt ? new Date(account.createdAt).toLocaleDateString() : 'N/A'}</td>
                <td style={tdStyle}>{account.serverType}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && selectedAccount && (
        <div style={modalOverlayStyle}>
          <div style={modalStyle}>
            <h2 style={{ marginTop: 0, color: '#b0c4de' }}>Detalles de la Cuenta: {selectedAccount.accountNumber}</h2>
            <div style={modalContentStyle}>
              <p><strong>Tipo de Cuenta:</strong> {selectedAccount.accountStyle} ({selectedAccount.accountType})</p>
              <p><strong>Fase:</strong> {selectedAccount.challengePhase}</p>
              <p><strong>Monto del Challenge:</strong> {selectedAccount.challengeAmountString}</p>
              <p><strong>Balance Actual:</strong> ${(selectedAccount.balanceActual || 0).toLocaleString()}</p>
              <p><strong>Estado:</strong> {selectedAccount.status}</p>
              <p><strong>Fecha Creación:</strong> {selectedAccount.createdAt ? new Date(selectedAccount.createdAt).toLocaleString() : 'N/A'}</p>
              <p><strong>Servidor:</strong> {selectedAccount.serverType}</p>
              <p><strong>Profit Target P1:</strong> {selectedAccount.selectedProfitTargetP1}</p>
              <p><strong>Profit Target P2:</strong> {selectedAccount.selectedProfitTargetP2}</p>
              <p><strong>Profit Split:</strong> {selectedAccount.selectedProfitSplit}</p>
              <p><strong>ID Usuario:</strong> {selectedAccount.userId}</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setShowModal(false)}
                style={modalButtonStyle}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {showMt5Modal && (
        <div style={modalOverlayStyle}>
          <div style={modalStyle}>
            <h2>Crear Nueva Cuenta MT5</h2>
            {mt5Error && (
              <div style={{ color: '#dc3545', marginBottom: '15px' }}>
                {mt5Error}
              </div>
            )}
            {mt5Success && (
              <div style={{ color: '#28a745', marginBottom: '15px' }}>
                {mt5Success}
              </div>
            )}
            <form onSubmit={handleMt5Submit}>
              <div style={modalSectionStyle}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Nombre:</label>
                <input
                  type="text"
                  name="name"
                  value={mt5FormData.name}
                  onChange={handleMt5InputChange}
                  required
                  style={filterInputStyle}
                />
              </div>
              <div style={modalSectionStyle}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={mt5FormData.email}
                  onChange={handleMt5InputChange}
                  required
                  style={filterInputStyle}
                />
              </div>
              <div style={modalSectionStyle}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Teléfono:</label>
                <input
                  type="tel"
                  name="phone"
                  value={mt5FormData.phone}
                  onChange={handleMt5InputChange}
                  required
                  style={filterInputStyle}
                />
              </div>
              <div style={modalSectionStyle}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Apalancamiento:</label>
                <select
                  name="leverage"
                  value={mt5FormData.leverage}
                  onChange={handleMt5InputChange}
                  style={filterSelectStyle}
                >
                  <option value="100">1:100</option>
                  <option value="50">1:50</option>
                  <option value="30">1:30</option>
                  <option value="10">1:10</option>
                </select>
              </div>
              <div style={modalSectionStyle}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Depósito Inicial:</label>
                <input
                  type="number"
                  name="deposit"
                  value={mt5FormData.deposit}
                  onChange={handleMt5InputChange}
                  required
                  min="1000"
                  style={filterInputStyle}
                />
              </div>
              <div style={modalSectionStyle}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Tipo de Challenge:</label>
                <select
                  name="challenge_type"
                  value={mt5FormData.challenge_type}
                  onChange={handleMt5InputChange}
                  style={filterSelectStyle}
                >
                  <option value="one_step">One Step</option>
                  <option value="two_step">Two Step</option>
                </select>
              </div>
              <div style={modalSectionStyle}>
                <label style={{ display: 'block', marginBottom: '5px' }}>ID de Compra:</label>
                <input
                  type="text"
                  name="purchase_id"
                  value={mt5FormData.purchase_id}
                  onChange={handleMt5InputChange}
                  required
                  style={filterInputStyle}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowMt5Modal(false)}
                  style={{
                    ...modalButtonStyle,
                    backgroundColor: '#6c757d'
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{
                    ...modalButtonStyle,
                    backgroundColor: '#28a745'
                  }}
                >
                  Crear Cuenta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Estilos
const kpiCardStyle = {
  backgroundColor: '#2c2c2c',
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
};

const filterInputStyle = {
  width: '100%',
  padding: '10px',
  backgroundColor: '#383838',
  color: 'rgba(255,255,255,0.9)',
  border: '1px solid #555',
  borderRadius: '4px',
  fontSize: '0.9em'
};

const filterSelectStyle = {
  width: '100%',
  padding: '10px',
  backgroundColor: '#383838',
  color: 'rgba(255,255,255,0.9)',
  border: '1px solid #555',
  borderRadius: '4px',
  fontSize: '0.9em'
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  backgroundColor: '#2c2c2c',
  borderRadius: '8px',
  overflow: 'hidden'
};

const thStyle = {
  padding: '12px',
  textAlign: 'left',
  backgroundColor: '#383838',
  color: '#b0c4de',
  borderBottom: '2px solid #444'
};

const tdStyle = {
  padding: '12px',
  borderBottom: '1px solid #444',
  color: '#b0c4de'
};

const trStyle = {
  borderBottom: '1px solid #3a3a3a',
  transition: 'background-color 0.2s ease'
};

const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.7)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000
};

const modalStyle = {
  backgroundColor: '#2c2c2c',
  padding: '20px',
  borderRadius: '8px',
  width: '90%',
  maxWidth: '600px',
  maxHeight: '90vh',
  overflowY: 'auto'
};

const modalContentStyle = {
  marginTop: '20px',
  marginBottom: '20px'
};

const modalSectionStyle = {
  marginBottom: '20px',
  padding: '15px',
  backgroundColor: '#383838',
  borderRadius: '4px'
};

const modalButtonStyle = {
  padding: '10px 20px',
  backgroundColor: '#383838',
  color: '#b0c4de',
  border: '1px solid #555',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '1em'
};

export default CuentasPage; 