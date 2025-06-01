import React, { useState } from 'react';

// Datos de ejemplo para cupones
const cuponesData = [
  {
    id: 1,
    codigo: 'WELCOME50',
    nombre: 'Bienvenida 50%',
    descripcion: 'Descuento del 50% en la primera compra',
    porcentaje: 50,
    disponible: true,
    fechaInicio: '2024-03-01',
    fechaFin: '2024-12-31',
    usos: 156,
    usosMaximos: 1000
  },
  {
    id: 2,
    codigo: 'SUMMER25',
    nombre: 'Verano 25%',
    descripcion: 'Descuento del 25% en cuentas de verano',
    porcentaje: 25,
    disponible: true,
    fechaInicio: '2024-06-01',
    fechaFin: '2024-08-31',
    usos: 89,
    usosMaximos: 500
  },
  {
    id: 3,
    codigo: 'BLACKFRIDAY75',
    nombre: 'Black Friday 75%',
    descripcion: 'Mega descuento del 75% en Black Friday',
    porcentaje: 75,
    disponible: false,
    fechaInicio: '2024-11-24',
    fechaFin: '2024-11-26',
    usos: 0,
    usosMaximos: 200
  }
];

const CuponesPage = () => {
  const [cupones, setCupones] = useState(cuponesData);
  const [nuevoCupon, setNuevoCupon] = useState({
    codigo: '',
    nombre: '',
    descripcion: '',
    porcentaje: '',
    disponible: true,
    fechaInicio: '',
    fechaFin: '',
    usosMaximos: ''
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNuevoCupon(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cuponNuevo = {
      id: cupones.length + 1,
      ...nuevoCupon,
      usos: 0
    };
    setCupones(prev => [...prev, cuponNuevo]);
    setNuevoCupon({
      codigo: '',
      nombre: '',
      descripcion: '',
      porcentaje: '',
      disponible: true,
      fechaInicio: '',
      fechaFin: '',
      usosMaximos: ''
    });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ color: '#b0c4de', marginBottom: '30px' }}>Gestión de Cupones</h1>

      {/* Formulario de creación */}
      <div style={{ 
        backgroundColor: '#2c2c2c',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '30px'
      }}>
        <h2 style={{ color: '#b0c4de', marginBottom: '20px' }}>Crear Nuevo Cupón</h2>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '15px', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: '#b0c4de' }}>Código</label>
            <input
              type="text"
              name="codigo"
              value={nuevoCupon.codigo}
              onChange={handleInputChange}
              style={inputStyle}
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: '#b0c4de' }}>Nombre</label>
            <input
              type="text"
              name="nombre"
              value={nuevoCupon.nombre}
              onChange={handleInputChange}
              style={inputStyle}
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: '#b0c4de' }}>Descripción</label>
            <input
              type="text"
              name="descripcion"
              value={nuevoCupon.descripcion}
              onChange={handleInputChange}
              style={inputStyle}
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: '#b0c4de' }}>Porcentaje</label>
            <input
              type="number"
              name="porcentaje"
              value={nuevoCupon.porcentaje}
              onChange={handleInputChange}
              style={inputStyle}
              min="0"
              max="100"
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: '#b0c4de' }}>Fecha Inicio</label>
            <input
              type="date"
              name="fechaInicio"
              value={nuevoCupon.fechaInicio}
              onChange={handleInputChange}
              style={inputStyle}
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: '#b0c4de' }}>Fecha Fin</label>
            <input
              type="date"
              name="fechaFin"
              value={nuevoCupon.fechaFin}
              onChange={handleInputChange}
              style={inputStyle}
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: '#b0c4de' }}>Usos Máximos</label>
            <input
              type="number"
              name="usosMaximos"
              value={nuevoCupon.usosMaximos}
              onChange={handleInputChange}
              style={inputStyle}
              min="0"
              required
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <label style={{ color: '#b0c4de', marginRight: '10px' }}>
              <input
                type="checkbox"
                name="disponible"
                checked={nuevoCupon.disponible}
                onChange={handleInputChange}
                style={{ marginRight: '5px' }}
              />
              Disponible
            </label>
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <button type="submit" style={buttonStyle}>
              Crear Cupón
            </button>
          </div>
        </form>
      </div>

      {/* Tabla de cupones */}
      <div style={{ 
        backgroundColor: '#2c2c2c',
        padding: '20px',
        borderRadius: '8px',
        overflowX: 'auto'
      }}>
        <h2 style={{ color: '#b0c4de', marginBottom: '20px' }}>Cupones Activos</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={thStyle}>Código</th>
              <th style={thStyle}>Nombre</th>
              <th style={thStyle}>Descripción</th>
              <th style={thStyle}>Porcentaje</th>
              <th style={thStyle}>Disponible</th>
              <th style={thStyle}>Fecha Inicio</th>
              <th style={thStyle}>Fecha Fin</th>
              <th style={thStyle}>Usos</th>
              <th style={thStyle}>Usos Máx.</th>
            </tr>
          </thead>
          <tbody>
            {cupones.map(cupon => (
              <tr key={cupon.id}>
                <td style={tdStyle}>{cupon.codigo}</td>
                <td style={tdStyle}>{cupon.nombre}</td>
                <td style={tdStyle}>{cupon.descripcion}</td>
                <td style={tdStyle}>{cupon.porcentaje}%</td>
                <td style={tdStyle}>
                  <span style={{ 
                    color: cupon.disponible ? '#28a745' : '#dc3545',
                    fontWeight: 'bold'
                  }}>
                    {cupon.disponible ? 'Sí' : 'No'}
                  </span>
                </td>
                <td style={tdStyle}>{cupon.fechaInicio}</td>
                <td style={tdStyle}>{cupon.fechaFin}</td>
                <td style={tdStyle}>{cupon.usos}</td>
                <td style={tdStyle}>{cupon.usosMaximos}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Estilos
const inputStyle = {
  width: '100%',
  padding: '8px',
  backgroundColor: '#383838',
  color: '#b0c4de',
  border: '1px solid #555',
  borderRadius: '4px',
  fontSize: '0.9em'
};

const buttonStyle = {
  padding: '10px 20px',
  backgroundColor: '#28a745',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '1em',
  fontWeight: 'bold',
  '&:hover': {
    backgroundColor: '#218838'
  }
};

const thStyle = {
  padding: '12px',
  textAlign: 'left',
  backgroundColor: '#383838',
  color: '#b0c4de',
  borderBottom: '2px solid #555'
};

const tdStyle = {
  padding: '12px',
  borderBottom: '1px solid #555',
  color: '#b0c4de'
};

export default CuponesPage; 