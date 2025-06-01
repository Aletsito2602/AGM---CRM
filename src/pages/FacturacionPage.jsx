import React, { useState, useMemo, useEffect, useRef } from 'react';
import { auth, db } from '../services/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

const ventasMock = [
  { id: 1, fecha: '2024-06-01', cliente: 'Juan Pérez', monto: 1500, metodo: 'Skrill', estado: 'Pagado', tipoCuenta: 'Normal' },
  { id: 2, fecha: '2024-06-02', cliente: 'Ana López', monto: 2000, metodo: 'Transferencia', estado: 'Pendiente', tipoCuenta: 'Swing' },
  { id: 3, fecha: '2024-06-03', cliente: 'Carlos Ruiz', monto: 1000, metodo: 'WhapyPay', estado: 'Pagado', tipoCuenta: 'Normal' },
  { id: 4, fecha: '2024-06-04', cliente: 'Lucía Gómez', monto: 2500, metodo: 'Skrill', estado: 'Rechazado', tipoCuenta: 'Swing' },
  { id: 5, fecha: '2024-06-05', cliente: 'Pedro Díaz', monto: 1800, metodo: 'Transferencia', estado: 'Pagado', tipoCuenta: 'Normal' },
];

const metodosPago = ['Todos', 'Criptomoneda', 'Tarjeta de Crédito', 'Transferencia Bancaria', 'Skrill', 'WhapyPay'];
const estadosOperacion = ['Todos', 'Terminado', 'Pendiente', 'Fallido', 'Rechazado'];

const tipoCuentaInfo = {
  'Normal': 'Apalancamiento estándar (hasta 1:100).',
  'Swing': 'Apalancamiento 1:30. Sin restricciones para operar durante noticias ni para mantener posiciones durante la noche o fines de semana.'
};

