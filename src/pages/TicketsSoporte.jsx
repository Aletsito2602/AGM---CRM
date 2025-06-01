import React from 'react';

const TicketsSoportePage = () => {
  const fakeTickets = [
    { id: 401, clienteId: 1, asunto: 'Problema con acceso', fechaCreacion: '2023-04-01', estado: 'Abierto' },
    { id: 402, clienteId: 2, asunto: 'Consulta sobre factura', fechaCreacion: '2023-04-02', estado: 'Resuelto' },
    { id: 403, clienteId: 1, asunto: 'Error en plataforma', fechaCreacion: '2023-04-03', estado: 'En Progreso' },
  ];

  return (
    <div>
      <h1>Tickets de Soporte</h1>
      <table>
        <thead>
          <tr>
            <th>ID Ticket</th>
            <th>ID Cliente</th>
            <th>Asunto</th>
            <th>Fecha Creación</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {fakeTickets.map((ticket) => (
            <tr key={ticket.id}>
              <td>{ticket.id}</td>
              <td>{ticket.clienteId}</td>
              <td>{ticket.asunto}</td>
              <td>{ticket.fechaCreacion}</td>
              <td>{ticket.estado}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TicketsSoportePage; 