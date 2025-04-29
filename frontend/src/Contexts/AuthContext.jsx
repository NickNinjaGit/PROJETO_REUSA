import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshToken = async () => {
    try {
      const response = await fetch('http://localhost:5000/users/refresh', {
        method: 'GET',
        credentials: 'include',
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Erro ao tentar refresh');
      }
    } catch (error) {
      console.error('Erro ao fazer refresh:', error);
      throw error; // importante propagar erro para decidir deslogar
    }
  };

  const loadUserFromServer = async () => {
    try {
      const response = await fetch('http://localhost:5000/users/check-user', {
        method: 'GET',
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok && data.user) {
        setUser({
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.userRole,
        });
      } else {
        throw new Error('Usuário não autenticado');
      }
    } catch (error) {
      console.warn('Tentando refresh porque checkuser falhou:', error.message);
      try {
        await refreshToken();
        // Depois de refreshar, tenta de novo pegar o user
        const retryResponse = await fetch('http://localhost:5000/users/refresh', {
          method: 'GET',
          credentials: 'include',
        });
        const retryData = await retryResponse.json();
        if (retryResponse.ok && retryData.user) {
          setUser({
            id: retryData.user.id,
            name: retryData.user.name,
            email: retryData.user.email,
            role: retryData.user.userRole,
          });
        } else {
          setUser(null);
        }
      } catch (refreshError) {
        console.error('Erro ao fazer refresh, deslogando:', refreshError.message);
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserFromServer();
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await fetch('http://localhost:5000/users/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
