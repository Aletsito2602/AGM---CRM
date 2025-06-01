import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, getUserData } from '../services/firebase';

const UserProfile = () => {
  const [user, loading] = useAuthState(auth);
  const [userData, setUserData] = useState(null);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          setLoadingData(true);
          const data = await getUserData(user.uid);
          
          // Si no hay datos de Firestore, usar datos del auth
          if (!data) {
            setUserData({
              nombre: user.displayName || 'No especificado',
              email: user.email || 'No especificado',
              telefono: user.phoneNumber || 'No especificado',
              pais: 'No especificado',
              ciudad: 'No especificado',
              fechaNacimiento: 'No especificado',
              genero: 'No especificado',
              username: user.displayName || 'No especificado',
              fechaRegistro: user.metadata?.creationTime || 'No especificado',
              referralCount: 0,
              withdrawals_wallet: 'No especificado'
            });
          } else {
            setUserData({
              nombre: data.firstName + ' ' + data.lastName,
              email: data.email,
              telefono: data.phoneNumber,
              pais: data.country,
              ciudad: data.ciudad,
              fechaNacimiento: data.fechaNacimiento,
              genero: data.genero,
              username: data.username,
              fechaRegistro: data.created_time,
              referralCount: data.referralCount || 0,
              withdrawals_wallet: data.withdrawals_wallet || 'No especificado'
            });
          }
        } catch (err) {
          console.error('Error:', err);
          // En caso de error, usar datos básicos del auth
          setUserData({
            nombre: user.displayName || 'No especificado',
            email: user.email || 'No especificado',
            telefono: user.phoneNumber || 'No especificado',
            pais: 'No especificado',
            ciudad: 'No especificado',
            fechaNacimiento: 'No especificado',
            genero: 'No especificado',
            username: user.displayName || 'No especificado',
            fechaRegistro: user.metadata?.creationTime || 'No especificado',
            referralCount: 0,
            withdrawals_wallet: 'No especificado'
          });
        } finally {
          setLoadingData(false);
        }
      }
    };

    fetchUserData();
  }, [user]);

  if (loading || loadingData) {
    return (
      <div style={loadingStyle}>
        Cargando información del usuario...
      </div>
    );
  }

  if (!user) {
    return (
      <div style={errorStyle}>
        No hay usuario autenticado
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h2 style={titleStyle}>Perfil de Usuario</h2>
      </div>
      
      <div style={contentStyle}>
        <div style={sectionStyle}>
          <h3 style={sectionTitleStyle}>Información Personal</h3>
          <div style={infoGridStyle}>
            <div style={infoItemStyle}>
              <label style={labelStyle}>Nombre:</label>
              <span style={valueStyle}>{userData.nombre}</span>
            </div>
            <div style={infoItemStyle}>
              <label style={labelStyle}>Email:</label>
              <span style={valueStyle}>{userData.email}</span>
            </div>
            <div style={infoItemStyle}>
              <label style={labelStyle}>Teléfono:</label>
              <span style={valueStyle}>{userData.telefono}</span>
            </div>
            <div style={infoItemStyle}>
              <label style={labelStyle}>País:</label>
              <span style={valueStyle}>{userData.pais}</span>
            </div>
            <div style={infoItemStyle}>
              <label style={labelStyle}>Ciudad:</label>
              <span style={valueStyle}>{userData.ciudad}</span>
            </div>
            <div style={infoItemStyle}>
              <label style={labelStyle}>Fecha de Nacimiento:</label>
              <span style={valueStyle}>{userData.fechaNacimiento}</span>
            </div>
            <div style={infoItemStyle}>
              <label style={labelStyle}>Género:</label>
              <span style={valueStyle}>{userData.genero}</span>
            </div>
          </div>
        </div>

        <div style={sectionStyle}>
          <h3 style={sectionTitleStyle}>Información de la Cuenta</h3>
          <div style={infoGridStyle}>
            <div style={infoItemStyle}>
              <label style={labelStyle}>Username:</label>
              <span style={valueStyle}>{userData.username}</span>
            </div>
            <div style={infoItemStyle}>
              <label style={labelStyle}>Fecha de Registro:</label>
              <span style={valueStyle}>{userData.fechaRegistro}</span>
            </div>
            <div style={infoItemStyle}>
              <label style={labelStyle}>Referidos:</label>
              <span style={valueStyle}>{userData.referralCount}</span>
            </div>
            <div style={infoItemStyle}>
              <label style={labelStyle}>Wallet de Retiros:</label>
              <span style={valueStyle}>{userData.withdrawals_wallet}</span>
            </div>
          </div>
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

const sectionStyle = {
  backgroundColor: '#383838',
  borderRadius: '8px',
  padding: '20px'
};

const sectionTitleStyle = {
  color: '#17a2b8',
  margin: '0 0 15px 0',
  fontSize: '1.2em'
};

const infoGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '15px'
};

const infoItemStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '5px'
};

const labelStyle = {
  color: '#888',
  fontSize: '0.9em'
};

const valueStyle = {
  color: '#b0c4de',
  fontSize: '1em'
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

export default UserProfile; 