import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';

const ClientesPage = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClientes = async () => {
      if (!db) {
        setError('Firestore no está disponible en este momento');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const querySnapshot = await getDocs(collection(db, 'users'));
        const clientesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setClientes(clientesData);
      } catch (err) {
        console.error('Error al obtener clientes:', err);
        setError('Error al cargar los datos de los clientes');
      } finally {
        setLoading(false);
      }
    };

    fetchClientes();
  }, []);

  if (loading) {
    return (
      <div style={loadingStyle}>
        Cargando información de clientes...
      </div>
    );
  }

  if (error) {
    return (
      <div style={errorStyle}>
        {error}
      </div>
    );
  }

  if (clientes.length === 0) {
    return (
      <div style={containerStyle}>
        <div style={headerStyle}>
          <h2 style={titleStyle}>Clientes</h2>
        </div>
        <div style={noDataStyle}>
          No hay clientes registrados
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h2 style={titleStyle}>Clientes</h2>
      </div>

      <div style={contentStyle}>
        <div style={tableContainerStyle}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Nombre</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Teléfono</th>
                <th style={thStyle}>País</th>
                <th style={thStyle}>Ciudad</th>
                <th style={thStyle}>Fecha de Registro</th>
                <th style={thStyle}>Referidos</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((cliente) => (
                <tr key={cliente.id} style={trStyle}>
                  <td style={tdStyle}>{cliente.firstName} {cliente.lastName}</td>
                  <td style={tdStyle}>{cliente.email}</td>
                  <td style={tdStyle}>{cliente.phoneNumber || 'No especificado'}</td>
                  <td style={tdStyle}>{cliente.country || 'No especificado'}</td>
                  <td style={tdStyle}>{cliente.ciudad || 'No especificado'}</td>
                  <td style={tdStyle}>
                    {cliente.created_time && cliente.created_time.seconds
                      ? new Date(cliente.created_time.seconds * 1000).toLocaleDateString()
                      : 'No especificado'}
                  </td>
                  <td style={tdStyle}>{cliente.referralCount || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Estilos
const containerStyle = {
  backgroundColor: '#2c2c2c',
  borderRadius: '8px',
  padding: '20px',
  margin: '20px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
};

const headerStyle = {
  marginBottom: '20px',
  borderBottom: '1px solid #444',
  paddingBottom: '10px'
};

const titleStyle = {
  color: '#b0c4de',
  margin: 0,
  fontSize: '1.5em'
};

const contentStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '20px'
};

const tableContainerStyle = {
  overflowX: 'auto'
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  backgroundColor: '#383838',
  borderRadius: '8px'
};

const thStyle = {
  backgroundColor: '#444',
  color: '#b0c4de',
  padding: '12px',
  textAlign: 'left',
  borderBottom: '2px solid #555'
};

const trStyle = {
  borderBottom: '1px solid #444',
  '&:hover': {
    backgroundColor: '#444'
  }
};

const tdStyle = {
  padding: '12px',
  color: '#b0c4de',
  borderBottom: '1px solid #444'
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

const noDataStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '200px',
  color: '#b0c4de',
  fontSize: '1.2em'
};

export default ClientesPage; 