// Tooltip simple con ícono
const Tooltip = ({ text }) => {
  const [visible, setVisible] = useState(false);
  const iconRef = useRef(null);
  const tooltipRef = useRef(null);

  // Mejor diseño visual
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

  // Cierra el tooltip si se hace click fuera
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

const FacturacionPage = () => {
  const [user, loadingAuth, errorAuth] = useAuthState(auth);
  const [operations, setOperations] = useState([]);
  const [loadingOperations, setLoadingOperations] = useState(true);
  const [operationsError, setOperationsError] = useState(null);

  const [filtroMetodo, setFiltroMetodo] = useState('Todos');
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  useEffect(() => {
    if (user && db) {
      const fetchOperations = async () => {
        setLoadingOperations(true);
        try {
          const q = query(
            collection(db, "operations"), 
            where("userId", "==", user.uid),
            orderBy("timestamp", "desc")
          );
          const querySnapshot = await getDocs(q);
          const opsData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp?.toDate ? doc.data().timestamp.toDate() : new Date(doc.data().timestamp)
          }));
          setOperations(opsData);
          setOperationsError(null);
        } catch (err) {
          console.error("Error fetching operations: ", err);
          setOperationsError("Error al cargar las operaciones de facturación.");
          setOperations([]);
        } finally {
          setLoadingOperations(false);
        }
      };
      fetchOperations();
    } else if (!user && !loadingAuth) {
      setLoadingOperations(false);
      setOperations([]);
    }
  }, [user, loadingAuth, db]);

  const operacionesFiltradas = useMemo(() => {
    return operations.filter(op => {
      const matchMetodo = filtroMetodo === 'Todos' || op.paymentMethod === filtroMetodo;
      const matchEstado = filtroEstado === 'Todos' || op.status === filtroEstado;
      
      const opDate = op.timestamp instanceof Date ? op.timestamp : (op.timestamp && new Date(op.timestamp));
      const matchFechaInicio = !fechaInicio || (opDate && opDate >= new Date(fechaInicio));
      const matchFechaFin = !fechaFin || (opDate && opDate <= new Date(fechaFin));
      
      return matchMetodo && matchEstado && matchFechaInicio && matchFechaFin;
    });
  }, [operations, filtroMetodo, filtroEstado, fechaInicio, fechaFin]);

  if (loadingAuth || loadingOperations) {
    return <div style={{ textAlign: 'center', padding: '50px', fontSize: '1.2em', color: '#e0e6f0' }}>Cargando datos de facturación...</div>;
  }

  if (errorAuth) {
    return <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>Error de autenticación: {errorAuth.message}</div>;
  }

  if (operationsError) {
    return <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>{operationsError}</div>;
  }

  if (!user) {
    return <div style={{ textAlign: 'center', padding: '50px', fontSize: '1.2em', color: '#e0e6f0' }}>Por favor, inicia sesión para ver tu facturación.</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ color: '#b0c4de', marginBottom: '30px' }}>Facturación</h1>
      {/* Filtros */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div>
          <label style={{ color: '#b0c4de' }}>Método de Pago <Tooltip text="Filtra por método de pago." /></label>
          <select value={filtroMetodo} onChange={e => setFiltroMetodo(e.target.value)} style={selectStyle}>
            {metodosPago.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <div>
          <label style={{ color: '#b0c4de' }}>Estado <Tooltip text="Filtra por estado de la operación." /></label>
          <select value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)} style={selectStyle}>
            {estadosOperacion.map(eo => <option key={eo} value={eo}>{eo}</option>)}
          </select>
        </div>
        <div>
          <label style={{ color: '#b0c4de' }}>Fecha Inicio <Tooltip text="Desde esta fecha." /></label>
          <input type="date" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} style={selectStyle} />
        </div>
        <div>
          <label style={{ color: '#b0c4de' }}>Fecha Fin <Tooltip text="Hasta esta fecha." /></label>
          <input type="date" value={fechaFin} onChange={e => setFechaFin(e.target.value)} style={selectStyle} />
        </div>
      </div>
      {/* Tabla de operaciones */}
      {operacionesFiltradas.length > 0 ? (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#232323', borderRadius: '8px' }}>
            <thead>
              <tr>
                <th style={thStyle}>N° Orden <Tooltip text="Número de orden único de la transacción." /></th>
                <th style={thStyle}>Fecha <Tooltip text="Fecha y hora de la operación." /></th>
                <th style={thStyle}>Tipo <Tooltip text="Tipo de operación realizada (ej. Compra de Challenge)." /></th>
                <th style={thStyle}>Detalles <Tooltip text="Descripción o detalles de la operación." /></th>
                <th style={thStyle}>Monto <Tooltip text="Monto de la operación." /></th>
                <th style={thStyle}>Método Pago <Tooltip text="Método de pago utilizado." /></th>
                <th style={thStyle}>Estado <Tooltip text="Estado actual de la operación." /></th>
                <th style={thStyle}>Login MT5 <Tooltip text="Login de la cuenta MT5 creada (si aplica)." /></th>
              </tr>
            </thead>
            <tbody>
              {operacionesFiltradas.map(op => (
                <tr key={op.id}>
                  <td style={tdStyle}>{op.orderNumber || 'N/A'}</td>
                  <td style={tdStyle}>{op.timestamp ? new Date(op.timestamp).toLocaleString() : 'N/A'}</td>
                  <td style={tdStyle}>{op.operationType || 'N/A'}</td>
                  <td style={tdStyle}>{op.details || 'N/A'}</td>
                  <td style={tdStyle}>{op.amount ? `${op.amount.toLocaleString()} ${op.currency || ''}` : 'N/A'}</td>
                  <td style={tdStyle}>{op.paymentMethod || 'N/A'}</td>
                  <td style={tdStyle}>{op.status || 'N/A'}</td>
                  <td style={tdStyle}>{op.mt5AccountCreated && op.mt5Login ? op.mt5Login : 'No aplica'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '30px', color: '#8899a6' }}>
          No se encontraron operaciones que coincidan con los filtros aplicados.
        </div>
      )}
    </div>
  );
};

const selectStyle = {
  width: '100%',
  padding: '8px',
  backgroundColor: '#383838',
  color: '#b0c4de',
  border: '1px solid #555',
  borderRadius: '4px',
  fontSize: '0.9em',
  marginTop: '5px'
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
  color: 'rgba(255,255,255,0.9)'
};

export default FacturacionPage; 