import React, { useState, useMemo } from 'react';

// Datos de ejemplo para cuentas de Broker
const fakeBrokerAccountsData = [
  {
    id: 'bk-acc-001', numeroCuenta: 'BROKER5001', clienteNombre: 'Eva Green', clienteEmail: 'eva@example.com',
    tipoCuenta: 'ECN Pro', saldo: 50250.75, equity: 50300.50, estado: 'Activa',
    apalancamiento: '1:100', margenLibre: 45000.00, fechaApertura: '2022-11-01', pais: 'España'
  },
  {
    id: 'bk-acc-002', numeroCuenta: 'BROKER5002', clienteNombre: 'Frank Castle', clienteEmail: 'frank@example.com',
    tipoCuenta: 'Standard', saldo: 10500.00, equity: 10450.20, estado: 'Activa',
    apalancamiento: '1:200', margenLibre: 8000.00, fechaApertura: '2023-02-10', pais: 'USA'
  },
  {
    id: 'bk-acc-003', numeroCuenta: 'BROKER5003', clienteNombre: 'Grace Hopper', clienteEmail: 'grace@example.com',
    tipoCuenta: 'Cent', saldo: 980.50, equity: 980.50, estado: 'Suspendida (Verificación)',
    apalancamiento: '1:500', margenLibre: 750.00, fechaApertura: '2023-05-20', pais: 'Reino Unido'
  },
  {
    id: 'bk-acc-004', numeroCuenta: 'BROKER5004', clienteNombre: 'Henry Cavill', clienteEmail: 'henry@example.com',
    tipoCuenta: 'ECN Pro', saldo: 250000.00, equity: 250150.80, estado: 'Activa',
    apalancamiento: '1:50', margenLibre: 200000.00, fechaApertura: '2021-08-15', pais: 'Canada'
  },
  {
    id: 'bk-acc-005', numeroCuenta: 'BROKER5005', clienteNombre: 'Iris West', clienteEmail: 'iris@example.com',
    tipoCuenta: 'Standard', saldo: 5300.00, equity: 5200.00, estado: 'Cerrada',
    apalancamiento: '1:200', margenLibre: 0.00, fechaApertura: '2023-01-05', fechaCierre: '2023-06-30', pais: 'Australia'
  }
];

// Estilos (similares a CuentasPage, pueden moverse a CSS)
const filterContainerStyle = {
  display: 'flex', gap: '15px', alignItems: 'center',
  padding: '15px', backgroundColor: '#2c2c2c', borderRadius: '8px', marginBottom: '25px', flexWrap: 'wrap'
};
const inputStyle = { padding: '10px', backgroundColor: '#383838', color: 'rgba(255,255,255,0.9)', border: '1px solid #555', borderRadius: '4px', fontSize:'0.9em' };
const selectStyle = { padding: '10px', backgroundColor: '#383838', color: 'rgba(255,255,255,0.9)', border: '1px solid #555', borderRadius: '4px', fontSize:'0.9em' };
const actionButtonStyle = { padding: '6px 10px', fontSize: '0.8em', marginRight:'5px', cursor:'pointer', borderRadius: '4px', border:'none' };


const BrokerCuentasPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroTipoCuenta, setFiltroTipoCuenta] = useState('Todos');
  const [filtroEstadoBroker, setFiltroEstadoBroker] = useState('Todos');

  const tiposCuentaDisponibles = ['Todos', 'ECN Pro', 'Standard', 'Cent', 'VIP'];
  const estadosBrokerDisponibles = ['Todos', 'Activa', 'Suspendida (Verificación)', 'Suspendida (Margen)', 'Cerrada', 'Pendiente de Aprobación'];

  const cuentasFiltradasBroker = useMemo(() => {
    return fakeBrokerAccountsData.filter(cuenta => {
      const search = searchTerm.toLowerCase();
      const coincideBusqueda =
        cuenta.numeroCuenta.toLowerCase().includes(search) ||
        cuenta.clienteNombre.toLowerCase().includes(search) ||
        cuenta.clienteEmail.toLowerCase().includes(search);

      const coincideTipoCuenta = filtroTipoCuenta === 'Todos' || cuenta.tipoCuenta === filtroTipoCuenta;
      const coincideEstadoBroker = filtroEstadoBroker === 'Todos' || cuenta.estado.startsWith(filtroEstadoBroker.split(' (')[0]);

      return coincideBusqueda && coincideTipoCuenta && coincideEstadoBroker;
    });
  }, [searchTerm, filtroTipoCuenta, filtroEstadoBroker]);

  const handleBrokerAction = (accion, cuentaId) => {
    console.log(`Acción Broker: ${accion} para cuenta: ${cuentaId}`);
    alert(`Acción Broker: ${accion} para cuenta: ${cuentaId} (ver consola)`);
  };

  return (
    <div>
      <h1>Gestión de Cuentas (Broker)</h1>

      <div style={filterContainerStyle}>
        <input
          type="text"
          placeholder="Buscar por Nº Cuenta, Cliente, Email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{...inputStyle, flexGrow: 1, minWidth: '250px'}}
        />
        <select value={filtroTipoCuenta} onChange={(e) => setFiltroTipoCuenta(e.target.value)} style={selectStyle}>
          {tiposCuentaDisponibles.map(tipo => <option key={tipo} value={tipo}>{tipo}</option>)}
        </select>
        <select value={filtroEstadoBroker} onChange={(e) => setFiltroEstadoBroker(e.target.value)} style={selectStyle}>
          {estadosBrokerDisponibles.map(estado => <option key={estado} value={estado}>{estado}</option>)}
        </select>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>Nº Cuenta</th>
              <th>Cliente</th>
              <th>Email</th>
              <th>Tipo Cuenta</th>
              <th>Saldo</th>
              <th>Equity</th>
              <th>Apalancamiento</th>
              <th>Margen Libre</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cuentasFiltradasBroker.length > 0 ? cuentasFiltradasBroker.map(cuenta => (
              <tr key={cuenta.id}>
                <td>{cuenta.numeroCuenta}</td>
                <td>{cuenta.clienteNombre}</td>
                <td>{cuenta.clienteEmail}</td>
                <td>{cuenta.tipoCuenta}</td>
                <td>${cuenta.saldo.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                <td>${cuenta.equity.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                <td>{cuenta.apalancamiento}</td>
                <td>${cuenta.margenLibre.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                <td>{cuenta.estado}</td>
                <td>
                  <button onClick={() => handleBrokerAction('Ver Detalles', cuenta.id)} style={{...actionButtonStyle, backgroundColor: '#007bff', color: 'white'}}>Detalles</button>
                  <button onClick={() => handleBrokerAction('Ver Trades', cuenta.id)} style={{...actionButtonStyle, backgroundColor: '#17a2b8', color: 'white'}}>Trades</button>
                  {cuenta.estado !== 'Cerrada' &&
                    <>
                      <button onClick={() => handleBrokerAction('Realizar Depósito', cuenta.id)} style={{...actionButtonStyle, backgroundColor: '#28a745', color: 'white'}}>Depósito</button>
                      <button onClick={() => handleBrokerAction('Procesar Retiro', cuenta.id)} style={{...actionButtonStyle, backgroundColor: '#ffc107', color: 'black'}}>Retiro</button>
                      <button onClick={() => handleBrokerAction('Cambiar Apalancamiento', cuenta.id)} style={{...actionButtonStyle, backgroundColor: '#6f42c1', color: 'white'}}>Apalanc.</button>
                      {cuenta.estado.startsWith('Suspendida') ?
                        <button onClick={() => handleBrokerAction('Reactivar Cuenta', cuenta.id)} style={{...actionButtonStyle, backgroundColor: '#20c997', color: 'white'}}>Reactivar</button>
                        :
                        <button onClick={() => handleBrokerAction('Suspender Cuenta', cuenta.id)} style={{...actionButtonStyle, backgroundColor: '#fd7e14', color: 'white'}}>Suspender</button>
                      }
                    </>
                  }
                  {cuenta.estado !== 'Cerrada' &&
                    <button onClick={() => handleBrokerAction('Cerrar Cuenta', cuenta.id)} style={{...actionButtonStyle, backgroundColor: '#dc3545', color: 'white'}}>Cerrar</button>
                  }
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="10" style={{textAlign: 'center', padding: '20px'}}>No se encontraron cuentas con los criterios seleccionados.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BrokerCuentasPage; 