import React from 'react';
import { NavLink } from 'react-router-dom';

// Recibimos crmType y setCrmType como props
const Sidebar = ({ crmType, setCrmType }) => {

  const propFirmMenuItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/cuentas', label: 'Cuentas' },
    { path: '/clientes', label: 'Clientes' },
    { path: '/capital', label: 'Capital' },
    { path: '/retiros', label: 'Retiros' },
    { path: '/tickets-soporte', label: 'Tickets de Soporte' },
    { path: '/certificados', label: 'Certificados' },
    { path: '/descuentos', label: 'Descuentos' },
    { path: '/facturacion', label: 'Facturación' },
    { path: '/afiliados', label: 'Afiliados' },
    { path: '/emails', label: 'Emails' }
  ];

  const brokerMenuItems = [
    { path: '/dashboard-broker', label: 'Dashboard' },
    { path: '/broker-cuentas', label: 'Cuentas' },
    { path: '/broker-usuarios', label: 'Usuarios' },
    { path: '/copytrading', label: 'Copytrading' },
    { path: '/pamm', label: 'PAMM' },
    { path: '/bonos', label: 'Bonos' },
    { path: '/emails', label: 'Emails' }
  ];

  const menuItems = crmType === 'prop-firm' ? propFirmMenuItems : brokerMenuItems;

  return (
    <div style={{
      width: '250px',
      height: '100vh',
      backgroundColor: '#1a1a1a',
      padding: '15px',
      position: 'fixed',
      left: 0,
      top: 0,
      color: '#b0c4de',
      boxSizing: 'border-box',
      borderRight: '1px solid #2c2c2c'
    }}>
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ 
          margin: '0 0 20px 0', 
          color: '#b0c4de',
          fontSize: '1.5rem',
          fontWeight: '600'
        }}>AGM CRM</h2>
        <select
          value={crmType}
          onChange={(e) => setCrmType(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#2c2c2c',
            color: '#b0c4de',
            border: '1px solid #444',
            borderRadius: '4px',
            fontSize: '0.9em',
            cursor: 'pointer',
            outline: 'none'
          }}
        >
          <option value="prop-firm">Prop Firm CRM</option>
          <option value="broker">Broker CRM</option>
        </select>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              display: 'block',
              padding: '12px 15px',
              color: '#b0c4de',
              textDecoration: 'none',
              borderRadius: '4px',
              backgroundColor: isActive ? '#2c2c2c' : 'transparent',
              borderLeft: isActive ? '4px solid #28a745' : '4px solid transparent',
              transition: 'all 0.3s ease',
              fontSize: '0.95rem',
              fontWeight: isActive ? '500' : '400',
              '&:hover': {
                backgroundColor: '#2c2c2c'
              }
            })}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar; 