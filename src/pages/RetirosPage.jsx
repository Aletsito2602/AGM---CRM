import React, { useState, useMemo } from 'react';

// Datos de ejemplo para retiros
const fakeRetirosData = [
  {
    id: 1,
    trader: 'Juan Pérez',
    email: 'juan@email.com',
    cuenta: 'AGM-1234',
    fase: 'Fondeada',
    balance: 12500,
    equity: 12300,
    ganancia: 2300,
    porcentajeGanancia: '23%',
    fechaSolicitud: '2024-03-15',
    estado: 'Pendiente',
    metodoPago: 'PayPal',
    detallesPago: 'juan@email.com',
    notas: 'Primer retiro del trader',
    ultimaActualizacion: '2024-03-15 14:30'
  },
  {
    id: 2,
    trader: 'María García',
    email: 'maria@email.com',
    cuenta: 'AGM-1235',
    fase: 'Fondeada',
    balance: 15000,
    equity: 14800,
    ganancia: 2800,
    porcentajeGanancia: '28%',
    fechaSolicitud: '2024-03-14',
    estado: 'Aprobado',
    metodoPago: 'Wise',
    detallesPago: 'maria@wise.com',
    notas: 'Retiro mensual regular',
    ultimaActualizacion: '2024-03-14 16:45'
  },
  {
    id: 3,
    trader: 'Carlos López',
    email: 'carlos@email.com',
    cuenta: 'AGM-1236',
    fase: 'Fondeada',
    balance: 20000,
    equity: 19500,
    ganancia: 4500,
    porcentajeGanancia: '45%',
    fechaSolicitud: '2024-03-13',
    estado: 'Rechazado',
    metodoPago: 'PayPal',
    detallesPago: 'carlos@email.com',
    notas: 'Cuenta suspendida por violación de reglas',
    ultimaActualizacion: '2024-03-13 10:15'
  },
  {
    id: 4,
    trader: 'Ana Martínez',
    email: 'ana@email.com',
    cuenta: 'AGM-1237',
    fase: 'Fondeada',
    balance: 17500,
    equity: 17200,
    ganancia: 3200,
    porcentajeGanancia: '32%',
    fechaSolicitud: '2024-03-12',
    estado: 'Procesado',
    metodoPago: 'Wise',
    detallesPago: 'ana@wise.com',
    notas: 'Pago enviado',
    ultimaActualizacion: '2024-03-12 09:30'
  },
  {
    id: 5,
    trader: 'Roberto Sánchez',
    email: 'roberto@email.com',
    cuenta: 'AGM-1238',
    fase: 'Fondeada',
    balance: 22500,
    equity: 22000,
    ganancia: 5000,
    porcentajeGanancia: '50%',
    fechaSolicitud: '2024-03-11',
    estado: 'Pendiente',
    metodoPago: 'PayPal',
    detallesPago: 'roberto@email.com',
    notas: 'Solicitud de retiro urgente',
    ultimaActualizacion: '2024-03-11 15:20'
  }
];

const RetirosPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [filtroMetodo, setFiltroMetodo] = useState('todos');
  const [filtroFase, setFiltroFase] = useState('todos');
  const [filtroFecha, setFiltroFecha] = useState('todos');
  const [selectedRetiro, setSelectedRetiro] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const retirosFiltrados = useMemo(() => {
    return fakeRetirosData.filter(retiro => {
      const matchesSearch = 
        retiro.trader.toLowerCase().includes(searchTerm.toLowerCase()) ||
        retiro.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        retiro.cuenta.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesEstado = filtroEstado === 'todos' || retiro.estado === filtroEstado;
      const matchesMetodo = filtroMetodo === 'todos' || retiro.metodoPago === filtroMetodo;
      const matchesFase = filtroFase === 'todos' || retiro.fase === filtroFase;
      
      let matchesFecha = true;
      if (filtroFecha !== 'todos') {
        const fechaSolicitud = new Date(retiro.fechaSolicitud);
        const hoy = new Date();
        const diferenciaDias = Math.floor((hoy - fechaSolicitud) / (1000 * 60 * 60 * 24));
        
        switch (filtroFecha) {
          case 'hoy':
            matchesFecha = diferenciaDias === 0;
            break;
          case 'ayer':
            matchesFecha = diferenciaDias === 1;
            break;
          case 'semana':
            matchesFecha = diferenciaDias <= 7;
            break;
          case 'mes':
            matchesFecha = diferenciaDias <= 30;
            break;
        }
      }

      return matchesSearch && matchesEstado && matchesMetodo && matchesFase && matchesFecha;
    });
  }, [searchTerm, filtroEstado, filtroMetodo, filtroFase, filtroFecha]);

  const handleAction = (action, retiro) => {
    console.log(`Acción ${action} para retiro ${retiro.id}`);
    setSelectedRetiro(retiro);
    setShowModal(true);
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Pendiente': return '#ffc107';
      case 'Aprobado': return '#28a745';
      case 'Rechazado': return '#dc3545';
      case 'Procesado': return '#17a2b8';
      default: return '#6c757d';
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ marginBottom: '30px', color: '#b0c4de' }}>Gestión de Retiros</h1>

      {/* Resumen de KPIs */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={kpiCardStyle}>
          <h3 style={{ color: '#b0c4de', margin: '0 0 10px 0' }}>Retiros Pendientes</h3>
          <p style={{ fontSize: '24px', margin: 0, color: '#ffc107' }}>0</p>
        </div>
        <div style={kpiCardStyle}>
          <h3 style={{ color: '#b0c4de', margin: '0 0 10px 0' }}>Total a Pagar</h3>
          <p style={{ fontSize: '24px', margin: 0, color: '#28a745' }}>$0</p>
        </div>
        <div style={kpiCardStyle}>
          <h3 style={{ color: '#b0c4de', margin: '0 0 10px 0' }}>Retiros Procesados (Mes)</h3>
          <p style={{ fontSize: '24px', margin: 0, color: '#17a2b8' }}>0</p>
        </div>
        <div style={kpiCardStyle}>
          <h3 style={{ color: '#b0c4de', margin: '0 0 10px 0' }}>Total Pagado (Mes)</h3>
          <p style={{ fontSize: '24px', margin: 0, color: '#28a745' }}>$0</p>
        </div>
      </div>

      {/* Filtros */}
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
              placeholder="Buscar por trader, email o cuenta..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={filterInputStyle}
            />
          </div>
          <div>
            <select 
              value={filtroEstado} 
              onChange={(e) => setFiltroEstado(e.target.value)}
              style={filterSelectStyle}
            >
              <option value="todos">Todos los Estados</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Aprobado">Aprobado</option>
              <option value="Rechazado">Rechazado</option>
              <option value="Procesado">Procesado</option>
            </select>
          </div>
          <div>
            <select 
              value={filtroMetodo} 
              onChange={(e) => setFiltroMetodo(e.target.value)}
              style={filterSelectStyle}
            >
              <option value="todos">Todos los Métodos</option>
              <option value="PayPal">PayPal</option>
              <option value="Wise">Wise</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>
          </div>
          <div>
            <select 
              value={filtroFase} 
              onChange={(e) => setFiltroFase(e.target.value)}
              style={filterSelectStyle}
            >
              <option value="todos">Todas las Fases</option>
              <option value="Fondeada">Fondeada</option>
              <option value="Fase 1">Fase 1</option>
              <option value="Fase 2">Fase 2</option>
            </select>
          </div>
          <div>
            <select 
              value={filtroFecha} 
              onChange={(e) => setFiltroFecha(e.target.value)}
              style={filterSelectStyle}
            >
              <option value="todos">Todas las Fechas</option>
              <option value="hoy">Hoy</option>
              <option value="ayer">Ayer</option>
              <option value="semana">Última Semana</option>
              <option value="mes">Último Mes</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabla de Retiros */}
      <div style={{ overflowX: 'auto' }}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Trader</th>
              <th style={thStyle}>Cuenta</th>
              <th style={thStyle}>Fase</th>
              <th style={thStyle}>Balance</th>
              <th style={thStyle}>Equity</th>
              <th style={thStyle}>Ganancia</th>
              <th style={thStyle}>Fecha Solicitud</th>
              <th style={thStyle}>Estado</th>
              <th style={thStyle}>Método</th>
              <th style={thStyle}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {retirosFiltrados.map(retiro => (
              <tr key={retiro.id}>
                <td style={tdStyle}>
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{retiro.trader}</div>
                    <div style={{ fontSize: '0.8em', color: '#888' }}>{retiro.email}</div>
                  </div>
                </td>
                <td style={tdStyle}>{retiro.cuenta}</td>
                <td style={tdStyle}>{retiro.fase}</td>
                <td style={tdStyle}>${retiro.balance.toLocaleString()}</td>
                <td style={tdStyle}>${retiro.equity.toLocaleString()}</td>
                <td style={tdStyle}>
                  <div style={{ color: '#28a745' }}>
                    ${retiro.ganancia.toLocaleString()}
                    <div style={{ fontSize: '0.8em' }}>{retiro.porcentajeGanancia}</div>
                  </div>
                </td>
                <td style={tdStyle}>{retiro.fechaSolicitud}</td>
                <td style={tdStyle}>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    backgroundColor: getEstadoColor(retiro.estado),
                    color: '#fff',
                    fontSize: '0.9em'
                  }}>
                    {retiro.estado}
                  </span>
                </td>
                <td style={tdStyle}>{retiro.metodoPago}</td>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <button
                      onClick={() => handleAction('aprobar', retiro)}
                      style={actionButtonStyle}
                      disabled={retiro.estado !== 'Pendiente'}
                    >
                      Aprobar
                    </button>
                    <button
                      onClick={() => handleAction('rechazar', retiro)}
                      style={{...actionButtonStyle, backgroundColor: '#dc3545'}}
                      disabled={retiro.estado !== 'Pendiente'}
                    >
                      Rechazar
                    </button>
                    <button
                      onClick={() => handleAction('detalles', retiro)}
                      style={{...actionButtonStyle, backgroundColor: '#17a2b8'}}
                    >
                      Detalles
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de Detalles */}
      {showModal && selectedRetiro && (
        <div style={modalOverlayStyle}>
          <div style={modalStyle}>
            <h2 style={{ marginTop: 0, color: '#b0c4de' }}>Detalles del Retiro</h2>
            <div style={{ marginBottom: '20px' }}>
              <p><strong>Trader:</strong> {selectedRetiro.trader}</p>
              <p><strong>Email:</strong> {selectedRetiro.email}</p>
              <p><strong>Cuenta:</strong> {selectedRetiro.cuenta}</p>
              <p><strong>Fase:</strong> {selectedRetiro.fase}</p>
              <p><strong>Balance:</strong> ${selectedRetiro.balance.toLocaleString()}</p>
              <p><strong>Equity:</strong> ${selectedRetiro.equity.toLocaleString()}</p>
              <p><strong>Ganancia:</strong> ${selectedRetiro.ganancia.toLocaleString()} ({selectedRetiro.porcentajeGanancia})</p>
              <p><strong>Fecha Solicitud:</strong> {selectedRetiro.fechaSolicitud}</p>
              <p><strong>Estado:</strong> {selectedRetiro.estado}</p>
              <p><strong>Método de Pago:</strong> {selectedRetiro.metodoPago}</p>
              <p><strong>Detalles de Pago:</strong> {selectedRetiro.detallesPago}</p>
              <p><strong>Notas:</strong> {selectedRetiro.notas}</p>
              <p><strong>Última Actualización:</strong> {selectedRetiro.ultimaActualizacion}</p>
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
  color: 'rgba(255,255,255,0.9)'
};

const actionButtonStyle = {
  padding: '6px 12px',
  backgroundColor: '#28a745',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '0.9em',
  opacity: 1,
  ':disabled': {
    opacity: 0.5,
    cursor: 'not-allowed'
  }
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
  padding: '30px',
  borderRadius: '8px',
  width: '90%',
  maxWidth: '600px',
  maxHeight: '90vh',
  overflowY: 'auto'
};

const modalButtonStyle = {
  padding: '8px 16px',
  backgroundColor: '#6c757d',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
};

export default RetirosPage; 