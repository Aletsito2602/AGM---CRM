import React from 'react';
import UserProfile from '../components/UserProfile';

const BrokerUsuariosPage = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ color: '#b0c4de', marginBottom: '20px' }}>Usuarios Registrados (Broker)</h1>
      <UserProfile />
    </div>
  );
};

export default BrokerUsuariosPage; 