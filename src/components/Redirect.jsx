import React from 'react';
import { Navigate } from 'react-router-dom';

const Redirect = ({ crmType }) => {
  // Redirige al dashboard correspondiente según el tipo de CRM
  return <Navigate to={crmType === 'prop-firm' ? '/dashboard' : '/dashboard-broker'} replace />;
};

export default Redirect; 