import React, { useState, useRef } from 'react';

// --- DATOS ESTÁTICOS DE EJEMPLO ---

// Datos de ejemplo para Prop Firm
const kpiDataPropFirm = {
  accounting: {
    usuarios: [
      { id: 1, titulo: 'Usuarios Registrados', valor: '0', tendencia: '0%', color: '#28a745' },
      { id: 2, titulo: 'Clientes Totales', valor: '0', tendencia: '0%', color: '#17a2b8' },
      { id: 3, titulo: 'Porcentaje de Conversión', valor: '0%', tendencia: '0%', color: '#ffc107' }
    ],
    cuentasActivas: [
      { id: 1, titulo: 'Cuentas Activas Totales', valor: '0', tendencia: '0%', color: '#28a745' },
      { id: 2, titulo: 'Cuentas Activas F1', valor: '0', tendencia: '0%', color: '#17a2b8' },
      { id: 3, titulo: 'Cuentas Activas F2', valor: '0', tendencia: '0%', color: '#ffc107' },
      { id: 4, titulo: 'Cuentas Reales Activas', valor: '0', tendencia: '0%', color: '#28a745' }
    ],
    cuentasInactivas: [
      { id: 1, titulo: 'Cuentas Inactivas Totales', valor: '0', tendencia: '0%', color: '#dc3545' },
      { id: 2, titulo: 'Cuentas Inactivas F1', valor: '0', tendencia: '0%', color: '#dc3545' },
      { id: 3, titulo: 'Cuentas Inactivas F2', valor: '0', tendencia: '0%', color: '#dc3545' },
      { id: 4, titulo: 'Cuentas Reales Inactivas', valor: '0', tendencia: '0%', color: '#dc3545' }
    ],
    conversionCuentas: [
      { id: 1, titulo: 'Conv. F1 -> F2', valor: '0% (0)', tendencia: '0%', color: '#28a745' },
      { id: 2, titulo: 'Conv. F2 -> Fondeada', valor: '0% (0)', tendencia: '0%', color: '#17a2b8' }
    ],
    tasaPerdida: [
      { id: 1, titulo: 'Pérdidas F1', valor: '0', tendencia: '0%', color: '#dc3545' },
      { id: 2, titulo: 'Pérdidas F2', valor: '0', tendencia: '0%', color: '#dc3545' },
      { id: 3, titulo: 'Pérdidas Real', valor: '0', tendencia: '0%', color: '#dc3545' },
      { id: 4, titulo: 'Tasa de Retiro', valor: '0%', tendencia: '0%', color: '#dc3545' }
    ],
    capitalAdministrado: [
      { id: 1, titulo: 'Capital F1', valor: '$0', tendencia: '0%', color: '#28a745' },
      { id: 2, titulo: 'Capital F2', valor: '$0', tendencia: '0%', color: '#17a2b8' },
      { id: 3, titulo: 'Capital Real', valor: '$0', tendencia: '0%', color: '#ffc107' }
    ],
    pnlCuentas: [
      { id: 1, titulo: 'PNL F1', valor: '+$0', tendencia: '0%', color: '#28a745' },
      { id: 2, titulo: 'PNL F2', valor: '+$0', tendencia: '0%', color: '#17a2b8' },
      { id: 3, titulo: 'PNL Real', valor: '+$0', tendencia: '0%', color: '#ffc107' }
    ],
    tiempoPromedio: [
      { id: 1, titulo: 'Superación F1', valor: '0 días', tendencia: '0', color: '#28a745' },
      { id: 2, titulo: 'Superación F2', valor: '0 días', tendencia: '0', color: '#17a2b8' },
      { id: 3, titulo: 'Primer Retiro', valor: '0 días', tendencia: '0', color: '#ffc107' }
    ]
  },
  pnl: {
    promedioCuenta: [
      { id: 1, titulo: 'Tamaño Promedio', valor: '$0', tendencia: '0%', color: '#28a745' },
      { id: 2, titulo: 'Distribución F1', valor: 'Ver Gráfico', tipo: 'grafico', color: '#17a2b8' },
      { id: 3, titulo: 'Distribución F2', valor: 'Ver Gráfico', tipo: 'grafico', color: '#ffc107' },
      { id: 4, titulo: 'Distribución Real', valor: 'Ver Gráfico', tipo: 'grafico', color: '#28a745' }
    ],
    ingresosPromedio: [
      { id: 1, titulo: 'Ingreso/Cliente', valor: '$0', tendencia: '0%', color: '#28a745' },
      { id: 2, titulo: 'Ingresos Totales', valor: '$0', tendencia: '0%', color: '#17a2b8' },
      { id: 3, titulo: 'Ingresos Hoy', valor: '$0', tendencia: '0%', color: '#ffc107' },
      { id: 4, titulo: 'Ingresos 30d', valor: '$0', tendencia: '0%', color: '#28a745' }
    ],
    pagosTraders: [
      { id: 1, titulo: 'Total Pagos', valor: '$0', tendencia: '0%', color: '#dc3545' },
      { id: 2, titulo: 'Pago Promedio', valor: '$0', tendencia: '0%', color: '#17a2b8' },
      { id: 3, titulo: '% Traders Retiran', valor: '0%', tendencia: '0%', color: '#ffc107' },
      { id: 4, titulo: 'Tasa Reembolso', valor: '0%', tendencia: '0%', color: '#28a745' }
    ],
    afiliados: [
      { id: 1, titulo: 'Total Pagos', valor: '$0', tendencia: '0%', color: '#dc3545' },
      { id: 2, titulo: 'Pago Promedio', valor: '$0', tendencia: '0%', color: '#17a2b8' },
      { id: 3, titulo: 'Prom. Descuentos', valor: '0%', tendencia: '0%', color: '#ffc107' },
      { id: 4, titulo: '% Cuentas Referidas', valor: '0%', tendencia: '0%', color: '#28a745' }
    ],
    profit: [
      { id: 1, titulo: 'Ingresos Totales', valor: '$0', tendencia: '0%', color: '#28a745' },
      { id: 2, titulo: 'Egresos Totales', valor: '$0', tendencia: '0%', color: '#dc3545' },
      { id: 3, titulo: 'Ganancia', valor: '$0', tendencia: '0%', color: '#28a745' }
    ]
  }
};

