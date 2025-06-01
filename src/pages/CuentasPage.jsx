import React, { useState, useMemo, useRef, useEffect } from 'react';
import mt5Api from '../services/mt5Api';
import { auth, db } from '../services/firebase';
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

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
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editForm, setEditForm] = useState({
    status: '',
    challengePhase: '',
    balanceActual: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchTradingAccounts = async () => {
      if (!db) {
        setAccountsError('Firestore no está disponible');
        setLoadingAccounts(false);
        return;
      }

      try {
        setLoadingAccounts(true);
        const accountsRef = collection(db, 'tradingAccounts');
        const querySnapshot = await getDocs(accountsRef);
        const accountsData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            numeroChallenge: data.accountNumber || 'N/A',
            trader: data.userId || 'N/A',
            email: 'N/A',
            fase: data.challengePhase || 'N/A',
            capital: data.balanceActual || 0,
            balance: data.balanceActual || 0,
            equity: data.balanceActual || 0,
            estado: data.status || 'N/A',
            fechaInicio: data.createdAt ? new Date(data.createdAt.toDate()).toLocaleDateString() : 'N/A',
            fechaFin: 'N/A',
            objetivo: data.selectedProfitTargetP1 || 'N/A',
            drawdown: 'N/A',
            diasRestantes: 'N/A',
            ultimaActualizacion: data.createdAt ? new Date(data.createdAt.toDate()).toLocaleString() : 'N/A',
            tipoCuenta: data.accountType || 'N/A',
            tipoChallenge: data.challengeType || 'N/A',
            servidor: data.serverType || 'N/A',
            profitSplit: data.selectedProfitSplit || 'N/A',
            precio: data.priceString || 'N/A'
          };
        });
        console.log('Cuentas cargadas:', accountsData);
        setTradingAccounts(accountsData);
      } catch (err) {
        console.error('Error al obtener cuentas:', err);
        setAccountsError('Error al cargar las cuentas');
      } finally {
        setLoadingAccounts(false);
      }
    };

    fetchTradingAccounts();
  }, []);

  const handleAction = (action, account) => {
    setSelectedAccount(account);
    if (action === 'editar') {
      setEditForm({
        status: account.estado,
        challengePhase: account.fase,
        balanceActual: account.capital
      });
      setShowEditModal(true);
    } else if (action === 'eliminar') {
      setShowDeleteModal(true);
    }
  };

  const handleEdit = async () => {
    if (!selectedAccount) return;
    
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const accountRef = doc(db, 'tradingAccounts', selectedAccount.id);
      await updateDoc(accountRef, {
        status: editForm.status,
        challengePhase: editForm.challengePhase,
        balanceActual: Number(editForm.balanceActual)
      });

      // Actualizar la lista de cuentas
      const updatedAccounts = tradingAccounts.map(acc => 
        acc.id === selectedAccount.id 
          ? { 
              ...acc, 
              estado: editForm.status,
              fase: editForm.challengePhase,
              capital: Number(editForm.balanceActual),
              balance: Number(editForm.balanceActual),
              equity: Number(editForm.balanceActual)
            }
          : acc
      );
      setTradingAccounts(updatedAccounts);
      
      setSuccess('Cuenta actualizada exitosamente');
      setShowEditModal(false);
    } catch (err) {
      console.error('Error al actualizar la cuenta:', err);
      setError('Error al actualizar la cuenta');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedAccount) return;
    
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const accountRef = doc(db, 'tradingAccounts', selectedAccount.id);
      await deleteDoc(accountRef);

      // Actualizar la lista de cuentas
      const updatedAccounts = tradingAccounts.filter(acc => acc.id !== selectedAccount.id);
      setTradingAccounts(updatedAccounts);
      
      setSuccess('Cuenta eliminada exitosamente');
      setShowDeleteModal(false);
    } catch (err) {
      console.error('Error al eliminar la cuenta:', err);
      setError('Error al eliminar la cuenta');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'activa':
        return '#28a745';
      case 'inactiva':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  };

  const calcularEstadisticas = () => {
    const total = tradingAccounts.length;
    const activos = tradingAccounts.filter(acc => acc.estado?.toLowerCase() === 'activa').length;
    const inactivos = tradingAccounts.filter(acc => acc.estado?.toLowerCase() === 'inactiva').length;
    const capitalTotal = tradingAccounts.reduce((sum, acc) => sum + (acc.capital || 0), 0);

    return {
      total,
      activos,
      inactivos,
      capitalTotal
    };
  };

  const filteredAccounts = useMemo(() => {
    return tradingAccounts.filter(account => {
      const matchesSearch = 
        account.numeroChallenge?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.trader?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.email?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFase = filtroFase === 'todos' || account.fase === filtroFase;
      const matchesEstado = filtroEstado === 'todos' || account.estado === filtroEstado;

      return matchesSearch && matchesFase && matchesEstado;
    });
  }, [tradingAccounts, searchTerm, filtroFase, filtroEstado]);

  const stats = calcularEstadisticas();

  if (loadingAccounts) {
    return (
      <div style={loadingStyle}>
        Cargando cuentas...
      </div>
    );
  }

  if (accountsError) {
    return (
      <div style={errorStyle}>
        {accountsError}
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h2 style={titleStyle}>Cuentas de Trading</h2>
        <div style={searchContainerStyle}>
          <input
            type="text"
            placeholder="Buscar por número de challenge, trader o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={searchInputStyle}
          />
          <select
            value={filtroFase}
            onChange={(e) => setFiltroFase(e.target.value)}
            style={selectStyle}
          >
            <option value="todos">Todas las fases</option>
            <option value="Fase 1">Fase 1</option>
            <option value="Fase 2">Fase 2</option>
            <option value="Real">Real</option>
          </select>
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            style={selectStyle}
          >
            <option value="todos">Todos los estados</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
            <option value="Advertencia">Advertencia</option>
          </select>
        </div>
      </div>

      <div style={statsContainerStyle}>
        <div style={statCardStyle}>
          <h3 style={statTitleStyle}>Total Challenges</h3>
          <p style={statValueStyle}>{stats.total}</p>
          <Tooltip text={kpiDescriptions['Total Challenges']} />
        </div>
        <div style={statCardStyle}>
          <h3 style={statTitleStyle}>Capital Total</h3>
          <p style={statValueStyle}>${stats.capitalTotal.toLocaleString()}</p>
          <Tooltip text={kpiDescriptions['Capital Total']} />
        </div>
        <div style={statCardStyle}>
          <h3 style={statTitleStyle}>Challenges Activos</h3>
          <p style={statValueStyle}>{stats.activos}</p>
          <Tooltip text={kpiDescriptions['Challenges Activos']} />
        </div>
        <div style={statCardStyle}>
          <h3 style={statTitleStyle}>Challenges Inactivos</h3>
          <p style={statValueStyle}>{stats.inactivos}</p>
          <Tooltip text={kpiDescriptions['Challenges Inactivos']} />
        </div>
      </div>

      {error && (
        <div style={errorMessageStyle}>
          {error}
        </div>
      )}

      {success && (
        <div style={successMessageStyle}>
          {success}
        </div>
      )}

      <div style={tableContainerStyle}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Número Challenge</th>
              <th style={thStyle}>Trader ID</th>
              <th style={thStyle}>Fase</th>
              <th style={thStyle}>Capital</th>
              <th style={thStyle}>Balance</th>
              <th style={thStyle}>Estado</th>
              <th style={thStyle}>Fecha Creación</th>
              <th style={thStyle}>Tipo Cuenta</th>
              <th style={thStyle}>Servidor</th>
              <th style={thStyle}>Objetivo</th>
              <th style={thStyle}>Profit Split</th>
              <th style={thStyle}>Precio</th>
              <th style={thStyle}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredAccounts.map((account) => (
              <tr key={account.id} style={trStyle}>
                <td style={tdStyle}>{account.numeroChallenge}</td>
                <td style={tdStyle}>{account.trader}</td>
                <td style={tdStyle}>{account.fase}</td>
                <td style={tdStyle}>${account.capital?.toLocaleString()}</td>
                <td style={tdStyle}>${account.balance?.toLocaleString()}</td>
                <td style={tdStyle}>
                  <span style={{
                    ...statusBadgeStyle,
                    backgroundColor: getEstadoColor(account.estado)
                  }}>
                    {account.estado}
                  </span>
                </td>
                <td style={tdStyle}>{account.fechaInicio}</td>
                <td style={tdStyle}>{account.tipoCuenta}</td>
                <td style={tdStyle}>{account.servidor}</td>
                <td style={tdStyle}>{account.objetivo}</td>
                <td style={tdStyle}>{account.profitSplit}</td>
                <td style={tdStyle}>{account.precio}</td>
                <td style={tdStyle}>
                  <button
                    onClick={() => handleAction('editar', account)}
                    style={actionButtonStyle}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleAction('eliminar', account)}
                    style={deleteButtonStyle}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de Edición */}
      {showEditModal && selectedAccount && (
        <div style={modalOverlayStyle}>
          <div style={modalStyle}>
            <h2 style={modalTitleStyle}>Editar Cuenta</h2>
            <div style={modalContentStyle}>
              <div style={formGroupStyle}>
                <label style={labelStyle}>Estado:</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                  style={inputStyle}
                >
                  <option value="Activa">Activa</option>
                  <option value="Inactiva">Inactiva</option>
                </select>
              </div>
              <div style={formGroupStyle}>
                <label style={labelStyle}>Fase:</label>
                <select
                  value={editForm.challengePhase}
                  onChange={(e) => setEditForm({...editForm, challengePhase: e.target.value})}
                  style={inputStyle}
                >
                  <option value="1 FASE">1 FASE</option>
                  <option value="2 FASE">2 FASE</option>
                  <option value="REAL">REAL</option>
                </select>
              </div>
              <div style={formGroupStyle}>
                <label style={labelStyle}>Capital:</label>
                <input
                  type="number"
                  value={editForm.balanceActual}
                  onChange={(e) => setEditForm({...editForm, balanceActual: e.target.value})}
                  style={inputStyle}
                />
              </div>
            </div>
            <div style={modalActionsStyle}>
              <button
                onClick={() => setShowEditModal(false)}
                style={cancelButtonStyle}
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                onClick={handleEdit}
                style={submitButtonStyle}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Eliminación */}
      {showDeleteModal && selectedAccount && (
        <div style={modalOverlayStyle}>
          <div style={modalStyle}>
            <h2 style={modalTitleStyle}>Eliminar Cuenta</h2>
            <div style={modalContentStyle}>
              <p style={warningTextStyle}>
                ¿Estás seguro de que deseas eliminar la cuenta {selectedAccount.numeroChallenge}?
                Esta acción no se puede deshacer.
              </p>
            </div>
            <div style={modalActionsStyle}>
              <button
                onClick={() => setShowDeleteModal(false)}
                style={cancelButtonStyle}
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                style={deleteButtonStyle}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Estilos
const containerStyle = {
  padding: '20px',
  backgroundColor: '#1a1a1a',
  minHeight: '100vh'
};

const headerStyle = {
  marginBottom: '20px'
};

const titleStyle = {
  color: '#b0c4de',
  marginBottom: '20px'
};

const searchContainerStyle = {
  display: 'flex',
  gap: '10px',
  marginBottom: '20px'
};

const searchInputStyle = {
  flex: 1,
  padding: '10px',
  borderRadius: '4px',
  border: '1px solid #444',
  backgroundColor: '#2c2c2c',
  color: '#b0c4de'
};

const selectStyle = {
  padding: '10px',
  borderRadius: '4px',
  border: '1px solid #444',
  backgroundColor: '#2c2c2c',
  color: '#b0c4de'
};

const statsContainerStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '20px',
  marginBottom: '20px'
};

const statCardStyle = {
  backgroundColor: '#2c2c2c',
  padding: '20px',
  borderRadius: '8px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  position: 'relative'
};

const statTitleStyle = {
  color: '#b0c4de',
  margin: '0 0 10px 0',
  fontSize: '1em'
};

const statValueStyle = {
  color: '#17a2b8',
  margin: 0,
  fontSize: '1.5em',
  fontWeight: 'bold'
};

const tableContainerStyle = {
  overflowX: 'auto',
  backgroundColor: '#2c2c2c',
  borderRadius: '8px',
  padding: '20px'
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  color: '#b0c4de'
};

const thStyle = {
  padding: '12px',
  textAlign: 'left',
  borderBottom: '2px solid #444',
  backgroundColor: '#383838'
};

const trStyle = {
  borderBottom: '1px solid #444',
  '&:hover': {
    backgroundColor: '#383838'
  }
};

const tdStyle = {
  padding: '12px',
  borderBottom: '1px solid #444'
};

const statusBadgeStyle = {
  padding: '4px 8px',
  borderRadius: '4px',
  color: 'white',
  fontSize: '0.9em'
};

const actionButtonStyle = {
  backgroundColor: '#17a2b8',
  color: 'white',
  border: 'none',
  padding: '6px 12px',
  borderRadius: '4px',
  cursor: 'pointer',
  marginRight: '8px',
  '&:hover': {
    backgroundColor: '#138496'
  }
};

const deleteButtonStyle = {
  backgroundColor: '#dc3545',
  color: 'white',
  border: 'none',
  padding: '6px 12px',
  borderRadius: '4px',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: '#c82333'
  }
};

const loadingStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '200px',
  color: '#b0c4de'
};

const errorStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '200px',
  color: '#dc3545'
};

// Nuevos estilos para los modales
const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
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
  maxWidth: '500px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
};

