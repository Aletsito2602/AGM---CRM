import React, { useState, useRef, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../services/firebase';

// Tooltip visual reutilizable
const Tooltip = ({ text }) => {
  const [visible, setVisible] = useState(false);
  const iconRef = useRef(null);
  const tooltipRef = useRef(null);
  const tooltipBoxStyle = {
    width: '260px',
    background: 'linear-gradient(135deg, #232b3e 60%, #1a1a1a 100%)',
    color: '#e0e6f0',
    textAlign: 'left',
    borderRadius: '10px',
    padding: '14px 16px',
    position: 'absolute',
    zIndex: 2147483647,
    top: '135%',
    left: '50%',
    marginLeft: '-130px',
    opacity: 1,
    fontSize: '1em',
    boxShadow: '0 4px 16px rgba(40,60,100,0.25)',
    border: '1px solid #2c3e50',
    pointerEvents: 'auto',
    transition: 'opacity 0.3s',
    lineHeight: 1.5
  };
  React.useEffect(() => {
    function handleClickOutside(event) {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target) &&
        iconRef.current &&
        !iconRef.current.contains(event.target)
      ) {
        setVisible(false);
      }
    }
    if (visible) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [visible]);
  return (
    <span style={{ position: 'relative', display: 'inline-block', marginLeft: 5 }}>
      <span
        ref={iconRef}
        style={{ cursor: 'pointer', color: '#17a2b8', fontWeight: 'bold' }}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setTimeout(() => setVisible(false), 200)}
        onClick={() => setVisible(v => !v)}
        tabIndex={0}
        aria-label="Mostrar información"
      >
        ℹ️
      </span>
      {visible && (
        <span
          ref={tooltipRef}
          style={tooltipBoxStyle}
          onMouseEnter={() => setVisible(true)}
          onMouseLeave={() => setVisible(false)}
        >
          {text}
        </span>
      )}
    </span>
  );
};

