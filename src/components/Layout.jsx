import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children, crmType, setCrmType }) => {
  return (
    <div style={{ 
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#121212'
    }}>
      <Sidebar crmType={crmType} setCrmType={setCrmType} />
      <main style={{
        flex: 1,
        marginLeft: '250px', // Ancho del sidebar
        padding: '15px',
        backgroundColor: '#121212',
        minHeight: '100vh',
        boxSizing: 'border-box'
      }}>
        {children}
      </main>
    </div>
  );
};

export default Layout; 