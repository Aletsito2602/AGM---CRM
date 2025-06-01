import React, { useState, useMemo, useRef } from 'react';

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

// Datos de ejemplo para capital y PNL
const fakeCapitalData = {
  capitalFase1: 0,
  capitalFase2: 0,
  capitalReal: 0,
  pnlFase1: 0,
  pnlFase2: 0,
  pnlReal: 0,
  // Nuevos datos para tiempos promedio
  tiempoPromedioF1: 0, // días
  tiempoPromedioF2: 0, // días
  tiempoPromedioRetiro: 0, // días
  // Datos para distribución de cuentas
  distribucionCuentas: {
    total: [
      { size: '100K', porcentaje: 0 },
      { size: '50K', porcentaje: 0 },
      { size: '25K', porcentaje: 0 },
      { size: '10K', porcentaje: 0 }
    ],
    fase1: [
      { size: '100K', porcentaje: 0 },
      { size: '50K', porcentaje: 0 },
      { size: '25K', porcentaje: 0 },
      { size: '10K', porcentaje: 0 }
    ],
    fase2: [
      { size: '100K', porcentaje: 0 },
      { size: '50K', porcentaje: 0 },
      { size: '25K', porcentaje: 0 },
      { size: '10K', porcentaje: 0 }
    ],
    real: [
      { size: '100K', porcentaje: 0 },
      { size: '50K', porcentaje: 0 },
      { size: '25K', porcentaje: 0 },
      { size: '10K', porcentaje: 0 }
    ]
  },
  tamanoPromedioCuenta: 0,
  // Datos de ingresos
  ingresos: {
    promedioPorCliente: 0,
    totalVentasCuentas: 0,
    hoy: 0,
    ayer: 0,
    ultimos30Dias: 0
  },
  // Datos de pagos a traders
  pagosTraders: {
    totalPagos: 0,
    promedioPorTrader: 0,
    porcentajeRetiros: 0,
    tasaReembolso: {
      porcentaje: 0,
      monto: 0
    }
  },
  // Datos de afiliados
  afiliados: {
    totalPagos: 0,
    promedioPago: 0,
    promedioDescuentos: 0,
    porcentajeReferidos: 0
  },
  // Datos de profit
  profit: {
    ingresosTotales: 0,
    egresosTotales: 0,
    ganancia: 0
  }
};