// Datos de ejemplo para Broker
const kpiDataBroker = {
  general: [
    { id: 1, titulo: 'Total Usuarios', valor: '0', tendencia: '0%', color: '#28a745' },
    { id: 2, titulo: 'Usuarios Activos', valor: '0', tendencia: '0%', color: '#17a2b8' },
    { id: 3, titulo: 'Volumen Mensual', valor: '$0', tendencia: '0%', color: '#ffc107' },
    { id: 4, titulo: 'Comisiones', valor: '$0', tendencia: '0%', color: '#28a745' }
  ],
  copytrading: [
    { id: 1, titulo: 'Traders Activos', valor: '0', tendencia: '0%', color: '#28a745' },
    { id: 2, titulo: 'Seguidores', valor: '0', tendencia: '0%', color: '#17a2b8' },
    { id: 3, titulo: 'Volumen Copytrading', valor: '$0', tendencia: '0%', color: '#ffc107' },
    { id: 4, titulo: 'Comisiones CT', valor: '$0', tendencia: '0%', color: '#28a745' }
  ],
  pamm: [
    { id: 1, titulo: 'Cuentas PAMM', valor: '0', tendencia: '0%', color: '#28a745' },
    { id: 2, titulo: 'Inversores', valor: '0', tendencia: '0%', color: '#17a2b8' },
    { id: 3, titulo: 'Volumen PAMM', valor: '$0', tendencia: '0%', color: '#ffc107' },
    { id: 4, titulo: 'Comisiones PAMM', valor: '$0', tendencia: '0%', color: '#28a745' }
  ]
};

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

