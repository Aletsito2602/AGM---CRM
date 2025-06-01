import React from 'react';

const CuentasPage = () => {
  const fakeCuentas = [
    { id: 101, titular: 'Empresa Alpha', numero: 'CTA-001', saldo: '15000 USD', tipo: 'Corriente' },
    { id: 102, titular: 'Negocio Beta', numero: 'CTA-002', saldo: '2500 USD', tipo: 'Ahorros' },
    { id: 103, titular: 'Startup Gamma', numero: 'CTA-003', saldo: '8000 USD', tipo: 'Corriente' },
  ];

  return (
    <div>
      <h1>Cuentas</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Titular</th>
            <th>Número de Cuenta</th>
            <th>Saldo</th>
            <th>Tipo</th>
          </tr>
        </thead>
        <tbody>
          {fakeCuentas.map((cuenta) => (
            <tr key={cuenta.id}>
              <td>{cuenta.id}</td>
              <td>{cuenta.titular}</td>
              <td>{cuenta.numero}</td>
              <td>{cuenta.saldo}</td>
              <td>{cuenta.tipo}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CuentasPage; 