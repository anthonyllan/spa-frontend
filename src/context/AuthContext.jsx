import React, { createContext, useContext, useState, useEffect } from 'react';

// Crear el contexto
const AuthContext = createContext();

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  // Verificar localStorage al cargar para ver si hay sesión guardada
  const [userRole, setUserRole] = useState(() => {
    const savedUserData = localStorage.getItem('userData');
    if (savedUserData) {
      const userData = JSON.parse(savedUserData);
      return userData.role;
    }
    return null; // Inicialmente sin rol (no autenticado)
  });
  
  // Estado para los datos del usuario actual
  const [userData, setUserData] = useState(() => {
    const savedUserData = localStorage.getItem('userData');
    if (savedUserData) {
      return JSON.parse(savedUserData);
    }
    return null;
  });

  // Efecto para guardar datos del usuario en localStorage cuando cambian
  useEffect(() => {
    if (userData) {
      localStorage.setItem('userData', JSON.stringify(userData));
    } else {
      localStorage.removeItem('userData');
    }
  }, [userData]);

  // Función para iniciar sesión como administrador
  const loginAsAdmin = () => {
    const adminData = {
      id: 'admin',
      name: 'Administrador',
      role: 'admin'
    };
    setUserData(adminData);
    setUserRole('admin');
  };

  // Función para iniciar sesión como cliente
  const loginAsCliente = (clienteData) => {
    const userWithRole = {
      ...clienteData,
      role: 'cliente'
    };
    setUserData(userWithRole);
    setUserRole('cliente');
  };

  // Función para cerrar sesión
  const logout = () => {
    setUserData(null);
    setUserRole(null);
    localStorage.removeItem('userData');
  };

  return (
    <AuthContext.Provider value={{ 
      userRole, 
      userData, 
      loginAsAdmin, 
      loginAsCliente, 
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar el contexto
export const useAuth = () => {
  return useContext(AuthContext);
};