// Descripciones para los tooltips de cada KPI
const kpiDescriptions = {
  'Usuarios Registrados': 'Cantidad total de usuarios que se han registrado en la plataforma.',
  'Clientes Totales': 'Total de clientes activos y pasivos en el sistema.',
  'Porcentaje de Conversión': 'Porcentaje de usuarios que se convierten en clientes.',
  'Cuentas Activas Totales': 'Cantidad de cuentas actualmente activas.',
  'Cuentas Activas F1': 'Cuentas activas en la Fase 1 del challenge.',
  'Cuentas Activas F2': 'Cuentas activas en la Fase 2 del challenge.',
  'Cuentas Reales Activas': 'Cuentas reales activas (ya fondeadas).',
  'Cuentas Inactivas Totales': 'Cantidad de cuentas actualmente inactivas.',
  'Cuentas Inactivas F1': 'Cuentas inactivas en la Fase 1.',
  'Cuentas Inactivas F2': 'Cuentas inactivas en la Fase 2.',
  'Cuentas Reales Inactivas': 'Cuentas reales inactivas (ya fondeadas).',
  'Conv. F1 -> F2': 'Porcentaje y cantidad de cuentas que pasaron de Fase 1 a Fase 2.',
  'Conv. F2 -> Fondeada': 'Porcentaje y cantidad de cuentas que pasaron de Fase 2 a fondeada.',
  'Pérdidas F1': 'Cantidad de cuentas que perdieron en Fase 1.',
  'Pérdidas F2': 'Cantidad de cuentas que perdieron en Fase 2.',
  'Pérdidas Real': 'Cantidad de cuentas reales que tuvieron pérdidas.',
  'Tasa de Retiro': 'Porcentaje de cuentas que solicitaron retiro.',
  'Capital F1': 'Capital total gestionado en cuentas Fase 1.',
  'Capital F2': 'Capital total gestionado en cuentas Fase 2.',
  'Capital Real': 'Capital total gestionado en cuentas reales.',
  'PNL F1': 'Profit and Loss (ganancia/pérdida) de cuentas Fase 1.',
  'PNL F2': 'Profit and Loss (ganancia/pérdida) de cuentas Fase 2.',
  'PNL Real': 'Profit and Loss (ganancia/pérdida) de cuentas reales.',
  'Superación F1': 'Días promedio para superar la Fase 1.',
  'Superación F2': 'Días promedio para superar la Fase 2.',
  'Primer Retiro': 'Días promedio hasta el primer retiro.',
  'Tamaño Promedio': 'Tamaño promedio de las cuentas adquiridas.',
  'Distribución F1': 'Distribución de tamaños de cuenta en Fase 1.',
  'Distribución F2': 'Distribución de tamaños de cuenta en Fase 2.',
  'Distribución Real': 'Distribución de tamaños de cuenta en cuentas reales.',
  'Ingreso/Cliente': 'Ingreso promedio generado por cada cliente.',
  'Ingresos Totales': 'Ingresos totales generados por la plataforma.',
  'Ingresos Hoy': 'Ingresos generados en el día actual.',
  'Ingresos 30d': 'Ingresos generados en los últimos 30 días.',
  'Total Pagos': 'Total de pagos realizados a traders o afiliados.',
  'Pago Promedio': 'Pago promedio realizado a traders o afiliados.',
  '% Traders Retiran': 'Porcentaje de traders que han realizado retiros.',
  'Tasa Reembolso': 'Porcentaje de reembolsos realizados.',
  'Prom. Descuentos': 'Promedio de descuentos aplicados.',
  '% Cuentas Referidas': 'Porcentaje de cuentas que provienen de referidos.',
  'Egresos Totales': 'Egresos totales de la plataforma.',
  'Ganancia': 'Ganancia neta de la plataforma.'
};

const DashboardCard = ({ titulo, valor, tendencia, color }) => (
  <div style={{
    backgroundColor: '#2c2c2c',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  }}>
    <h3 style={{ color: '#b0c4de', margin: '0 0 10px 0', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 4 }}>
      {titulo}
      <Tooltip text={kpiDescriptions[titulo] || 'Sin descripción disponible.'} />
    </h3>
    <p style={{ fontSize: '24px', margin: '0 0 10px 0', color: '#b0c4de' }}>{valor}</p>
    <p style={{ 
      margin: 0, 
      color: tendencia && tendencia.startsWith('+') ? '#28a745' : '#dc3545',
      fontSize: '0.9rem'
    }}>
      {tendencia || ''}
    </p>
  </div>
);

const Section = ({ titulo, kpis }) => (
  <div style={{ marginBottom: '30px' }}>
    <h2 style={{ color: '#b0c4de', marginBottom: '20px' }}>{titulo}</h2>
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: '20px'
    }}>
      {kpis.map(kpi => (
        <DashboardCard key={kpi.id} {...kpi} />
      ))}
    </div>
  </div>
);