const DashboardPage = () => {
  const [stats, setStats] = useState({
    usuarios: {
      total: 0,
      activos: 0,
      inactivos: 0
    },
    cuentas: {
      total: 0,
      activas: 0,
      inactivas: 0,
      fase1: 0,
      fase2: 0,
      real: 0
    },
    capital: {
      total: 0,
      fase1: 0,
      fase2: 0,
      real: 0
    },
    retiros: {
      pendientes: 0,
      totalPendiente: 0,
      procesadosMes: 0,
      totalPagadoMes: 0
    },
    afiliados: {
      total: 0,
      tier1: 0,
      tier2: 0,
      tier3: 0,
      comisionTotal: 0,
      comisionPendiente: 0
    },
    descuentos: {
      total: 0,
      activos: 0,
      inactivos: 0
    }
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Obtener usuarios
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Obtener cuentas
        const accountsSnapshot = await getDocs(collection(db, 'tradingAccounts'));
        const accounts = accountsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Obtener retiros
        const withdrawalsSnapshot = await getDocs(collection(db, 'withdrawals'));
        const withdrawals = withdrawalsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Obtener afiliados
        const affiliatesSnapshot = await getDocs(collection(db, 'affiliates'));
        const affiliates = affiliatesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Obtener descuentos
        const discountsSnapshot = await getDocs(collection(db, 'discounts'));
        const discounts = discountsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Calcular estadísticas
        const newStats = {
          usuarios: {
            total: users.length,
            activos: users.filter(u => u.status === 'Activo').length,
            inactivos: users.filter(u => u.status === 'Inactivo').length
          },
          cuentas: {
            total: accounts.length,
            activas: accounts.filter(a => a.status === 'Activa').length,
            inactivas: accounts.filter(a => a.status === 'Inactiva').length,
            fase1: accounts.filter(a => a.challengePhase === '1 FASE').length,
            fase2: accounts.filter(a => a.challengePhase === '2 FASE').length,
            real: accounts.filter(a => a.challengePhase === 'REAL').length
          },
          capital: {
            total: accounts.reduce((sum, acc) => sum + (acc.balanceActual || 0), 0),
            fase1: accounts
              .filter(a => a.challengePhase === '1 FASE')
              .reduce((sum, acc) => sum + (acc.balanceActual || 0), 0),
            fase2: accounts
              .filter(a => a.challengePhase === '2 FASE')
              .reduce((sum, acc) => sum + (acc.balanceActual || 0), 0),
            real: accounts
              .filter(a => a.challengePhase === 'REAL')
              .reduce((sum, acc) => sum + (acc.balanceActual || 0), 0)
          },
          retiros: {
            pendientes: withdrawals.filter(w => w.status === 'Pendiente').length,
            totalPendiente: withdrawals
              .filter(w => w.status === 'Pendiente')
              .reduce((sum, w) => sum + (w.amount || 0), 0),
            procesadosMes: withdrawals
              .filter(w => w.status === 'Procesado' && isThisMonth(w.processedAt))
              .length,
            totalPagadoMes: withdrawals
              .filter(w => w.status === 'Procesado' && isThisMonth(w.processedAt))
              .reduce((sum, w) => sum + (w.amount || 0), 0)
          },
          afiliados: {
            total: affiliates.length,
            tier1: affiliates.filter(a => a.tier === 1).length,
            tier2: affiliates.filter(a => a.tier === 2).length,
            tier3: affiliates.filter(a => a.tier === 3).length,
            comisionTotal: affiliates.reduce((sum, a) => sum + (a.totalCommission || 0), 0),
            comisionPendiente: affiliates.reduce((sum, a) => sum + (a.pendingCommission || 0), 0)
          },
          descuentos: {
            total: discounts.length,
            activos: discounts.filter(d => d.status === 'Activo').length,
            inactivos: discounts.filter(d => d.status === 'Inactivo').length
          }
        };

        setStats(newStats);
      } catch (err) {
        console.error('Error al cargar estadísticas:', err);
        setError('Error al cargar las estadísticas');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const isThisMonth = (date) => {
    if (!date) return false;
    const d = date.toDate();
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  };

  if (loading) {
    return <div style={loadingStyle}>Cargando estadísticas...</div>;
  }

  if (error) {
    return <div style={errorStyle}>{error}</div>;
  }

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Dashboard</h1>

      {/* Sección de Usuarios */}
      <Section titulo="Usuarios">
        <DashboardCard
          titulo="Total Usuarios"
          valor={stats.usuarios.total}
          color="#28a745"
        />
        <DashboardCard
          titulo="Usuarios Activos"
          valor={stats.usuarios.activos}
          color="#17a2b8"
        />
        <DashboardCard
          titulo="Usuarios Inactivos"
          valor={stats.usuarios.inactivos}
          color="#dc3545"
        />
      </Section>

      {/* Sección de Cuentas */}
      <Section titulo="Cuentas">
        <DashboardCard
          titulo="Total Cuentas"
          valor={stats.cuentas.total}
          color="#28a745"
        />
        <DashboardCard
          titulo="Cuentas Activas"
          valor={stats.cuentas.activas}
          color="#17a2b8"
        />
        <DashboardCard
          titulo="Cuentas Inactivas"
          valor={stats.cuentas.inactivas}
          color="#dc3545"
        />
        <DashboardCard
          titulo="Fase 1"
          valor={stats.cuentas.fase1}
          color="#ffc107"
        />
        <DashboardCard
          titulo="Fase 2"
          valor={stats.cuentas.fase2}
          color="#17a2b8"
        />
        <DashboardCard
          titulo="Cuentas Reales"
          valor={stats.cuentas.real}
          color="#28a745"
        />
      </Section>

      {/* Sección de Capital */}
      <Section titulo="Capital Administrado">
        <DashboardCard
          titulo="Capital Total"
          valor={`$${stats.capital.total.toLocaleString()}`}
          color="#28a745"
        />
        <DashboardCard
          titulo="Capital Fase 1"
          valor={`$${stats.capital.fase1.toLocaleString()}`}
          color="#17a2b8"
        />
        <DashboardCard
          titulo="Capital Fase 2"
          valor={`$${stats.capital.fase2.toLocaleString()}`}
          color="#ffc107"
        />
        <DashboardCard
          titulo="Capital Real"
          valor={`$${stats.capital.real.toLocaleString()}`}
          color="#28a745"
        />
      </Section>

      {/* Sección de Retiros */}
      <Section titulo="Retiros">
        <DashboardCard
          titulo="Retiros Pendientes"
          valor={stats.retiros.pendientes}
          color="#ffc107"
        />
        <DashboardCard
          titulo="Total a Pagar"
          valor={`$${stats.retiros.totalPendiente.toLocaleString()}`}
          color="#28a745"
        />
        <DashboardCard
          titulo="Retiros Procesados (Mes)"
          valor={stats.retiros.procesadosMes}
          color="#17a2b8"
        />
        <DashboardCard
          titulo="Total Pagado (Mes)"
          valor={`$${stats.retiros.totalPagadoMes.toLocaleString()}`}
          color="#28a745"
        />
      </Section>

      {/* Sección de Afiliados */}
      <Section titulo="Afiliados">
        <DashboardCard
          titulo="Total Afiliados"
          valor={stats.afiliados.total}
          color="#28a745"
        />
        <DashboardCard
          titulo="Tier 1"
          valor={stats.afiliados.tier1}
          color="#17a2b8"
        />
        <DashboardCard
          titulo="Tier 2"
          valor={stats.afiliados.tier2}
          color="#ffc107"
        />
        <DashboardCard
          titulo="Tier 3"
          valor={stats.afiliados.tier3}
          color="#dc3545"
        />
        <DashboardCard
          titulo="Comisión Total"
          valor={`$${stats.afiliados.comisionTotal.toLocaleString()}`}
          color="#28a745"
        />
        <DashboardCard
          titulo="Comisión Pendiente"
          valor={`$${stats.afiliados.comisionPendiente.toLocaleString()}`}
          color="#ffc107"
        />
      </Section>

      {/* Sección de Descuentos */}
      <Section titulo="Descuentos">
        <DashboardCard
          titulo="Total Descuentos"
          valor={stats.descuentos.total}
          color="#28a745"
        />
        <DashboardCard
          titulo="Descuentos Activos"
          valor={stats.descuentos.activos}
          color="#17a2b8"
        />
        <DashboardCard
          titulo="Descuentos Inactivos"
          valor={stats.descuentos.inactivos}
          color="#dc3545"
        />
      </Section>
    </div>
  );
};

// Componentes auxiliares
const Section = ({ titulo, children }) => (
  <div style={sectionStyle}>
    <h2 style={sectionTitleStyle}>{titulo}</h2>
    <div style={sectionContentStyle}>
      {children}
    </div>
  </div>
);

const DashboardCard = ({ titulo, valor, color }) => (
  <div style={cardStyle}>
    <h3 style={cardTitleStyle}>{titulo}</h3>
    <p style={{ ...cardValueStyle, color }}>{valor}</p>
  </div>
);

// Estilos
const containerStyle = {
  padding: '20px',
  backgroundColor: '#1a1a1a',
  minHeight: '100vh'
};

const titleStyle = {
  color: '#b0c4de',
  marginBottom: '30px'
};

const sectionStyle = {
  marginBottom: '30px'
};

const sectionTitleStyle = {
  color: '#b0c4de',
  marginBottom: '20px'
};

const sectionContentStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '20px'
};

const cardStyle = {
  backgroundColor: '#2c2c2c',
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
};

const cardTitleStyle = {
  color: '#b0c4de',
  margin: '0 0 10px 0',
  fontSize: '1rem'
};

const cardValueStyle = {
  fontSize: '24px',
  margin: 0,
  fontWeight: 'bold'
};

const loadingStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '200px',
  color: '#b0c4de'
};

const errorStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '200px',
  color: '#dc3545'
};

export default DashboardPage; 