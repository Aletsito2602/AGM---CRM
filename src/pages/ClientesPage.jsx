import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

const ClientesPage = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingCliente, setEditingCliente] = useState(null);
  const [selectedClientes, setSelectedClientes] = useState([]);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    country: '',
    ciudad: ''
  });

  useEffect(() => {
    fetchClientes();
  }, []);

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

  const handleEdit = (cliente) => {
    setEditingCliente(cliente.id);
    setEditForm({
      firstName: cliente.firstName || '',
      lastName: cliente.lastName || '',
      email: cliente.email || '',
      phoneNumber: cliente.phoneNumber || '',
      country: cliente.country || '',
      ciudad: cliente.ciudad || ''
    });
  };

  const handleSave = async (id) => {
    try {
      const clienteRef = doc(db, 'users', id);
      await updateDoc(clienteRef, editForm);
      setEditingCliente(null);
      fetchClientes();
    } catch (err) {
      console.error('Error al actualizar cliente:', err);
      setError('Error al actualizar los datos del cliente');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
      try {
        await deleteDoc(doc(db, 'users', id));
        fetchClientes();
      } catch (err) {
        console.error('Error al eliminar cliente:', err);
        setError('Error al eliminar el cliente');
      }
    }
  };

  const handleCancel = () => {
    setEditingCliente(null);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedClientes(clientes.map(cliente => cliente.id));
    } else {
      setSelectedClientes([]);
    }
  };

  const handleSelectCliente = (id) => {
    if (selectedClientes.includes(id)) {
      setSelectedClientes(selectedClientes.filter(clienteId => clienteId !== id));
    } else {
      setSelectedClientes([...selectedClientes, id]);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedClientes.length === 0) return;
    
    if (window.confirm(`¿Estás seguro de que deseas eliminar ${selectedClientes.length} clientes?`)) {
      try {
        const deletePromises = selectedClientes.map(id => deleteDoc(doc(db, 'users', id)));
        await Promise.all(deletePromises);
        setSelectedClientes([]);
        fetchClientes();
      } catch (err) {
        console.error('Error al eliminar clientes:', err);
        setError('Error al eliminar los clientes seleccionados');
      }
    }
  };

  const handleBulkEdit = () => {
    if (selectedClientes.length === 0) return;
    
    // Aquí podrías implementar la lógica para editar múltiples clientes
    // Por ejemplo, abrir un modal con campos para editar
    alert('Funcionalidad de edición en lote en desarrollo');
  };

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
        {selectedClientes.length > 0 && (
          <div style={bulkActionsStyle}>
            <span style={selectedCountStyle}>
              {selectedClientes.length} cliente(s) seleccionado(s)
            </span>
            <button onClick={handleBulkEdit} style={buttonStyle}>
              Editar Seleccionados
            </button>
            <button onClick={handleBulkDelete} style={deleteButtonStyle}>
              Eliminar Seleccionados
            </button>
          </div>
        )}
      </div>

      <div style={contentStyle}>
        <div style={tableContainerStyle}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>
                  <input
                    type="checkbox"
                    checked={selectedClientes.length === clientes.length}
                    onChange={handleSelectAll}
                    style={checkboxStyle}
                  />
                </th>
                <th style={thStyle}>Nombre</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Teléfono</th>
                <th style={thStyle}>País</th>
                <th style={thStyle}>Ciudad</th>
                <th style={thStyle}>Fecha de Registro</th>
                <th style={thStyle}>Referidos</th>
                <th style={thStyle}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((cliente) => (
                <tr key={cliente.id} style={trStyle}>
                  <td style={tdStyle}>
                    <input
                      type="checkbox"
                      checked={selectedClientes.includes(cliente.id)}
                      onChange={() => handleSelectCliente(cliente.id)}
                      style={checkboxStyle}
                    />
                  </td>
                  {editingCliente === cliente.id ? (
                    <>
                      <td style={tdStyle}>
                        <input
                          type="text"
                          value={editForm.firstName}
                          onChange={(e) => setEditForm({...editForm, firstName: e.target.value})}
                          style={inputStyle}
                        />
                        <input
                          type="text"
                          value={editForm.lastName}
                          onChange={(e) => setEditForm({...editForm, lastName: e.target.value})}
                          style={inputStyle}
                        />
                      </td>
                      <td style={tdStyle}>
                        <input
                          type="email"
                          value={editForm.email}
                          onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                          style={inputStyle}
                        />
                      </td>
                      <td style={tdStyle}>
                        <input
                          type="text"
                          value={editForm.phoneNumber}
                          onChange={(e) => setEditForm({...editForm, phoneNumber: e.target.value})}
                          style={inputStyle}
                        />
                      </td>
                      <td style={tdStyle}>
                        <input
                          type="text"
                          value={editForm.country}
                          onChange={(e) => setEditForm({...editForm, country: e.target.value})}
                          style={inputStyle}
                        />
                      </td>
                      <td style={tdStyle}>
                        <input
                          type="text"
                          value={editForm.ciudad}
                          onChange={(e) => setEditForm({...editForm, ciudad: e.target.value})}
                          style={inputStyle}
                        />
                      </td>
                      <td style={tdStyle}>
                        {cliente.created_time && cliente.created_time.seconds
                          ? new Date(cliente.created_time.seconds * 1000).toLocaleDateString()
                          : 'No especificado'}
                      </td>
                      <td style={tdStyle}>{cliente.referralCount || 0}</td>
                      <td style={tdStyle}>
                        <button onClick={() => handleSave(cliente.id)} style={buttonStyle}>
                          Guardar
                        </button>
                        <button onClick={handleCancel} style={cancelButtonStyle}>
                          Cancelar
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
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
                      <td style={tdStyle}>
                        <button onClick={() => handleEdit(cliente)} style={buttonStyle}>
                          Editar
                        </button>
                        <button onClick={() => handleDelete(cliente.id)} style={deleteButtonStyle}>
                          Eliminar
                        </button>
                      </td>
                    </>
                  )}
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

const buttonStyle = {
  backgroundColor: '#17a2b8',
  color: 'white',
  border: 'none',
  padding: '8px 12px',
  borderRadius: '4px',
  cursor: 'pointer',
  marginRight: '8px',
  '&:hover': {
    backgroundColor: '#138496'
  }
};

const deleteButtonStyle = {
  backgroundColor: '#dc3545',
  color: 'white',
  border: 'none',
  padding: '8px 12px',
  borderRadius: '4px',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: '#c82333'
  }
};

const cancelButtonStyle = {
  backgroundColor: '#6c757d',
  color: 'white',
  border: 'none',
  padding: '8px 12px',
  borderRadius: '4px',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: '#5a6268'
  }
};

const inputStyle = {
  backgroundColor: '#444',
  border: '1px solid #555',
  color: '#b0c4de',
  padding: '8px',
  borderRadius: '4px',
  width: '100%',
  marginBottom: '4px',
  '&:focus': {
    outline: 'none',
    borderColor: '#17a2b8'
  }
};

const bulkActionsStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  marginTop: '10px',
  padding: '10px',
  backgroundColor: '#383838',
  borderRadius: '4px'
};

const selectedCountStyle = {
  color: '#b0c4de',
  marginRight: '10px'
};

const checkboxStyle = {
  width: '18px',
  height: '18px',
  cursor: 'pointer'
};

export default ClientesPage; 