const DashboardPage = ({ crmType }) => {
  const [filtros, setFiltros] = useState({
    periodo: '30d',
    tamanoCuenta: 'todos',
    pais: 'todos',
    fechaInicio: '',
    fechaFin: '',
    vista: 'accounting'
  });

  const handleFiltroChange = (campo, valor) => {
    console.log('Cambiando filtro:', campo, valor);
    setFiltros(prev => ({ ...prev, [campo]: valor }));
  };

  const data = crmType === 'prop-firm' ? kpiDataPropFirm : kpiDataBroker;
  console.log('Tipo CRM:', crmType);
  console.log('Vista actual:', filtros.vista);
  console.log('Datos disponibles:', data);

  // Función para renderizar secciones de PNL de forma segura
  const renderPnlSections = () => {
    if (!data?.pnl) {
      console.log('No hay datos PNL disponibles');
      return null;
    }

    const sections = [
      { titulo: "Promedio de Cuenta", kpis: data.pnl.promedioCuenta },
      { titulo: "Ingresos Promedio", kpis: data.pnl.ingresosPromedio },
      { titulo: "Pagos a Traders", kpis: data.pnl.pagosTraders },
      { titulo: "Afiliados", kpis: data.pnl.afiliados },
      { titulo: "Profit", kpis: data.pnl.profit }
    ];

    return sections.map((section, index) => (
      <Section 
        key={index}
        titulo={section.titulo} 
        kpis={section.kpis || []} 
      />
    ));
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ color: '#b0c4de', marginBottom: '20px' }}>
          {crmType === 'prop-firm' ? 'Dashboard Prop Firm' : 'Dashboard Broker'}
        </h1>
        
        {/* Sección de Filtros */}
        <div style={{ 
          marginBottom: '30px', 
          padding: '20px', 
          backgroundColor: '#2c2c2c',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#b0c4de' }}>Filtros Globales</h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '15px'
          }}>
            {/* Filtro de Vista */}
            <div>
              <label style={{ display: 'block', marginBottom: '5px', color: '#b0c4de' }}>Vista</label>
              <select 
                value={filtros.vista} 
                onChange={(e) => handleFiltroChange('vista', e.target.value)}
                style={filterSelectStyle}
              >
                <option value="accounting">Accounting</option>
                <option value="pnl">PNL</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', color: '#b0c4de' }}>Periodo</label>
              <select 
                value={filtros.periodo} 
                onChange={(e) => handleFiltroChange('periodo', e.target.value)}
                style={filterSelectStyle}
              >
                <option value="7d">Últimos 7 días</option>
                <option value="30d">Últimos 30 días</option>
                <option value="90d">Últimos 90 días</option>
                <option value="custom">Personalizado</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', color: '#b0c4de' }}>Tamaño de Cuenta</label>
              <select 
                value={filtros.tamanoCuenta} 
                onChange={(e) => handleFiltroChange('tamanoCuenta', e.target.value)}
                style={filterSelectStyle}
              >
                <option value="todos">Todos</option>
                <option value="5k">$5,000</option>
                <option value="10k">$10,000</option>
                <option value="25k">$25,000</option>
                <option value="50k">$50,000</option>
                <option value="100k">$100,000</option>
                <option value="200k">$200,000</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', color: '#b0c4de' }}>País</label>
              <select 
                value={filtros.pais} 
                onChange={(e) => handleFiltroChange('pais', e.target.value)}
                style={filterSelectStyle}
              >
                <option value="todos">Todos</option>
                <option value="es">España</option>
                <option value="mx">México</option>
                <option value="ar">Argentina</option>
                <option value="co">Colombia</option>
                <option value="cl">Chile</option>
              </select>
            </div>

            {filtros.periodo === 'custom' && (
              <>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#b0c4de' }}>Fecha Inicio</label>
                  <input 
                    type="date" 
                    value={filtros.fechaInicio}
                    onChange={(e) => handleFiltroChange('fechaInicio', e.target.value)}
                    style={filterInputStyle}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#b0c4de' }}>Fecha Fin</label>
                  <input 
                    type="date" 
                    value={filtros.fechaFin}
                    onChange={(e) => handleFiltroChange('fechaFin', e.target.value)}
                    style={filterInputStyle}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {crmType === 'prop-firm' && filtros.vista === 'accounting' && (
        <>
          <Section titulo="Usuarios" kpis={data.accounting.usuarios} />
          <Section titulo="Cuentas Activas" kpis={data.accounting.cuentasActivas} />
          <Section titulo="Cuentas Inactivas" kpis={data.accounting.cuentasInactivas} />
          <Section titulo="Conversión de Cuentas" kpis={data.accounting.conversionCuentas} />
          <Section titulo="Tasa de Pérdida" kpis={data.accounting.tasaPerdida} />
          <Section titulo="Capital Administrado" kpis={data.accounting.capitalAdministrado} />
          <Section titulo="PNL sobre Cuentas" kpis={data.accounting.pnlCuentas} />
          <Section titulo="Tiempo Promedio" kpis={data.accounting.tiempoPromedio} />
        </>
      )}

      {crmType === 'prop-firm' && filtros.vista === 'pnl' && renderPnlSections()}

      {crmType === 'broker' && (
        <>
          <Section titulo="General" kpis={data.general} />
          <Section titulo="Copytrading/PAMM" kpis={data.copytrading} />
          <Section titulo="PAMM" kpis={data.pamm} />
        </>
      )}
    </div>
  );
};

// Estilos para filtros
const filterSelectStyle = { 
  width: '100%',
  padding: '10px', 
  backgroundColor: '#383838', 
  color: 'rgba(255,255,255,0.9)', 
  border: '1px solid #555', 
  borderRadius: '4px',
  fontSize: '0.9em'
};

const filterInputStyle = { 
  width: '100%',
  padding: '10px', 
  backgroundColor: '#383838', 
  color: 'rgba(255,255,255,0.9)', 
  border: '1px solid #555', 
  borderRadius: '4px',
  fontSize: '0.9em'
};

export default DashboardPage; 