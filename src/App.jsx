import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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
    <Layout crmType={crmType} setCrmType={setCrmType}>
      <Routes>
        {/* Redirección desde la raíz */}
        <Route path="/" element={<Redirect crmType={crmType} />} />

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

        {/* Rutas de login y protecciones */}
        <Route path="/login" element={<Login />} />
        <Route
          path="/cuentas"
          element={
            <ProtectedRoute>
              <CuentasPage />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/cuentas" replace />} />

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
    </Layout>
  );
}

export default App; 