const modalTitleStyle = {
  color: '#b0c4de',
  marginTop: 0,
  marginBottom: '20px'
};

const modalContentStyle = {
  marginBottom: '20px'
};

const formGroupStyle = {
  marginBottom: '15px'
};

const labelStyle = {
  display: 'block',
  marginBottom: '5px',
  color: '#b0c4de'
};

const inputStyle = {
  width: '100%',
  padding: '8px',
  borderRadius: '4px',
  border: '1px solid #444',
  backgroundColor: '#383838',
  color: '#b0c4de'
};

const modalActionsStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '10px'
};

const submitButtonStyle = {
  backgroundColor: '#17a2b8',
  color: 'white',
  border: 'none',
  padding: '8px 16px',
  borderRadius: '4px',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: '#138496'
  },
  '&:disabled': {
    backgroundColor: '#6c757d',
    cursor: 'not-allowed'
  }
};

const cancelButtonStyle = {
  backgroundColor: '#6c757d',
  color: 'white',
  border: 'none',
  padding: '8px 16px',
  borderRadius: '4px',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: '#5a6268'
  },
  '&:disabled': {
    backgroundColor: '#495057',
    cursor: 'not-allowed'
  }
};

const warningTextStyle = {
  color: '#dc3545',
  margin: 0
};

const errorMessageStyle = {
  backgroundColor: '#dc3545',
  color: 'white',
  padding: '10px',
  borderRadius: '4px',
  marginBottom: '20px'
};

const successMessageStyle = {
  backgroundColor: '#28a745',
  color: 'white',
  padding: '10px',
  borderRadius: '4px',
  marginBottom: '20px'
};

export default CuentasPage; 