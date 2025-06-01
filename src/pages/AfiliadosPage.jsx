import React, { useState, useMemo } from 'react';

// Datos de ejemplo para afiliados
const fakeAfiliadosData = [
  {
    id: 1,
    nombre: 'Juan Pérez',
    email: 'juan@email.com',
    tier: 1,
    fechaRegistro: '2024-01-15',
    estado: 'Activo',
    comisionTotal: 2500,
    comisionPendiente: 500,
    referidosDirectos: 15,
    referidosIndirectos: 45,
    codigoReferido: 'AGM-REF001',
    ultimaComision: '2024-03-10',
    notas: 'Afiliado destacado'
  },
  {
    id: 2,
    nombre: 'María García',
    email: 'maria@email.com',
    tier: 2,
    fechaRegistro: '2024-02-01',
    estado: 'Activo',
    comisionTotal: 1500,
    comisionPendiente: 300,
    referidosDirectos: 8,
    referidosIndirectos: 20,
    codigoReferido: 'AGM-REF002',
    ultimaComision: '2024-03-15',
    notas: 'Nuevo afiliado'
  },
  {
    id: 3,
    nombre: 'Carlos López',
    email: 'carlos@email.com',
    tier: 3,
    fechaRegistro: '2024-01-20',
    estado: 'Inactivo',
    comisionTotal: 1000,
    comisionPendiente: 0,
    referidosDirectos: 5,
    referidosIndirectos: 10,
    codigoReferido: 'AGM-REF003',
    ultimaComision: '2024-02-15',
    notas: 'Afiliado inactivo'
  }
];

const AfiliadosPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroTier, setFiltroTier] = useState('todos');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [selectedAfiliado, setSelectedAfiliado] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('detalles');

  const afiliadosFiltrados = useMemo(() => {
    return fakeAfiliadosData.filter(afiliado => {
      const matchesSearch = 
        afiliado.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        afiliado.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        afiliado.codigoReferido.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTier = filtroTier === 'todos' || afiliado.tier === parseInt(filtroTier);
      const matchesEstado = filtroEstado === 'todos' || afiliado.estado === filtroEstado;

      return matchesSearch && matchesTier && matchesEstado;
    });
  }, [searchTerm, filtroTier, filtroEstado]);

  const handleAction = (action, afiliado) => {
    setSelectedAfiliado(afiliado);
    setModalType(action);
    setShowModal(true);
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Activo': return '#28a745';
      case 'Inactivo': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getTierColor = (tier) => {
    switch (tier) {
      case 1: return '#ffc107';
      case 2: return '#17a2b8';
      case 3: return '#6c757d';
      default: return '#6c757d';
    }
  };

  const calcularEstadisticas = () => {
    return {
      totalAfiliados: 0,
      afiliadosTier1: 0,
      afiliadosTier2: 0,
      afiliadosTier3: 0,
      comisionTotal: 0,
      comisionPendiente: 0,
      referidosDirectos: 0,
      referidosIndirectos: 0
    };
  };

  const stats = calcularEstadisticas();

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ marginBottom: '30px', color: '#b0c4de' }}>Gestión de Afiliados</h1>

      {/* Resumen de KPIs */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={kpiCardStyle}>
          <h3 style={{ color: '#b0c4de', margin: '0 0 10px 0' }}>Total Afiliados</h3>
          <p style={{ fontSize: '24px', margin: 0, color: '#b0c4de' }}>{stats.totalAfiliados}</p>
          <div style={{ fontSize: '0.9em', color: '#888', marginTop: '5px' }}>
            <span>Tier 1: {stats.afiliadosTier1}</span>
            <span style={{ marginLeft: '10px' }}>Tier 2: {stats.afiliadosTier2}</span>
            <span style={{ marginLeft: '10px' }}>Tier 3: {stats.afiliadosTier3}</span>
          </div>
        </div>
        <div style={kpiCardStyle}>
          <h3 style={{ color: '#b0c4de', margin: '0 0 10px 0' }}>Comisión Total</h3>
          <p style={{ fontSize: '24px', margin: 0, color: '#17a2b8' }}>
            ${stats.comisionTotal.toLocaleString()}
          </p>
          <div style={{ fontSize: '0.9em', color: '#888', marginTop: '5px' }}>
            <span>Pendiente: ${stats.comisionPendiente.toLocaleString()}</span>
          </div>
        </div>
        <div style={kpiCardStyle}>
          <h3 style={{ color: '#b0c4de', margin: '0 0 10px 0' }}>Referidos Directos</h3>
          <p style={{ fontSize: '24px', margin: 0, color: '#28a745' }}>
            {stats.referidosDirectos}
          </p>
        </div>
        <div style={kpiCardStyle}>
          <h3 style={{ color: '#b0c4de', margin: '0 0 10px 0' }}>Referidos Indirectos</h3>
          <p style={{ fontSize: '24px', margin: 0, color: '#ffc107' }}>
            {stats.referidosIndirectos}
          </p>
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
              placeholder="Buscar por nombre, email o código..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={filterInputStyle}
            />
          </div>
          <div>
            <select 
              value={filtroTier} 
              onChange={(e) => setFiltroTier(e.target.value)}
              style={filterSelectStyle}
            >
              <option value="todos">Todos los Tiers</option>
              <option value="1">Tier 1</option>
              <option value="2">Tier 2</option>
              <option value="3">Tier 3</option>
            </select>
          </div>
          <div>
            <select 
              value={filtroEstado} 
              onChange={(e) => setFiltroEstado(e.target.value)}
              style={filterSelectStyle}
            >
              <option value="todos">Todos los Estados</option>
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabla de Afiliados */}
      <div style={{ overflowX: 'auto' }}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Afiliado</th>
              <th style={thStyle}>Tier</th>
              <th style={thStyle}>Estado</th>
              <th style={thStyle}>Comisión Total</th>
              <th style={thStyle}>Comisión Pendiente</th>
              <th style={thStyle}>Referidos</th>
              <th style={thStyle}>Última Comisión</th>
              <th style={thStyle}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {afiliadosFiltrados.map(afiliado => (
              <tr key={afiliado.id}>
                <td style={tdStyle}>
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{afiliado.nombre}</div>
                    <div style={{ fontSize: '0.8em', color: '#888' }}>{afiliado.email}</div>
                    <div style={{ fontSize: '0.8em', color: '#888' }}>{afiliado.codigoReferido}</div>
                  </div>
                </td>
                <td style={tdStyle}>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    backgroundColor: getTierColor(afiliado.tier),
                    color: '#fff'
                  }}>
                    Tier {afiliado.tier}
                  </span>
                </td>
                <td style={tdStyle}>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    backgroundColor: getEstadoColor(afiliado.estado),
                    color: '#fff'
                  }}>
                    {afiliado.estado}
                  </span>
                </td>
                <td style={tdStyle}>${afiliado.comisionTotal.toLocaleString()}</td>
                <td style={tdStyle}>${afiliado.comisionPendiente.toLocaleString()}</td>
                <td style={tdStyle}>
                  <div>
                    <div>Directos: {afiliado.referidosDirectos}</div>
                    <div>Indirectos: {afiliado.referidosIndirectos}</div>
                  </div>
                </td>
                <td style={tdStyle}>{afiliado.ultimaComision}</td>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <button
                      onClick={() => handleAction('detalles', afiliado)}
                      style={actionButtonStyle}
                    >
                      Detalles
                    </button>
                    <button
                      onClick={() => handleAction('referidos', afiliado)}
                      style={actionButtonStyle}
                    >
                      Referidos
                    </button>
                    <button
                      onClick={() => handleAction('comisiones', afiliado)}
                      style={actionButtonStyle}
                    >
                      Comisiones
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de Detalles/Referidos/Comisiones */}
      {showModal && selectedAfiliado && (
        <div style={modalOverlayStyle}>
          <div style={modalStyle}>
            <h2 style={{ marginTop: 0, color: '#b0c4de' }}>
              {modalType === 'detalles' ? 'Detalles del Afiliado' :
               modalType === 'referidos' ? 'Referidos del Afiliado' :
               'Historial de Comisiones'}
            </h2>
            <div style={modalContentStyle}>
              {modalType === 'detalles' && (
                <div style={modalSectionStyle}>
                  <p><strong>Nombre:</strong> {selectedAfiliado.nombre}</p>
                  <p><strong>Email:</strong> {selectedAfiliado.email}</p>
                  <p><strong>Tier:</strong> {selectedAfiliado.tier}</p>
                  <p><strong>Estado:</strong> {selectedAfiliado.estado}</p>
                  <p><strong>Código de Referido:</strong> {selectedAfiliado.codigoReferido}</p>
                  <p><strong>Fecha de Registro:</strong> {selectedAfiliado.fechaRegistro}</p>
                  <p><strong>Comisión Total:</strong> ${selectedAfiliado.comisionTotal.toLocaleString()}</p>
                  <p><strong>Comisión Pendiente:</strong> ${selectedAfiliado.comisionPendiente.toLocaleString()}</p>
                  <p><strong>Referidos Directos:</strong> {selectedAfiliado.referidosDirectos}</p>
                  <p><strong>Referidos Indirectos:</strong> {selectedAfiliado.referidosIndirectos}</p>
                  <p><strong>Última Comisión:</strong> {selectedAfiliado.ultimaComision}</p>
                  <p><strong>Notas:</strong> {selectedAfiliado.notas}</p>
                </div>
              )}
              {modalType === 'referidos' && (
                <div style={modalSectionStyle}>
                  <h3 style={{ color: '#b0c4de' }}>Referidos Directos</h3>
                  <table style={tableStyle}>
                    <thead>
                      <tr>
                        <th style={thStyle}>Nombre</th>
                        <th style={thStyle}>Email</th>
                        <th style={thStyle}>Fecha</th>
                        <th style={thStyle}>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Aquí irían los datos de referidos directos */}
                    </tbody>
                  </table>

                  <h3 style={{ color: '#b0c4de', marginTop: '20px' }}>Referidos Indirectos</h3>
                  <table style={tableStyle}>
                    <thead>
                      <tr>
                        <th style={thStyle}>Nombre</th>
                        <th style={thStyle}>Email</th>
                        <th style={thStyle}>Fecha</th>
                        <th style={thStyle}>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Aquí irían los datos de referidos indirectos */}
                    </tbody>
                  </table>
                </div>
              )}
              {modalType === 'comisiones' && (
                <div style={modalSectionStyle}>
                  <table style={tableStyle}>
                    <thead>
                      <tr>
                        <th style={thStyle}>Fecha</th>
                        <th style={thStyle}>Monto</th>
                        <th style={thStyle}>Referido</th>
                        <th style={thStyle}>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Aquí irían los datos de comisiones */}
                    </tbody>
                  </table>
                </div>
              )}
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
  backgroundColor: '#383838',
  color: '#b0c4de',
  border: '1px solid #555',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '0.9em'
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
  marginBottom: '20px'
};

const modalSectionStyle = {
  marginBottom: '10px'
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

export default AfiliadosPage; 