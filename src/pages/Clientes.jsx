import React from 'react';

const ClientesPage = () => {
  // Datos falsos para la tabla
  const fakeClients = [
    { id: 1, nombre: 'Juan Perez', email: 'juan.perez@example.com', telefono: '555-1234', estado: 'Activo' },
    { id: 2, nombre: 'Ana Gomez', email: 'ana.gomez@example.com', telefono: '555-5678', estado: 'Activo' },
    { id: 3, nombre: 'Carlos Diaz', email: 'carlos.diaz@example.com', telefono: '555-9012', estado: 'Inactivo' },
    { id: 4, nombre: 'Laura Fernandez', email: 'laura.f@example.com', telefono: '555-3456', estado: 'Activo' },
  ];

  return (
    <div>
      <h1>Clientes</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {fakeClients.map((client) => (
            <tr key={client.id}>
              <td>{client.id}</td>
              <td>{client.nombre}</td>
              <td>{client.email}</td>
              <td>{client.telefono}</td>
              <td>{client.estado}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClientesPage; 