import React, { useState, useMemo, useEffect } from 'react';
import { db } from '../services/firebase';
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc, serverTimestamp } from 'firebase/firestore';

const DescuentosPage = () => {
  const [discounts, setDiscounts] = useState([]);
  const [loadingDiscounts, setLoadingDiscounts] = useState(true);
  const [discountsError, setDiscountsError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [filtroTipo, setFiltroTipo] = useState('todos');
  
  const [showModal, setShowModal] = useState(false);
  const [currentDiscount, setCurrentDiscount] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const [newDiscount, setNewDiscount] = useState({
    codigo: '',
    valor: '',
    tipo: 'Porcentaje',
    fechaInicio: '',
    fechaFin: '',
    usosMaximos: '',
    descripcion: '',
    estado: 'Activo'
  });

  useEffect(() => {
    const fetchDiscounts = async () => {
      setLoadingDiscounts(true);
      try {
        const querySnapshot = await getDocs(collection(db, "discounts"));
        const discountsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          fechaInicio: doc.data().fechaInicio?.toDate ? doc.data().fechaInicio.toDate() : doc.data().fechaInicio,
          fechaFin: doc.data().fechaFin?.toDate ? doc.data().fechaFin.toDate() : doc.data().fechaFin,
          fechaCreacion: doc.data().fechaCreacion?.toDate ? doc.data().fechaCreacion.toDate() : doc.data().fechaCreacion,
        }));
        setDiscounts(discountsData);
        setDiscountsError(null);
      } catch (err) {
        console.error("Error fetching discounts: ", err);
        setDiscountsError("Error al cargar los descuentos.");
        setDiscounts([]);
      } finally {
        setLoadingDiscounts(false);
      }
    };
    fetchDiscounts();
  }, []);

  const descuentosFiltrados = useMemo(() => {
    return discounts.filter(d => {
      const searchTermLower = searchTerm.toLowerCase();
      const matchesSearch = 
        (d.codigo && d.codigo.toLowerCase().includes(searchTermLower)) ||
        (d.descripcion && d.descripcion.toLowerCase().includes(searchTermLower));
      
      const matchesEstado = filtroEstado === 'todos' || d.estado === filtroEstado;
      const matchesTipo = filtroTipo === 'todos' || d.tipo === filtroTipo;

      return matchesSearch && matchesEstado && matchesTipo;
    });
  }, [searchTerm, filtroEstado, filtroTipo, discounts]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDiscount(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitDiscount = async (e) => {
    e.preventDefault();
    if (!newDiscount.codigo || !newDiscount.valor || !newDiscount.tipo || !newDiscount.fechaInicio || !newDiscount.fechaFin) {
      alert("Por favor, complete todos los campos obligatorios del descuento.");
      return;
    }
    
    let dataToSave = {
        ...newDiscount,
        valor: parseFloat(newDiscount.valor),
        usosMaximos: newDiscount.usosMaximos ? parseInt(newDiscount.usosMaximos) : null,
        fechaInicio: new Date(newDiscount.fechaInicio),
        fechaFin: new Date(newDiscount.fechaFin),
    };

    setLoadingDiscounts(true);
    try {
      if (isEditMode && currentDiscount?.id) {
        const discountRef = doc(db, "discounts", currentDiscount.id);
        await updateDoc(discountRef, { ...dataToSave, fechaModificacion: serverTimestamp() });
        alert("Descuento actualizado con éxito!");
      } else {
        await addDoc(collection(db, "discounts"), { ...dataToSave, fechaCreacion: serverTimestamp(), usosActuales: 0 });
        alert("Descuento creado con éxito!");
      }
      setShowModal(false);
      setNewDiscount({ codigo: '', valor: '', tipo: 'Porcentaje', fechaInicio: '', fechaFin: '', usosMaximos: '', descripcion: '', estado: 'Activo' });
      const querySnapshot = await getDocs(collection(db, "discounts"));
      const discountsData = querySnapshot.docs.map(d => ({ id: d.id, ...d.data(), fechaInicio: d.data().fechaInicio?.toDate(), fechaFin: d.data().fechaFin?.toDate() }));
      setDiscounts(discountsData);
    } catch (error) {
      console.error("Error guardando descuento: ", error);
      alert("Error al guardar el descuento: " + error.message);
    } finally {
      setLoadingDiscounts(false);
      setIsEditMode(false);
      setCurrentDiscount(null);
    }
  };

  const openCreateModal = () => {
    setIsEditMode(false);
    setCurrentDiscount(null);
    setNewDiscount({ codigo: '', valor: '', tipo: 'Porcentaje', fechaInicio: '', fechaFin: '', usosMaximos: '', descripcion: '', estado: 'Activo' });
    setShowModal(true);
  };

  const openEditModal = (discount) => {
    setIsEditMode(true);
    setCurrentDiscount(discount);
    setNewDiscount({
      ...discount,
      valor: discount.valor.toString(),
      usosMaximos: discount.usosMaximos?.toString() || '',
      fechaInicio: discount.fechaInicio instanceof Date ? discount.fechaInicio.toISOString().split('T')[0] : '',
      fechaFin: discount.fechaFin instanceof Date ? discount.fechaFin.toISOString().split('T')[0] : '',
    });
    setShowModal(true);
  };

  const handleDeleteDiscount = async (discountId) => {
    if (window.confirm("¿Está seguro que desea eliminar este descuento?")) {
      setLoadingDiscounts(true);
      try {
        await deleteDoc(doc(db, "discounts", discountId));
        alert("Descuento eliminado con éxito!");
        const querySnapshot = await getDocs(collection(db, "discounts"));
        const discountsData = querySnapshot.docs.map(d => ({ id: d.id, ...d.data(), fechaInicio: d.data().fechaInicio?.toDate(), fechaFin: d.data().fechaFin?.toDate() }));
        setDiscounts(discountsData);
      } catch (error) {
        console.error("Error eliminando descuento: ", error);
        alert("Error al eliminar el descuento: " + error.message);
      } finally {
        setLoadingDiscounts(false);
      }
    }
  };
  
  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Activo': return '#28a745';
      case 'Inactivo': return '#ffc107';
      case 'Expirado': return '#dc3545';
      case 'Agotado': return '#6c757d';
      default: return '#6c757d';
    }
  };

  const calcularEstadisticas = () => {
    const activos = discounts.filter(d => d.estado === 'Activo').length;
    const inactivos = discounts.filter(d => d.estado === 'Inactivo').length;
    return {
      'Total Descuentos': discounts.length,
      'Descuentos Activos': activos,
      'Descuentos Inactivos': inactivos,
    };
  };

  const stats = calcularEstadisticas();

  if (loadingDiscounts && discounts.length === 0) {
    return <div style={{ textAlign: 'center', padding: '50px', fontSize: '1.2em', color: '#e0e6f0' }}>Cargando descuentos...</div>;
  }

  if (discountsError) {
    return <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>{discountsError}</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.headerContainer}>
        <h1 style={styles.header}>Gestión de Descuentos</h1>
        <button onClick={openCreateModal} style={styles.primaryButton}>
          Crear Nuevo Descuento
        </button>
      </div>

      <div style={styles.statsContainer}>
        {Object.entries(stats).map(([key, value]) => (
            <div key={key} style={styles.statBox}>
                <h3 style={styles.statTitle}>{key}</h3>
                <p style={styles.statValue}>{value}</p>
            </div>
        ))}
      </div>

      <div style={styles.filtersContainer}>
        <input
          type="text"
          placeholder="Buscar por código o descripción..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
        <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)} style={styles.filterSelect}>
          <option value="todos">Todos los Estados</option>
          <option value="Activo">Activo</option>
          <option value="Inactivo">Inactivo</option>
          <option value="Expirado">Expirado</option>
          <option value="Agotado">Agotado</option>
        </select>
        <select value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)} style={styles.filterSelect}>
          <option value="todos">Todos los Tipos</option>
          <option value="Porcentaje">Porcentaje</option>
          <option value="Fijo">Monto Fijo</option>
        </select>
      </div>

      {loadingDiscounts && <p>Actualizando lista...</p>}
      <div style={styles.tableScrollContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Código</th>
              <th style={styles.th}>Descripción</th>
              <th style={styles.th}>Descuento</th>
              <th style={styles.th}>Tipo</th>
              <th style={styles.th}>Vigencia</th>
              <th style={styles.th}>Usos (Actual/Máx)</th>
              <th style={styles.th}>Estado</th>
              <th style={styles.th}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {descuentosFiltrados.length > 0 ? descuentosFiltrados.map(d => (
              <tr key={d.id}>
                <td style={styles.td}>{d.codigo}</td>
                <td style={styles.td}>{d.descripcion || 'N/A'}</td>
                <td style={styles.td}>
                  {d.tipo === 'Porcentaje' ? `${d.valor}%` : `$${parseFloat(d.valor || 0).toLocaleString()}`}
                </td>
                <td style={styles.td}>{d.tipo}</td>
                <td style={styles.td}>
                  {d.fechaInicio ? new Date(d.fechaInicio).toLocaleDateString() : 'N/A'} - 
                  {d.fechaFin ? new Date(d.fechaFin).toLocaleDateString() : 'N/A'}
                </td>
                <td style={styles.td}>{d.usosActuales || 0} / {d.usosMaximos || '∞'}</td>
                <td style={styles.td}><span style={{...styles.statusBadge, backgroundColor: getEstadoColor(d.estado)}}>{d.estado}</span></td>
                <td style={styles.td}>
                  <button onClick={() => openEditModal(d)} style={{...styles.actionButton, ...styles.editButton}}>Editar</button>
                  <button onClick={() => handleDeleteDiscount(d.id)} style={{...styles.actionButton, ...styles.deleteButton}}>Eliminar</button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="8" style={styles.noResults}>No se encontraron descuentos.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={styles.modalBackdrop}>
          <div style={styles.modalContent}>
            <h2 style={styles.modalTitle}>{isEditMode ? 'Editar Descuento' : 'Crear Nuevo Descuento'}</h2>
            <form onSubmit={handleSubmitDiscount}>
              <div style={styles.formGroup}>
                <label htmlFor="codigo" style={styles.label}>Código del Cupón:</label>
                <input type="text" id="codigo" name="codigo" value={newDiscount.codigo} onChange={handleInputChange} style={styles.input} required />
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="descripcion" style={styles.label}>Descripción (Opcional):</label>
                <input type="text" id="descripcion" name="descripcion" value={newDiscount.descripcion} onChange={handleInputChange} style={styles.input} />
              </div>
              <div style={styles.formRow}>
                <div style={styles.formGroupHalf}>
                  <label htmlFor="valor" style={styles.label}>Valor del Descuento:</label>
                  <input type="number" id="valor" name="valor" value={newDiscount.valor} onChange={handleInputChange} style={styles.input} required step="any"/>
                </div>
                <div style={styles.formGroupHalf}>
                  <label htmlFor="tipo" style={styles.label}>Tipo de Descuento:</label>
                  <select id="tipo" name="tipo" value={newDiscount.tipo} onChange={handleInputChange} style={styles.input} required>
                    <option value="Porcentaje">Porcentaje (%)</option>
                    <option value="Fijo">Monto Fijo ($)</option>
                  </select>
                </div>
              </div>
              <div style={styles.formRow}>
                <div style={styles.formGroupHalf}>
                  <label htmlFor="fechaInicio" style={styles.label}>Fecha de Inicio:</label>
                  <input type="date" id="fechaInicio" name="fechaInicio" value={newDiscount.fechaInicio} onChange={handleInputChange} style={styles.input} required />
                </div>
                <div style={styles.formGroupHalf}>
                  <label htmlFor="fechaFin" style={styles.label}>Fecha de Fin:</label>
                  <input type="date" id="fechaFin" name="fechaFin" value={newDiscount.fechaFin} onChange={handleInputChange} style={styles.input} required />
                </div>
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="usosMaximos" style={styles.label}>Usos Máximos (Opcional, 0 o vacío para ilimitado):</label>
                <input type="number" id="usosMaximos" name="usosMaximos" value={newDiscount.usosMaximos} onChange={handleInputChange} style={styles.input} min="0" />
              </div>
               <div style={styles.formGroup}>
                <label htmlFor="estado" style={styles.label}>Estado:</label>
                <select id="estado" name="estado" value={newDiscount.estado} onChange={handleInputChange} style={styles.input} required>
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              </div>
              <div style={styles.modalActions}>
                <button type="button" onClick={() => { setShowModal(false); setIsEditMode(false); setCurrentDiscount(null); }} style={styles.secondaryButtonModal}>Cancelar</button>
                <button type="submit" style={styles.primaryButtonModal} disabled={loadingDiscounts}>
                  {loadingDiscounts ? (isEditMode ? 'Actualizando...' : 'Creando...') : (isEditMode ? 'Actualizar Descuento' : 'Crear Descuento')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: '#e0e6f0',
    backgroundColor: '#1e1e1e',
    minHeight: '100vh'
  },
  headerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px'
  },
  header: {
    color: '#b0c4de',
    fontSize: '2em',
    margin: 0
  },
  primaryButton: {
    padding: '12px 25px',
    backgroundColor: '#17a2b8',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1em',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease'
  },
  statsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px',
    marginBottom: '30px'
  },
  statBox: {
    background: 'linear-gradient(145deg, #2b2b2b, #232323)',
    padding: '20px',
    borderRadius: '10px',
    textAlign: 'center',
    boxShadow: '5px 5px 15px #1a1a1a, -5px -5px 15px #3a3a3a'
  },
  statTitle: {
    fontSize: '0.9em',
    color: '#8899a6',
    marginBottom: '8px',
    textTransform: 'uppercase'
  },
  statValue: {
    fontSize: '1.8em',
    fontWeight: 'bold',
    color: '#b0c4de'
  },
  filtersContainer: {
    display: 'flex',
    gap: '15px',
    marginBottom: '25px',
    padding: '20px',
    backgroundColor: '#2c2c2c',
    borderRadius: '8px',
    flexWrap: 'wrap'
  },
  searchInput: {
    padding: '10px 15px',
    border: '1px solid #3a3a3a',
    borderRadius: '5px',
    backgroundColor: '#252525',
    color: '#e0e6f0',
    fontSize: '0.95em',
    flexGrow: 1,
    minWidth: '200px'
  },
  filterSelect: {
    padding: '10px',
    border: '1px solid #3a3a3a',
    borderRadius: '5px',
    backgroundColor: '#252525',
    color: '#e0e6f0',
    fontSize: '0.95em',
    minWidth: '180px'
  },
  tableScrollContainer: {
    overflowX: 'auto',
    border: '1px solid #333',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0,0,0,0.2)'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    color: '#e0e6f0',
    backgroundColor: '#282828'
  },
  th: {
    backgroundColor: '#333333',
    color: '#b0c4de',
    padding: '12px 15px',
    textAlign: 'left',
    borderBottom: '2px solid #4a4a4a',
    textTransform: 'uppercase',
    fontSize: '0.85em'
  },
  td: {
    padding: '12px 15px',
    borderBottom: '1px solid #3a3a3a'
  },
  statusBadge: {
    padding: '5px 10px',
    borderRadius: '15px',
    color: 'white',
    fontSize: '0.8em',
    fontWeight: 'bold'
  },
  actionButton: {
    padding: '6px 12px',
    marginRight: '8px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '0.9em',
    transition: 'opacity 0.2s ease'
  },
  editButton: { backgroundColor: '#ffc107', color: '#333' },
  deleteButton: { backgroundColor: '#dc3545', color: 'white' },
  noResults: {
    textAlign: 'center',
    padding: '30px',
    fontSize: '1.1em',
    color: '#8899a6'
  },
  modalBackdrop: {
    position: 'fixed',
    top: 0, left: 0, width: '100%', height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    zIndex: 1050
  },
  modalContent: {
    backgroundColor: '#2c2c2e',
    padding: '25px 30px',
    borderRadius: '10px',
    boxShadow: '0 8px 25px rgba(0,0,0,0.5)',
    width: '90%',
    maxWidth: '600px',
    color: '#e0e6f0'
  },
  modalTitle: {
    textAlign: 'center',
    color: '#17a2b8',
    marginBottom: '25px',
    fontSize: '1.8em'
  },
  formGroup: { marginBottom: '20px' },
  formRow: { display: 'flex', gap: '20px', marginBottom: '20px' },
  formGroupHalf: { flex: 1 },
  label: {
    display: 'block',
    marginBottom: '8px',
    color: '#a0a0a0',
    fontSize: '0.9em',
    fontWeight: '500'
  },
  input: {
    width: '100%',
    padding: '12px',
    border: '1px solid #444',
    borderRadius: '5px',
    backgroundColor: '#333',
    color: '#e0e6f0',
    boxSizing: 'border-box',
    fontSize: '1em'
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '15px',
    marginTop: '30px'
  },
  primaryButtonModal: {
    padding: '12px 22px',
    backgroundColor: '#17a2b8',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    fontSize: '1em'
  },
  secondaryButtonModal: {
    padding: '12px 22px',
    backgroundColor: '#4a4a4a',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    fontSize: '1em'
  }
};

export default DescuentosPage; 