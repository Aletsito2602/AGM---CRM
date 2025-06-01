import React from 'react';

const CuentasFondeadasPage = () => {
  const fakeCuentasFondeadas = [
    { id: 201, cuentaId: 'CTA-001', trader: 'TraderX', capitalAsignado: '50000 USD', fechaInicio: '2023-01-15' },
    { id: 202, cuentaId: 'CTA-003', trader: 'TraderY', capitalAsignado: '100000 USD', fechaInicio: '2023-02-20' },
  ];

  return (
    <div>
      <h1>Cuentas Fondeadas</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>ID de Cuenta</th>
            <th>Trader Asignado</th>
            <th>Capital Asignado</th>
            <th>Fecha de Inicio</th>
          </tr>
        </thead>
        <tbody>
          {fakeCuentasFondeadas.map((cuenta) => (
            <tr key={cuenta.id}>
              <td>{cuenta.id}</td>
              <td>{cuenta.cuentaId}</td>
              <td>{cuenta.trader}</td>
              <td>{cuenta.capitalAsignado}</td>
              <td>{cuenta.fechaInicio}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CuentasFondeadasPage; 