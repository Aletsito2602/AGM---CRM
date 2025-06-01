import React, { useState } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Layout from './components/Layout';
import Redirect from './components/Redirect';
import DashboardPage from './pages/DashboardPage';
import CuentasPage from './pages/CuentasPage';
import CapitalPage from './pages/CapitalPage';
import RetirosPage from './pages/RetirosPage';
import TicketsSoportePage from './pages/TicketsSoportePage';
import CertificadosPage from './pages/CertificadosPage';
import DescuentosPage from './pages/DescuentosPage';
import AfiliadosPage from './pages/AfiliadosPage';
import BrokerCuentasPage from './pages/BrokerCuentasPage';
import BrokerUsuariosPage from './pages/BrokerUsuariosPage';
import CopytradingPage from './pages/CopytradingPage';
import PammPage from './pages/PammPage';
import BonosPage from './pages/BonosPage';
import CuponesPage from './pages/CuponesPage';
import FacturacionPage from './pages/FacturacionPage';
import ClientesPage from './pages/ClientesPage';
import EmailsPage from './pages/EmailsPage';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [crmType, setCrmType] = useState('prop-firm');

  return (
    <Routes>
      {/* Ruta de login */}
      <Route path="/login" element={<Login />} />

      {/* Rutas protegidas */}
      <Route
        element={
          <ProtectedRoute>
            <Layout crmType={crmType} setCrmType={setCrmType}>
              <Outlet />
            </Layout>
          </ProtectedRoute>
        }
      >
        {/* Redirección desde la raíz */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Rutas Prop Firm */}
        <Route path="/dashboard" element={<DashboardPage crmType={crmType} />} />
        <Route path="/cuentas" element={<CuentasPage />} />
        <Route path="/capital" element={<CapitalPage />} />
        <Route path="/retiros" element={<RetirosPage />} />
        <Route path="/tickets-soporte" element={<TicketsSoportePage />} />
        <Route path="/certificados" element={<CertificadosPage />} />
        <Route path="/descuentos" element={<DescuentosPage />} />
        <Route path="/afiliados" element={<AfiliadosPage />} />
        <Route path="/cupones" element={<CuponesPage />} />
        <Route path="/facturacion" element={<FacturacionPage />} />
        <Route path="/clientes" element={<ClientesPage />} />
        <Route path="/emails" element={<EmailsPage />} />

        {/* Rutas Broker */}
        <Route path="/dashboard-broker" element={<DashboardPage crmType={crmType} />} />
        <Route path="/broker-cuentas" element={<BrokerCuentasPage />} />
        <Route path="/broker-usuarios" element={<BrokerUsuariosPage />} />
        <Route path="/copytrading" element={<CopytradingPage />} />
        <Route path="/pamm" element={<PammPage />} />
        <Route path="/bonos" element={<BonosPage />} />
      </Route>

      {/* 404 - Página no encontrada */}
      <Route path="*" element={
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          color: '#b0c4de',
          fontSize: '1.5rem'
        }}>
          Página no encontrada
        </div>
      } />
    </Routes>
  );
}

export default App; 