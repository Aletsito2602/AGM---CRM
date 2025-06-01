import React, { useState, useMemo, useEffect } from 'react';
import { db } from '../services/firebase'; // Import Firestore instance
import { collection, getDocs, serverTimestamp } from 'firebase/firestore'; // Removed addDoc, updateDoc, doc, deleteDoc as CRUD is not needed for now

// Datos de ejemplo para certificados
// const fakeCertificadosData = [...]; // Removed mock data

const CertificadosPage = () => {
  const [certificates, setCertificates] = useState([]);
  const [loadingCertificates, setLoadingCertificates] = useState(true);
  const [certificatesError, setCertificatesError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [filtroTipo, setFiltroTipo] = useState('todos');
  
  // Restored original state for details modal
  const [selectedCertificado, setSelectedCertificado] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Removed state for new CRUD modal: currentCertificate, isEditMode, newCertificate

  useEffect(() => {
    const fetchCertificates = async () => {
      setLoadingCertificates(true);
      try {
        const querySnapshot = await getDocs(collection(db, "certificates")); 
        const certificatesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          fechaEmision: doc.data().fechaEmision?.toDate ? doc.data().fechaEmision.toDate() : doc.data().fechaEmision,
          fechaVencimiento: doc.data().fechaVencimiento?.toDate ? doc.data().fechaVencimiento.toDate() : doc.data().fechaVencimiento,
          ultimaActualizacion: doc.data().ultimaActualizacion?.toDate ? doc.data().ultimaActualizacion.toDate() : doc.data().ultimaActualizacion,
          fechaCreacion: doc.data().fechaCreacion?.toDate ? doc.data().fechaCreacion.toDate() : doc.data().fechaCreacion,
        }));
        setCertificates(certificatesData);
        setCertificatesError(null);
      } catch (err) {
        console.error("Error fetching certificates: ", err);
        setCertificatesError("Error al cargar los certificados.");
        setCertificates([]);
      } finally {
        setLoadingCertificates(false);
      }
    };
    fetchCertificates();
  }, []);

  const certificadosFiltrados = useMemo(() => {
    return certificates.filter(certificado => {
      const searchTermLower = searchTerm.toLowerCase();
      const matchesSearch = 
        (certificado.numeroCertificado && certificado.numeroCertificado.toLowerCase().includes(searchTermLower)) ||
        (certificado.trader && certificado.trader.toLowerCase().includes(searchTermLower)) ||
        (certificado.email && certificado.email.toLowerCase().includes(searchTermLower));
      
      const matchesEstado = filtroEstado === 'todos' || certificado.estado === filtroEstado;
      const matchesTipo = filtroTipo === 'todos' || certificado.tipo === filtroTipo;

      return matchesSearch && matchesEstado && matchesTipo;
    });
  }, [searchTerm, filtroEstado, filtroTipo, certificates]);

  // Removed handleInputChange, handleSubmitCertificate, openCreateModal, openEditModal, handleDeleteCertificate

  // Restored original handleAction
  const handleAction = (action, certificado) => {
    console.log(`Acción ${action} para certificado ${certificado.id}`);
    // For now, just shows details. Implement other actions (renovar, cancelar) as needed.
    setSelectedCertificado(certificado);
    setShowModal(true);
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Activo': return '#28a745';
      case 'Vencido': return '#dc3545';
      case 'Cancelado': return '#6c757d';
      default: return '#6c757d';
    }
  };

  const calcularDiasRestantes = (fechaVencimiento) => {
    if (!fechaVencimiento) return 'N/A';
    const hoy = new Date();
    const vencimiento = new Date(fechaVencimiento);
    const diffTiempo = vencimiento.getTime() - hoy.getTime();
    if (diffTiempo < 0) return 0; // Ya venció
    const diffDias = Math.ceil(diffTiempo / (1000 * 3600 * 24));
    return diffDias;
  };
  
  const calcularEstadisticas = () => {
    const total = certificates.length;
    const activos = certificates.filter(c => c.estado === 'Activo').length;
    const porVencer = certificates.filter(c => {
        const diasRestantesNum = calcularDiasRestantes(c.fechaVencimiento);
        return typeof diasRestantesNum === 'number' && diasRestantesNum > 0 && diasRestantesNum <= 30 && c.estado === 'Activo';
    }).length;
    const capitalTotal = certificates.reduce((sum, c) => sum + (parseFloat(c.capital) || 0), 0);
    return {
      'Total Certificados': total,
      'Certificados Activos': activos,
      'Por Vencer (30 días)': porVencer,
      'Capital Total': capitalTotal
    };
  };

  const stats = calcularEstadisticas();
  
  if (loadingCertificates && certificates.length === 0) {
    return <div style={{ textAlign: 'center', padding: '50px', fontSize: '1.2em', color: '#e0e6f0' }}>Cargando certificados...</div>;
  }

  if (certificatesError) {
    return <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>{certificatesError}</div>;
  }

  return (
    <div style={styles.container}>
      {/* Removed headerContainer with create button, restored simple header */}
      <h1 style={{ ...styles.header, marginBottom: '30px' }}>Gestión de Certificados</h1>

      <div style={styles.statsContainer}>
        {Object.entries(stats).map(([key, value]) => (
            <div key={key} style={styles.statBox}>
                <h3 style={styles.statTitle}>{key}</h3>
                <p style={styles.statValue}>
                  {key === 'Capital Total' ? `$${value.toLocaleString()}` : value}
                </p>
            </div>
        ))}
      </div>

      <div style={styles.filtersContainer}>
          <input
            type="text"
            placeholder="Buscar por número, trader o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
          <select 
            value={filtroEstado} 
            onChange={(e) => setFiltroEstado(e.target.value)}
            style={styles.filterSelect}
          >
            <option value="todos">Todos los Estados</option>
            <option value="Activo">Activo</option>
            <option value="Vencido">Vencido</option>
            <option value="Cancelado">Cancelado</option>
          </select>
          <select 
            value={filtroTipo} 
            onChange={(e) => setFiltroTipo(e.target.value)}
            style={styles.filterSelect}
          >
            <option value="todos">Todos los Tipos</option>
            <option value="Funded">Funded</option>
            <option value="Phase 1">Phase 1</option>
            <option value="Phase 2">Phase 2</option>
          </select>
      </div>
      
      {loadingCertificates && certificates.length > 0 && <p style={{textAlign: 'center', color: '#e0e6f0'}}>Actualizando lista...</p>}
      <div style={styles.tableScrollContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Certificado</th>
              <th style={styles.th}>Trader</th>
              <th style={styles.th}>Tipo</th>
              <th style={styles.th}>Capital</th>
              <th style={styles.th}>Objetivo</th>
              <th style={styles.th}>Drawdown</th>
              <th style={styles.th}>Vigencia</th>
              <th style={styles.th}>Estado</th>
              <th style={styles.th}>Días Restantes</th>
              <th style={styles.th}>Última Actualización</th>
              <th style={styles.th}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {certificadosFiltrados.length > 0 ? certificadosFiltrados.map(certificado => (
              <tr key={certificado.id}>
                <td style={styles.td}>{certificado.numeroCertificado}</td>
                <td style={styles.td}>
                  <div style={{ fontWeight: 'bold' }}>{certificado.trader}</div>
                  <div style={{ fontSize: '0.8em', color: '#8899a6' }}>{certificado.email}</div>
                </td>
                <td style={styles.td}>{certificado.tipo}</td>
                <td style={styles.td}>${(parseFloat(certificado.capital) || 0).toLocaleString()}</td>
                <td style={styles.td}>{certificado.objetivo || 'N/A'}</td>
                <td style={styles.td}>{certificado.drawdown || 'N/A'}</td>
                <td style={styles.td}>
                  {certificado.fechaEmision ? new Date(certificado.fechaEmision).toLocaleDateString() : 'N/A'} - 
                  {certificado.fechaVencimiento ? new Date(certificado.fechaVencimiento).toLocaleDateString() : 'N/A'}
                </td>
                <td style={styles.td}>
                  <span style={{...styles.statusBadge, backgroundColor: getEstadoColor(certificado.estado)}}>
                    {certificado.estado}
                  </span>
                </td>
                <td style={styles.td}>{calcularDiasRestantes(certificado.fechaVencimiento)}</td>
                <td style={styles.td}>{certificado.ultimaActualizacion ? new Date(certificado.ultimaActualizacion).toLocaleString() : 'N/A'}</td>
                <td style={styles.td}>
                  {/* Restored original action buttons logic */}
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <button 
                        onClick={() => handleAction('detalles', certificado)}
                        style={styles.actionButton} // Use general actionButton style
                    >
                        Detalles
                    </button>
                    {certificado.estado === 'Activo' && (
                        <button 
                            onClick={() => handleAction('renovar', certificado)} 
                            style={{...styles.actionButton, ...styles.renovarButton}} // Specific style for renovar
                        >
                            Renovar
                        </button>
                    )}
                    {certificado.estado === 'Activo' && (
                        <button 
                            onClick={() => handleAction('cancelar', certificado)} 
                            style={{...styles.actionButton, ...styles.cancelarButton}} // Specific style for cancelar
                        >
                            Cancelar
                        </button>
                    )}
                  </div>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="11" style={styles.noResults}>No se encontraron certificados.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Restored original Modal for Details */}
      {showModal && selectedCertificado && (
        <div style={styles.modalBackdrop}> {/* Using new backdrop style for consistency */}
          <div style={styles.modalContentSimple}> {/* Using a simpler modal content style */}
            <h2 style={{ marginTop: 0, color: '#b0c4de', textAlign: 'center', marginBottom: '20px' }}>Detalles del Certificado</h2>
            <div style={{ marginBottom: '20px', fontSize: '0.95em' }}>
              <p><strong>Número:</strong> {selectedCertificado.numeroCertificado}</p>
              <p><strong>Trader:</strong> {selectedCertificado.trader} ({selectedCertificado.email})</p>
              <p><strong>Tipo:</strong> {selectedCertificado.tipo}</p>
              <p><strong>Capital:</strong> ${(parseFloat(selectedCertificado.capital) || 0).toLocaleString()}</p>
              <p><strong>Emisión:</strong> {selectedCertificado.fechaEmision ? new Date(selectedCertificado.fechaEmision).toLocaleDateString() : 'N/A'}</p>
              <p><strong>Vencimiento:</strong> {selectedCertificado.fechaVencimiento ? new Date(selectedCertificado.fechaVencimiento).toLocaleDateString() : 'N/A'}</p>
              <p><strong>Estado:</strong> <span style={{...styles.statusBadge, backgroundColor: getEstadoColor(selectedCertificado.estado)}}>{selectedCertificado.estado}</span></p>
              <p><strong>Objetivo:</strong> {selectedCertificado.objetivo || 'N/A'}</p>
              <p><strong>Drawdown:</strong> {selectedCertificado.drawdown || 'N/A'}</p>
              <p><strong>Días Restantes:</strong> {calcularDiasRestantes(selectedCertificado.fechaVencimiento)}</p>
              <p><strong>Actualizado:</strong> {selectedCertificado.ultimaActualizacion ? new Date(selectedCertificado.ultimaActualizacion).toLocaleString() : 'N/A'}</p>
              <p><strong>Notas:</strong> {selectedCertificado.notas || 'N/A'}</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setShowModal(false)}
                style={styles.secondaryButtonModal} // Use consistent modal button style
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Styles adjusted to remove CRUD modal specific styles and restore/maintain original look and feel for details.
const styles = {
  container: {
    padding: '20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: '#e0e6f0',
    backgroundColor: '#1e1e1e',
    minHeight: '100vh'
  },
  header: {
    color: '#b0c4de',
    fontSize: '2em',
    margin: 0
    // Removed marginBottom from here as it's applied inline with spread
  },
  // primaryButton: { // Removed as the create button is removed for now
  //   padding: '12px 25px',
  //   backgroundColor: '#17a2b8',
  //   color: 'white',
  //   border: 'none',
  //   borderRadius: '8px',
  //   cursor: 'pointer',
  //   fontSize: '1em',
  //   fontWeight: 'bold',
  //   transition: 'background-color 0.3s ease'
  // },
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
    minWidth: '200px',
  },
  filterSelect: {
    padding: '10px',
    border: '1px solid #3a3a3a',
    borderRadius: '5px',
    backgroundColor: '#252525',
    color: '#e0e6f0',
    fontSize: '0.95em',
    minWidth: '180px',
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
    borderBottom: '1px solid #3a3a3a',
  },
  statusBadge: {
    padding: '5px 10px',
    borderRadius: '15px',
    color: 'white',
    fontSize: '0.8em',
    fontWeight: 'bold'
  },
  actionButton: { // General style for action buttons in table
    padding: '6px 12px',
    // marginRight: '8px', // Applied by gap in flex container
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '0.9em',
    transition: 'opacity 0.2s ease',
    backgroundColor: '#007bff', // Default details button color (Bootstrap primary)
    color: 'white',
  },
  renovarButton: { // Specific style for renovar button
    backgroundColor: '#17a2b8', // Info blue (consistent with previous primary buttons)
    color: 'white',
  },
  cancelarButton: { // Specific style for cancelar button
    backgroundColor: '#dc3545', // Danger red
    color: 'white',
  },
  noResults: {
    textAlign: 'center',
    padding: '30px',
    fontSize: '1.1em',
    color: '#8899a6'
  },
  modalBackdrop: { // Kept for consistency with other modals in the app
    position: 'fixed',
    top: 0, left: 0, width: '100%', height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    zIndex: 1050
  },
  modalContentSimple: { // Simplified modal content style for details
    backgroundColor: '#2c2c2e',
    padding: '25px 30px',
    borderRadius: '10px',
    boxShadow: '0 8px 25px rgba(0,0,0,0.5)',
    width: '90%',
    maxWidth: '600px', // Max width for details modal
    color: '#e0e6f0',
    maxHeight: '90vh',
    overflowY: 'auto'
  },
  // Removed styles for form elements as CRUD modal is gone
  // label, input, modalActions, primaryButtonModal
  secondaryButtonModal: { // Kept for the close button in details modal
    padding: '10px 20px',
    backgroundColor: '#6c757d', // Standard secondary/cancel color
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    fontSize: '1em'
  }
};

export default CertificadosPage; 