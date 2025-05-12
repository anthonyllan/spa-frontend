import React, { createContext, useContext, useState } from 'react';

// Crear el contexto
const AuthContext = createContext();

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [userRole, setUserRole] = useState('cliente'); // Cambia entre 'cliente' o 'admin'

  const loginAsAdmin = () => setUserRole('admin'); // Función para simular inicio como administrador
  const loginAsCliente = () => setUserRole('cliente'); // Función para simular inicio como cliente

  return (
    <AuthContext.Provider value={{ userRole, loginAsAdmin, loginAsCliente }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar el contexto
export const useAuth = () => {
  return useContext(AuthContext);
};