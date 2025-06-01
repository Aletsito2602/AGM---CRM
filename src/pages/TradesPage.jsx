import React, { useState, useMemo } from 'react';

// Datos de ejemplo para trades
const fakeTradesData = [
  {
    id: 1,
    numeroCuenta: 'AGM-1234',
    trader: 'Juan Pérez',
    fecha: '2024-03-15 14:30:00',
    simbolo: 'EURUSD',
    tipo: 'Compra',
    volumen: 0.1,
    precioEntrada: 1.0850,
    precioSalida: 1.0900,
    sl: 1.0800,
    tp: 1.0900,
    resultado: 50,
    resultadoPorcentual: 0.5,
    duracion: '2h 30m',
    fase: 'Fase 1',
    estado: 'Cerrada',
    notas: 'Operación exitosa'
  },
  {
    id: 2,
    numeroCuenta: 'AGM-1234',
    trader: 'Juan Pérez',
    fecha: '2024-03-15 10:15:00',
    simbolo: 'GBPUSD',
    tipo: 'Venta',
    volumen: 0.2,
    precioEntrada: 1.2650,
    precioSalida: 1.2600,
    sl: 1.2700,
    tp: 1.2600,
    resultado: 100,
    resultadoPorcentual: 1.0,
    duracion: '1h 45m',
    fase: 'Fase 1',
    estado: 'Cerrada',
    notas: 'Objetivo alcanzado'
  },
  {
    id: 3,
    numeroCuenta: 'AGM-1235',
    trader: 'María García',
    fecha: '2024-03-15 09:30:00',
    simbolo: 'USDJPY',
    tipo: 'Compra',
    volumen: 0.15,
    precioEntrada: 151.50,
    precioSalida: 151.20,
    sl: 151.00,
    tp: 152.00,
    resultado: -45,
    resultadoPorcentual: -0.3,
    duracion: '3h 15m',
    fase: 'Fase 2',
    estado: 'Cerrada',
    notas: 'Stop loss alcanzado'
  },
  {
    id: 4,
    numeroCuenta: 'AGM-1236',
    trader: 'Carlos López',
    fecha: '2024-03-15 08:45:00',
    simbolo: 'EURUSD',
    tipo: 'Venta',
    volumen: 0.3,
    precioEntrada: 1.0880,
    precioSalida: null,
    sl: 1.0930,
    tp: 1.0830,
    resultado: null,
    resultadoPorcentual: null,
    duracion: 'En curso',
    fase: 'Fase 1',
    estado: 'Abierta',
    notas: 'Operación en curso'
  }
];

const TradesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroFase, setFiltroFase] = useState('todos');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [filtroSimbolo, setFiltroSimbolo] = useState('todos');
  const [filtroResultado, setFiltroResultado] = useState('todos');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [selectedTrade, setSelectedTrade] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const tradesFiltrados = useMemo(() => {
    return fakeTradesData.filter(trade => {
      const matchesSearch = 
        trade.numeroCuenta.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trade.trader.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trade.simbolo.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFase = filtroFase === 'todos' || trade.fase === filtroFase;
      const matchesEstado = filtroEstado === 'todos' || trade.estado === filtroEstado;
      const matchesSimbolo = filtroSimbolo === 'todos' || trade.simbolo === filtroSimbolo;
      
      let matchesResultado = true;
      if (filtroResultado !== 'todos' && trade.resultado !== null) {
        if (filtroResultado === 'positivo') matchesResultado = trade.resultado > 0;
        if (filtroResultado === 'negativo') matchesResultado = trade.resultado < 0;
        if (filtroResultado === 'cero') matchesResultado = trade.resultado === 0;
      }

      const matchesFecha = (!fechaInicio || trade.fecha >= fechaInicio) && 
                          (!fechaFin || trade.fecha <= fechaFin);

      return matchesSearch && matchesFase && matchesEstado && 
             matchesSimbolo && matchesResultado && matchesFecha;
    });
  }, [searchTerm, filtroFase, filtroEstado, filtroSimbolo, 
      filtroResultado, fechaInicio, fechaFin]);

  const getResultadoColor = (resultado) => {
    if (resultado === null) return '#6c757d';
    return resultado > 0 ? '#28a745' : resultado < 0 ? '#dc3545' : '#ffc107';
  };

  const getSimbolosUnicos = () => {
    return [...new Set(fakeTradesData.map(trade => trade.simbolo))];
  };

  const calcularEstadisticas = () => {
    const tradesCerrados = tradesFiltrados.filter(t => t.estado === 'Cerrada');
    const totalTrades = tradesCerrados.length;
    const tradesGanadores = tradesCerrados.filter(t => t.resultado > 0).length;
    const tradesPerdedores = tradesCerrados.filter(t => t.resultado < 0).length;
    const resultadoTotal = tradesCerrados.reduce((acc, t) => acc + (t.resultado || 0), 0);
    const resultadoPromedio = totalTrades > 0 ? resultadoTotal / totalTrades : 0;

    return {
      totalTrades,
      tradesGanadores,
      tradesPerdedores,
      resultadoTotal,
      resultadoPromedio,
      winRate: totalTrades > 0 ? (tradesGanadores / totalTrades) * 100 : 0
    };
  };

  const stats = calcularEstadisticas();

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ marginBottom: '30px', color: '#b0c4de' }}>Historial de Trades</h1>

      {/* Resumen de KPIs */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={kpiCardStyle}>
          <h3 style={{ color: '#b0c4de', margin: '0 0 10px 0' }}>Total Trades</h3>
          <p style={{ fontSize: '24px', margin: 0, color: '#b0c4de' }}>{stats.totalTrades}</p>
        </div>
        <div style={kpiCardStyle}>
          <h3 style={{ color: '#b0c4de', margin: '0 0 10px 0' }}>Win Rate</h3>
          <p style={{ fontSize: '24px', margin: 0, color: '#28a745' }}>
            {stats.winRate.toFixed(1)}%
          </p>
        </div>
        <div style={kpiCardStyle}>
          <h3 style={{ color: '#b0c4de', margin: '0 0 10px 0' }}>Resultado Total</h3>
          <p style={{ fontSize: '24px', margin: 0, color: getResultadoColor(stats.resultadoTotal) }}>
            ${stats.resultadoTotal.toLocaleString()}
          </p>
        </div>
        <div style={kpiCardStyle}>
          <h3 style={{ color: '#b0c4de', margin: '0 0 10px 0' }}>Resultado Promedio</h3>
          <p style={{ fontSize: '24px', margin: 0, color: getResultadoColor(stats.resultadoPromedio) }}>
            ${stats.resultadoPromedio.toLocaleString()}
          </p>
        </div>
      </div>

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
            <input
              type="text"
              placeholder="Buscar por cuenta, trader o símbolo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={filterInputStyle}
            />
          </div>
          <div>
            <select 
              value={filtroFase} 
              onChange={(e) => setFiltroFase(e.target.value)}
              style={filterSelectStyle}
            >
              <option value="todos">Todas las Fases</option>
              <option value="Fase 1">Fase 1</option>
              <option value="Fase 2">Fase 2</option>
              <option value="Real">Real</option>
            </select>
          </div>
          <div>
            <select 
              value={filtroEstado} 
              onChange={(e) => setFiltroEstado(e.target.value)}
              style={filterSelectStyle}
            >
              <option value="todos">Todos los Estados</option>
              <option value="Abierta">Abierta</option>
              <option value="Cerrada">Cerrada</option>
            </select>
          </div>
          <div>
            <select 
              value={filtroSimbolo} 
              onChange={(e) => setFiltroSimbolo(e.target.value)}
              style={filterSelectStyle}
            >
              <option value="todos">Todos los Símbolos</option>
              {getSimbolosUnicos().map(simbolo => (
                <option key={simbolo} value={simbolo}>{simbolo}</option>
              ))}
            </select>
          </div>
          <div>
            <select 
              value={filtroResultado} 
              onChange={(e) => setFiltroResultado(e.target.value)}
              style={filterSelectStyle}
            >
              <option value="todos">Todos los Resultados</option>
              <option value="positivo">Positivos</option>
              <option value="negativo">Negativos</option>
              <option value="cero">Neutrales</option>
            </select>
          </div>
          <div>
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              style={filterInputStyle}
              placeholder="Fecha Inicio"
            />
          </div>
          <div>
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              style={filterInputStyle}
              placeholder="Fecha Fin"
            />
          </div>
        </div>
      </div>

      {/* Tabla de Trades */}
      <div style={{ overflowX: 'auto' }}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Fecha</th>
              <th style={thStyle}>Cuenta</th>
              <th style={thStyle}>Trader</th>
              <th style={thStyle}>Símbolo</th>
              <th style={thStyle}>Tipo</th>
              <th style={thStyle}>Volumen</th>
              <th style={thStyle}>Entrada</th>
              <th style={thStyle}>Salida</th>
              <th style={thStyle}>Resultado</th>
              <th style={thStyle}>Duración</th>
              <th style={thStyle}>Estado</th>
              <th style={thStyle}>Fase</th>
            </tr>
          </thead>
          <tbody>
            {tradesFiltrados.map(trade => (
              <tr key={trade.id}>
                <td style={tdStyle}>{trade.fecha}</td>
                <td style={tdStyle}>{trade.numeroCuenta}</td>
                <td style={tdStyle}>{trade.trader}</td>
                <td style={tdStyle}>{trade.simbolo}</td>
                <td style={tdStyle}>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    backgroundColor: trade.tipo === 'Compra' ? '#28a745' : '#dc3545',
                    color: '#fff'
                  }}>
                    {trade.tipo}
                  </span>
                </td>
                <td style={tdStyle}>{trade.volumen}</td>
                <td style={tdStyle}>{trade.precioEntrada}</td>
                <td style={tdStyle}>{trade.precioSalida || '-'}</td>
                <td style={tdStyle}>
                  <span style={{
                    color: getResultadoColor(trade.resultado)
                  }}>
                    {trade.resultado !== null ? `$${trade.resultado.toLocaleString()}` : '-'}
                  </span>
                </td>
                <td style={tdStyle}>{trade.duracion}</td>
                <td style={tdStyle}>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    backgroundColor: trade.estado === 'Cerrada' ? '#28a745' : '#ffc107',
                    color: '#fff'
                  }}>
                    {trade.estado}
                  </span>
                </td>
                <td style={tdStyle}>{trade.fase}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
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

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  backgroundColor: '#2c2c2c',
  borderRadius: '8px',
  overflow: 'hidden'
};

const thStyle = {
  padding: '12px',
  textAlign: 'left',
  backgroundColor: '#383838',
  color: '#b0c4de',
  borderBottom: '2px solid #444'
};

const tdStyle = {
  padding: '12px',
  borderBottom: '1px solid #444',
  color: '#b0c4de'
};

export default TradesPage; 