const CapitalPage = () => {
  const [filtroPeriodo, setFiltroPeriodo] = useState('30d');
  const [filtroFechaInicio, setFiltroFechaInicio] = useState('');
  const [filtroFechaFin, setFiltroFechaFin] = useState('');

  const calcularEstadisticas = () => {
    return {
      capitalTotal: fakeCapitalData.capitalFase1 + fakeCapitalData.capitalFase2 + fakeCapitalData.capitalReal,
      capitalFase1: fakeCapitalData.capitalFase1,
      capitalFase2: fakeCapitalData.capitalFase2,
      capitalReal: fakeCapitalData.capitalReal,
      pnlTotal: fakeCapitalData.pnlFase1 + fakeCapitalData.pnlFase2 + fakeCapitalData.pnlReal,
      pnlFase1: fakeCapitalData.pnlFase1,
      pnlFase2: fakeCapitalData.pnlFase2,
      pnlReal: fakeCapitalData.pnlReal,
      tiempoPromedioF1: fakeCapitalData.tiempoPromedioF1,
      tiempoPromedioF2: fakeCapitalData.tiempoPromedioF2,
      tiempoPromedioRetiro: fakeCapitalData.tiempoPromedioRetiro,
      distribucionCuentas: fakeCapitalData.distribucionCuentas,
      tamanoPromedioCuenta: fakeCapitalData.tamanoPromedioCuenta,
      // Nuevas estadísticas
      ingresos: fakeCapitalData.ingresos,
      pagosTraders: fakeCapitalData.pagosTraders,
      afiliados: fakeCapitalData.afiliados,
      profit: fakeCapitalData.profit
    };
  };

  const stats = calcularEstadisticas();

  // Función para generar colores para el gráfico
  const getChartColors = (index) => {
    const colors = ['#28a745', '#17a2b8', '#ffc107', '#dc3545'];
    return colors[index % colors.length];
  };

  const kpiDescriptions = {
    'Capital Total': 'Suma total del capital administrado en todas las fases (Fase 1, Fase 2 y Real).',
    'Capital Fase 1': 'Capital total administrado en cuentas de Fase 1.',
    'Capital Fase 2': 'Capital total administrado en cuentas de Fase 2.',
    'Capital Real': 'Capital total administrado en cuentas reales fondeadas.',
    'PNL Total': 'Ganancia o pérdida total generada por todas las cuentas.',
    'PNL Fase 1': 'Ganancia o pérdida generada por las cuentas de Fase 1.',
    'PNL Fase 2': 'Ganancia o pérdida generada por las cuentas de Fase 2.',
    'PNL Real': 'Ganancia o pérdida generada por las cuentas reales fondeadas.',
    'Superación Fase 1': 'Tiempo promedio que tardan los traders en superar la Fase 1.',
    'Superación Fase 2': 'Tiempo promedio que tardan los traders en superar la Fase 2.',
    'Tiempo hasta Retiro': 'Tiempo promedio que tardan los traders en realizar su primer retiro.',
    'Tamaño Promedio': 'Tamaño promedio de las cuentas administradas.',
    'Ingresos Totales': 'Suma total de ingresos generados por ventas de cuentas.',
    'Egresos Totales': 'Suma total de egresos por pagos a traders y afiliados.',
    'Ganancia Neta': 'Diferencia entre ingresos totales y egresos totales.'
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ marginBottom: '30px', color: '#b0c4de' }}>Capital y PNL</h1>

      {/* Filtros */}
      <div style={{ 
        marginBottom: '20px', 
        padding: '20px', 
        backgroundColor: '#2c2c2c', 
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px'
        }}>
          <div>
            <select 
              value={filtroPeriodo} 
              onChange={(e) => setFiltroPeriodo(e.target.value)}
              style={filterSelectStyle}
            >
              <option value="7d">Últimos 7 días</option>
              <option value="30d">Últimos 30 días</option>
              <option value="90d">Últimos 90 días</option>
              <option value="custom">Personalizado</option>
            </select>
          </div>
          {filtroPeriodo === 'custom' && (
            <>
              <div>
                <input
                  type="date"
                  value={filtroFechaInicio}
                  onChange={(e) => setFiltroFechaInicio(e.target.value)}
                  style={filterInputStyle}
                  placeholder="Fecha Inicio"
                />
              </div>
              <div>
                <input
                  type="date"
                  value={filtroFechaFin}
                  onChange={(e) => setFiltroFechaFin(e.target.value)}
                  style={filterInputStyle}
                  placeholder="Fecha Fin"
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Sección de Capital Administrado */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#b0c4de', marginBottom: '20px' }}>Capital Administrado</h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px'
        }}>
          <div style={kpiCardStyle}>
            <h3 style={{ color: '#b0c4de', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: 4 }}>
              Capital Total
              <Tooltip text={kpiDescriptions['Capital Total']} />
            </h3>
            <p style={{ fontSize: '24px', margin: 0, color: '#17a2b8' }}>
              ${stats.capitalTotal.toLocaleString()}
            </p>
          </div>
          <div style={kpiCardStyle}>
            <h3 style={{ color: '#b0c4de', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: 4 }}>
              Capital Fase 1
              <Tooltip text={kpiDescriptions['Capital Fase 1']} />
            </h3>
            <p style={{ fontSize: '24px', margin: 0, color: '#17a2b8' }}>
              ${stats.capitalFase1.toLocaleString()}
            </p>
          </div>
          <div style={kpiCardStyle}>
            <h3 style={{ color: '#b0c4de', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: 4 }}>
              Capital Fase 2
              <Tooltip text={kpiDescriptions['Capital Fase 2']} />
            </h3>
            <p style={{ fontSize: '24px', margin: 0, color: '#17a2b8' }}>
              ${stats.capitalFase2.toLocaleString()}
            </p>
          </div>
          <div style={kpiCardStyle}>
            <h3 style={{ color: '#b0c4de', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: 4 }}>
              Capital Real
              <Tooltip text={kpiDescriptions['Capital Real']} />
            </h3>
            <p style={{ fontSize: '24px', margin: 0, color: '#17a2b8' }}>
              ${stats.capitalReal.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Sección de PNL sobre Cuentas */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#b0c4de', marginBottom: '20px' }}>PNL sobre Cuentas</h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px'
        }}>
          <div style={kpiCardStyle}>
            <h3 style={{ color: '#b0c4de', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: 4 }}>
              PNL Total
              <Tooltip text={kpiDescriptions['PNL Total']} />
            </h3>
            <p style={{ fontSize: '24px', margin: 0, color: getPnlColor(stats.pnlTotal) }}>
              ${stats.pnlTotal.toLocaleString()}
            </p>
          </div>
          <div style={kpiCardStyle}>
            <h3 style={{ color: '#b0c4de', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: 4 }}>
              PNL Fase 1
              <Tooltip text={kpiDescriptions['PNL Fase 1']} />
            </h3>
            <p style={{ fontSize: '24px', margin: 0, color: getPnlColor(stats.pnlFase1) }}>
              ${stats.pnlFase1.toLocaleString()}
            </p>
          </div>
          <div style={kpiCardStyle}>
            <h3 style={{ color: '#b0c4de', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: 4 }}>
              PNL Fase 2
              <Tooltip text={kpiDescriptions['PNL Fase 2']} />
            </h3>
            <p style={{ fontSize: '24px', margin: 0, color: getPnlColor(stats.pnlFase2) }}>
              ${stats.pnlFase2.toLocaleString()}
            </p>
          </div>
          <div style={kpiCardStyle}>
            <h3 style={{ color: '#b0c4de', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: 4 }}>
              PNL Real
              <Tooltip text={kpiDescriptions['PNL Real']} />
            </h3>
            <p style={{ fontSize: '24px', margin: 0, color: getPnlColor(stats.pnlReal) }}>
              ${stats.pnlReal.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Sección de Tiempos Promedio */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#b0c4de', marginBottom: '20px' }}>Tiempos Promedio de Aprobación</h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px'
        }}>
          <div style={kpiCardStyle}>
            <h3 style={{ color: '#b0c4de', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: 4 }}>
              Superación Fase 1
              <Tooltip text={kpiDescriptions['Superación Fase 1']} />
            </h3>
            <p style={{ fontSize: '24px', margin: 0, color: '#17a2b8' }}>
              {stats.tiempoPromedioF1} días
            </p>
          </div>
          <div style={kpiCardStyle}>
            <h3 style={{ color: '#b0c4de', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: 4 }}>
              Superación Fase 2
              <Tooltip text={kpiDescriptions['Superación Fase 2']} />
            </h3>
            <p style={{ fontSize: '24px', margin: 0, color: '#17a2b8' }}>
              {stats.tiempoPromedioF2} días
            </p>
          </div>
          <div style={kpiCardStyle}>
            <h3 style={{ color: '#b0c4de', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: 4 }}>
              Tiempo hasta Retiro
              <Tooltip text={kpiDescriptions['Tiempo hasta Retiro']} />
            </h3>
            <p style={{ fontSize: '24px', margin: 0, color: '#17a2b8' }}>
              {stats.tiempoPromedioRetiro} días
            </p>
          </div>
        </div>
      </div>

      {/* Sección de Distribución de Cuentas */}
      <div>
        <h2 style={{ color: '#b0c4de', marginBottom: '20px' }}>Distribución de Cuentas</h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px'
        }}>
          <div style={kpiCardStyle}>
            <h3 style={{ color: '#b0c4de', margin: '0 0 10px 0' }}>Tamaño Promedio de Cuenta</h3>
            <p style={{ fontSize: '24px', margin: 0, color: '#17a2b8' }}>
              ${stats.tamanoPromedioCuenta.toLocaleString()}
            </p>
          </div>
          <div style={kpiCardStyle}>
            <h3 style={{ color: '#b0c4de', margin: '0 0 10px 0' }}>Distribución Total</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {stats.distribucionCuentas.total.map((item, index) => (
                <div key={index} style={{
                  backgroundColor: getChartColors(index),
                  padding: '8px 12px',
                  borderRadius: '4px',
                  color: '#fff',
                  fontSize: '0.9em'
                }}>
                  {item.size}: {item.porcentaje}%
                </div>
              ))}
            </div>
          </div>
          <div style={kpiCardStyle}>
            <h3 style={{ color: '#b0c4de', margin: '0 0 10px 0' }}>Distribución Fase 1</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {stats.distribucionCuentas.fase1.map((item, index) => (
                <div key={index} style={{
                  backgroundColor: getChartColors(index),
                  padding: '8px 12px',
                  borderRadius: '4px',
                  color: '#fff',
                  fontSize: '0.9em'
                }}>
                  {item.size}: {item.porcentaje}%
                </div>
              ))}
            </div>
          </div>
          <div style={kpiCardStyle}>
            <h3 style={{ color: '#b0c4de', margin: '0 0 10px 0' }}>Distribución Fase 2</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {stats.distribucionCuentas.fase2.map((item, index) => (
                <div key={index} style={{
                  backgroundColor: getChartColors(index),
                  padding: '8px 12px',
                  borderRadius: '4px',
                  color: '#fff',
                  fontSize: '0.9em'
                }}>
                  {item.size}: {item.porcentaje}%
                </div>
              ))}
            </div>
          </div>
          <div style={kpiCardStyle}>
            <h3 style={{ color: '#b0c4de', margin: '0 0 10px 0' }}>Distribución Real</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {stats.distribucionCuentas.real.map((item, index) => (
                <div key={index} style={{
                  backgroundColor: getChartColors(index),
                  padding: '8px 12px',
                  borderRadius: '4px',
                  color: '#fff',
                  fontSize: '0.9em'
                }}>
                  {item.size}: {item.porcentaje}%
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sección de Ingresos Promedio */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#b0c4de', marginBottom: '20px' }}>Ingresos Promedio</h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px'
        }}>
          <div style={kpiCardStyle}>
            <h3 style={{ color: '#b0c4de', margin: '0 0 10px 0' }}>Ingreso Promedio por Cliente</h3>
            <p style={{ fontSize: '24px', margin: 0, color: '#28a745' }}>
              ${stats.ingresos.promedioPorCliente.toLocaleString()}
            </p>
          </div>
          <div style={kpiCardStyle}>
            <h3 style={{ color: '#b0c4de', margin: '0 0 10px 0' }}>Ingresos Totales por Ventas</h3>
            <p style={{ fontSize: '24px', margin: 0, color: '#28a745' }}>
              ${stats.ingresos.totalVentasCuentas.toLocaleString()}
            </p>
          </div>
          <div style={kpiCardStyle}>
            <h3 style={{ color: '#b0c4de', margin: '0 0 10px 0' }}>Ingresos de Hoy</h3>
            <p style={{ fontSize: '24px', margin: 0, color: '#28a745' }}>
              ${stats.ingresos.hoy.toLocaleString()}
            </p>
          </div>
          <div style={kpiCardStyle}>
            <h3 style={{ color: '#b0c4de', margin: '0 0 10px 0' }}>Ingresos de Ayer</h3>
            <p style={{ fontSize: '24px', margin: 0, color: '#28a745' }}>
              ${stats.ingresos.ayer.toLocaleString()}
            </p>
          </div>
          <div style={kpiCardStyle}>
            <h3 style={{ color: '#b0c4de', margin: '0 0 10px 0' }}>Ingresos Últimos 30 Días</h3>
            <p style={{ fontSize: '24px', margin: 0, color: '#28a745' }}>
              ${stats.ingresos.ultimos30Dias.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Sección de Pagos a Traders */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#b0c4de', marginBottom: '20px' }}>Pagos a Traders</h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px'
        }}>
          <div style={kpiCardStyle}>
            <h3 style={{ color: '#b0c4de', margin: '0 0 10px 0' }}>Total de Pagos</h3>
            <p style={{ fontSize: '24px', margin: 0, color: '#17a2b8' }}>
              ${stats.pagosTraders.totalPagos.toLocaleString()}
            </p>
          </div>
          <div style={kpiCardStyle}>
            <h3 style={{ color: '#b0c4de', margin: '0 0 10px 0' }}>Pago Promedio por Trader</h3>
            <p style={{ fontSize: '24px', margin: 0, color: '#17a2b8' }}>
              ${stats.pagosTraders.promedioPorTrader.toLocaleString()}
            </p>
          </div>
          <div style={kpiCardStyle}>
            <h3 style={{ color: '#b0c4de', margin: '0 0 10px 0' }}>Porcentaje de Retiros</h3>
            <p style={{ fontSize: '24px', margin: 0, color: '#17a2b8' }}>
              {stats.pagosTraders.porcentajeRetiros}%
            </p>
          </div>
          <div style={kpiCardStyle}>
            <h3 style={{ color: '#b0c4de', margin: '0 0 10px 0' }}>Tasa de Reembolso</h3>
            <p style={{ fontSize: '24px', margin: 0, color: '#17a2b8' }}>
              {stats.pagosTraders.tasaReembolso.porcentaje}% (${stats.pagosTraders.tasaReembolso.monto.toLocaleString()})
            </p>
          </div>
        </div>
      </div>

      {/* Sección de Afiliados */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#b0c4de', marginBottom: '20px' }}>Afiliados</h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px'
        }}>
          <div style={kpiCardStyle}>
            <h3 style={{ color: '#b0c4de', margin: '0 0 10px 0' }}>Total de Pagos</h3>
            <p style={{ fontSize: '24px', margin: 0, color: '#ffc107' }}>
              ${stats.afiliados.totalPagos.toLocaleString()}
            </p>
          </div>
          <div style={kpiCardStyle}>
            <h3 style={{ color: '#b0c4de', margin: '0 0 10px 0' }}>Promedio de Pago</h3>
            <p style={{ fontSize: '24px', margin: 0, color: '#ffc107' }}>
              ${stats.afiliados.promedioPago.toLocaleString()}
            </p>
          </div>
          <div style={kpiCardStyle}>
            <h3 style={{ color: '#b0c4de', margin: '0 0 10px 0' }}>Promedio de Descuentos</h3>
            <p style={{ fontSize: '24px', margin: 0, color: '#ffc107' }}>
              {stats.afiliados.promedioDescuentos}%
            </p>
          </div>
          <div style={kpiCardStyle}>
            <h3 style={{ color: '#b0c4de', margin: '0 0 10px 0' }}>Cuentas por Referidos</h3>
            <p style={{ fontSize: '24px', margin: 0, color: '#ffc107' }}>
              {stats.afiliados.porcentajeReferidos}%
            </p>
          </div>
        </div>
      </div>

      {/* Sección de Profit */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#b0c4de', marginBottom: '20px' }}>Profit</h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px'
        }}>
          <div style={kpiCardStyle}>
            <h3 style={{ color: '#b0c4de', margin: '0 0 10px 0' }}>Ingresos Totales</h3>
            <p style={{ fontSize: '24px', margin: 0, color: '#28a745' }}>
              ${stats.profit.ingresosTotales.toLocaleString()}
            </p>
          </div>
          <div style={kpiCardStyle}>
            <h3 style={{ color: '#b0c4de', margin: '0 0 10px 0' }}>Egresos Totales</h3>
            <p style={{ fontSize: '24px', margin: 0, color: '#dc3545' }}>
              ${stats.profit.egresosTotales.toLocaleString()}
            </p>
          </div>
          <div style={kpiCardStyle}>
            <h3 style={{ color: '#b0c4de', margin: '0 0 10px 0' }}>Ganancia</h3>
            <p style={{ fontSize: '24px', margin: 0, color: '#28a745' }}>
              ${stats.profit.ganancia.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Funciones auxiliares
const getPnlColor = (pnl) => {
  return pnl >= 0 ? '#28a745' : '#dc3545';
};

// Estilos
const kpiCardStyle = {
  backgroundColor: '#2c2c2c',
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
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

const filterSelectStyle = {
  width: '100%',
  padding: '10px',
  backgroundColor: '#383838',
  color: 'rgba(255,255,255,0.9)',
  border: '1px solid #555',
  borderRadius: '4px',
  fontSize: '0.9em'
};

export default CapitalPage; 