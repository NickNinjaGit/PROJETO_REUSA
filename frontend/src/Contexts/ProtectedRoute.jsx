import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../Contexts/AuthContext';

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>; // Ou um componente de loading mais estilizado
  }

  return user ? <Outlet /> : <Navigate to="/login" replace/>;
};

export default ProtectedRoute;