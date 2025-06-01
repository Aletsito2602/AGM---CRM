import React from 'react';

const RetirosPage = () => {
  const fakeRetiros = [
    { id: 301, cuentaId: 'CTA-001', monto: '1000 USD', fecha: '2023-03-10', estado: 'Completado' },
    { id: 302, cuentaId: 'CTA-002', monto: '500 USD', fecha: '2023-03-12', estado: 'Pendiente' },
    { id: 303, cuentaId: 'CTA-001', monto: '2000 USD', fecha: '2023-03-15', estado: 'Procesando' },
  ];

  return (
    <div>
      <h1>Retiros</h1>
      <table>
        <thead>
          <tr>
            <th>ID Retiro</th>
            <th>ID de Cuenta</th>
            <th>Monto</th>
            <th>Fecha</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {fakeRetiros.map((retiro) => (
            <tr key={retiro.id}>
              <td>{retiro.id}</td>
              <td>{retiro.cuentaId}</td>
              <td>{retiro.monto}</td>
              <td>{retiro.fecha}</td>
              <td>{retiro.estado}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RetirosPage; 