import React, { useState, useMemo } from 'react';

// Datos de ejemplo para tickets de soporte
const fakeTicketsData = [
  {
    id: 1,
    numeroTicket: 'TICK-001',
    cliente: 'Juan Pérez',
    email: 'juan@email.com',
    asunto: 'Problema con acceso a cuenta',
    descripcion: 'No puedo acceder a mi cuenta desde ayer',
    categoria: 'Acceso',
    prioridad: 'Alta',
    estado: 'Abierto',
    fechaCreacion: '2024-03-15 10:30',
    ultimaActualizacion: '2024-03-15 14:30',
    asignadoA: 'Soporte 1',
    notas: 'Cliente reporta error 404 al intentar login'
  },
  {
    id: 2,
    numeroTicket: 'TICK-002',
    cliente: 'María García',
    email: 'maria@email.com',
    asunto: 'Duda sobre retiro de fondos',
    descripcion: '¿Cuánto tiempo tarda el proceso de retiro?',
    categoria: 'Retiros',
    prioridad: 'Media',
    estado: 'En Proceso',
    fechaCreacion: '2024-03-15 09:15',
    ultimaActualizacion: '2024-03-15 11:45',
    asignadoA: 'Soporte 2',
    notas: 'Cliente espera respuesta sobre tiempo de procesamiento'
  },
  {
    id: 3,
    numeroTicket: 'TICK-003',
    cliente: 'Carlos López',
    email: 'carlos@email.com',
    asunto: 'Error en plataforma',
    descripcion: 'La plataforma no carga los gráficos correctamente',
    categoria: 'Técnico',
    prioridad: 'Alta',
    estado: 'Abierto',
    fechaCreacion: '2024-03-14 16:20',
    ultimaActualizacion: '2024-03-15 10:15',
    asignadoA: 'Soporte 1',
    notas: 'Problema reportado por varios usuarios'
  },
  {
    id: 4,
    numeroTicket: 'TICK-004',
    cliente: 'Ana Martínez',
    email: 'ana@email.com',
    asunto: 'Solicitud de información',
    descripcion: 'Necesito información sobre el programa de referidos',
    categoria: 'Información',
    prioridad: 'Baja',
    estado: 'Resuelto',
    fechaCreacion: '2024-03-14 11:30',
    ultimaActualizacion: '2024-03-14 15:45',
    asignadoA: 'Soporte 3',
    notas: 'Información enviada por email'
  },
  {
    id: 5,
    numeroTicket: 'TICK-005',
    cliente: 'Roberto Sánchez',
    email: 'roberto@email.com',
    asunto: 'Problema con pago',
    descripcion: 'El pago no se procesó correctamente',
    categoria: 'Pagos',
    prioridad: 'Alta',
    estado: 'En Proceso',
    fechaCreacion: '2024-03-15 08:45',
    ultimaActualizacion: '2024-03-15 13:20',
    asignadoA: 'Soporte 2',
    notas: 'Verificando transacción con el banco'
  }
];

const TicketsSoportePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [filtroPrioridad, setFiltroPrioridad] = useState('todos');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const ticketsFiltrados = useMemo(() => {
    return fakeTicketsData.filter(ticket => {
      const matchesSearch = 
        ticket.numeroTicket.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.asunto.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesEstado = filtroEstado === 'todos' || ticket.estado === filtroEstado;
      const matchesPrioridad = filtroPrioridad === 'todos' || ticket.prioridad === filtroPrioridad;

      return matchesSearch && matchesEstado && matchesPrioridad;
    });
  }, [searchTerm, filtroEstado, filtroPrioridad]);

  const handleAction = (action, ticket) => {
    console.log(`Acción ${action} para ticket ${ticket.id}`);
    setSelectedTicket(ticket);
    setShowModal(true);
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Abierto': return '#dc3545';
      case 'En Proceso': return '#ffc107';
      case 'Resuelto': return '#28a745';
      default: return '#6c757d';
    }
  };

  const getPrioridadColor = (prioridad) => {
    switch (prioridad) {
      case 'Alta': return '#dc3545';
      case 'Media': return '#ffc107';
      case 'Baja': return '#28a745';
      default: return '#6c757d';
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ marginBottom: '30px', color: '#b0c4de' }}>Tickets de Soporte</h1>

      {/* Resumen de KPIs */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={kpiCardStyle}>
          <h3 style={{ color: '#b0c4de', margin: '0 0 10px 0' }}>Total Tickets</h3>
          <p style={{ fontSize: '24px', margin: 0, color: '#b0c4de' }}>0</p>
        </div>
        <div style={kpiCardStyle}>
          <h3 style={{ color: '#b0c4de', margin: '0 0 10px 0' }}>Tickets Abiertos</h3>
          <p style={{ fontSize: '24px', margin: 0, color: '#dc3545' }}>0</p>
        </div>
        <div style={kpiCardStyle}>
          <h3 style={{ color: '#b0c4de', margin: '0 0 10px 0' }}>En Proceso</h3>
          <p style={{ fontSize: '24px', margin: 0, color: '#ffc107' }}>0</p>
        </div>
        <div style={kpiCardStyle}>
          <h3 style={{ color: '#b0c4de', margin: '0 0 10px 0' }}>Resueltos (24h)</h3>
          <p style={{ fontSize: '24px', margin: 0, color: '#28a745' }}>0</p>
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
              placeholder="Buscar por número, cliente, email o asunto..."
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
              <option value="Abierto">Abierto</option>
              <option value="En Proceso">En Proceso</option>
              <option value="Resuelto">Resuelto</option>
            </select>
          </div>
          <div>
            <select 
              value={filtroPrioridad} 
              onChange={(e) => setFiltroPrioridad(e.target.value)}
              style={filterSelectStyle}
            >
              <option value="todos">Todas las Prioridades</option>
              <option value="Alta">Alta</option>
              <option value="Media">Media</option>
              <option value="Baja">Baja</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabla de Tickets */}
      <div style={{ overflowX: 'auto' }}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Ticket</th>
              <th style={thStyle}>Cliente</th>
              <th style={thStyle}>Asunto</th>
              <th style={thStyle}>Categoría</th>
              <th style={thStyle}>Prioridad</th>
              <th style={thStyle}>Estado</th>
              <th style={thStyle}>Asignado a</th>
              <th style={thStyle}>Última Actualización</th>
              <th style={thStyle}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ticketsFiltrados.map(ticket => (
              <tr key={ticket.id}>
                <td style={tdStyle}>{ticket.numeroTicket}</td>
                <td style={tdStyle}>
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{ticket.cliente}</div>
                    <div style={{ fontSize: '0.8em', color: '#888' }}>{ticket.email}</div>
                  </div>
                </td>
                <td style={tdStyle}>{ticket.asunto}</td>
                <td style={tdStyle}>{ticket.categoria}</td>
                <td style={tdStyle}>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    backgroundColor: getPrioridadColor(ticket.prioridad),
                    color: '#fff',
                    fontSize: '0.9em'
                  }}>
                    {ticket.prioridad}
                  </span>
                </td>
                <td style={tdStyle}>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    backgroundColor: getEstadoColor(ticket.estado),
                    color: '#fff',
                    fontSize: '0.9em'
                  }}>
                    {ticket.estado}
                  </span>
                </td>
                <td style={tdStyle}>{ticket.asignadoA}</td>
                <td style={tdStyle}>{ticket.ultimaActualizacion}</td>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <button
                      onClick={() => handleAction('detalles', ticket)}
                      style={actionButtonStyle}
                    >
                      Detalles
                    </button>
                    {ticket.estado !== 'Resuelto' && (
                      <button
                        onClick={() => handleAction('responder', ticket)}
                        style={{...actionButtonStyle, backgroundColor: '#17a2b8'}}
                      >
                        Responder
                      </button>
                    )}
                    {ticket.estado === 'Abierto' && (
                      <button
                        onClick={() => handleAction('asignar', ticket)}
                        style={{...actionButtonStyle, backgroundColor: '#6c757d'}}
                      >
                        Asignar
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de Detalles */}
      {showModal && selectedTicket && (
        <div style={modalOverlayStyle}>
          <div style={modalStyle}>
            <h2 style={{ marginTop: 0, color: '#b0c4de' }}>Detalles del Ticket</h2>
            <div style={{ marginBottom: '20px' }}>
              <p><strong>Número de Ticket:</strong> {selectedTicket.numeroTicket}</p>
              <p><strong>Cliente:</strong> {selectedTicket.cliente}</p>
              <p><strong>Email:</strong> {selectedTicket.email}</p>
              <p><strong>Asunto:</strong> {selectedTicket.asunto}</p>
              <p><strong>Descripción:</strong> {selectedTicket.descripcion}</p>
              <p><strong>Categoría:</strong> {selectedTicket.categoria}</p>
              <p><strong>Prioridad:</strong> {selectedTicket.prioridad}</p>
              <p><strong>Estado:</strong> {selectedTicket.estado}</p>
              <p><strong>Fecha de Creación:</strong> {selectedTicket.fechaCreacion}</p>
              <p><strong>Última Actualización:</strong> {selectedTicket.ultimaActualizacion}</p>
              <p><strong>Asignado a:</strong> {selectedTicket.asignadoA}</p>
              <p><strong>Notas:</strong> {selectedTicket.notas}</p>
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

export default TicketsSoportePage; 