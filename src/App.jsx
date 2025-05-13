import React from 'react';
import './App.css';
import HeaderComponent from './components/HeaderComponent';
import FooterComponent from './components/FooterComponent';
import { ListEmpleados } from './components/listEmpleados';
import { ClientesComponent } from './components/ClientesComponent';
import { ProductosComponent } from './components/ProductosComponent';
import { ServiciosComponent } from './components/ServiciosComponent';
import { CategoriasComponent } from './components/CategoriasComponent';
import { EspecialidadesComponent } from './components/EspecialidadesComponent';
import { AgendaCitaComponent } from './components/AgendaCitaComponent';
import InicioComponent from './components/InicioComponent';
import { CitaClienteComponent } from './components/CitaClienteComponent';
import InicioClienteComponent from './components/InicioClienteComponent';
import { EmpleadoServicioComponent } from './components/EmpleadoServicioComponent';
import LoginComponent from './components/LoginComponent';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const HomeRedirect = () => {
    const { userRole } = useAuth();
    // Si hay usuario autenticado, redirigir según su rol
    if (userRole) {
      return userRole === 'admin' ? <Navigate to="/inicio" /> : <Navigate to="/inicio-cliente" />;
    }
    // Si no hay usuario autenticado, redirigir a login
    return <Navigate to="/login" />;
  };

  return (
    <AuthProvider>
      <BrowserRouter>
        <main>
          <HeaderComponent />
          <Routes>
            {/* Ruta principal ahora redirecciona a login si no está autenticado */}
            <Route path="/" element={<HomeRedirect />} />
            
            {/* Acceso público a inicio-cliente para usuarios no autenticados */}
            <Route path="/home" element={<InicioClienteComponent isPublic={true} />} />
            
            {/* Ruta de login (accesible sin autenticación) */}
            <Route path="/login" element={<LoginComponent />} />
            
            {/* Rutas protegidas para administrador */}
            <Route path="/inicio" element={<ProtectedRoute allowedRoles={['admin']}><InicioComponent /></ProtectedRoute>} />
            <Route path="/servicios" element={<ProtectedRoute allowedRoles={['admin']}><ServiciosComponent /></ProtectedRoute>} />
            <Route path="/empleados" element={<ProtectedRoute allowedRoles={['admin']}><ListEmpleados /></ProtectedRoute>} />
            <Route path="/clientes" element={<ProtectedRoute allowedRoles={['admin']}><ClientesComponent /></ProtectedRoute>} />
            <Route path="/productos" element={<ProtectedRoute allowedRoles={['admin']}><ProductosComponent /></ProtectedRoute>} />
            <Route path="/categorias" element={<ProtectedRoute allowedRoles={['admin']}><CategoriasComponent /></ProtectedRoute>} />
            <Route path="/especialidades" element={<ProtectedRoute allowedRoles={['admin']}><EspecialidadesComponent /></ProtectedRoute>} />
            <Route path="/agendar-cita" element={<ProtectedRoute allowedRoles={['admin']}><AgendaCitaComponent /></ProtectedRoute>} />
            <Route path="/empleado-servicio" element={<ProtectedRoute allowedRoles={['admin']}><EmpleadoServicioComponent /></ProtectedRoute>} />
            
            {/* Rutas protegidas para clientes */}
            <Route path="/inicio-cliente" element={<ProtectedRoute allowedRoles={['cliente']}><InicioClienteComponent /></ProtectedRoute>} />
            <Route path="/cita-cliente" element={<ProtectedRoute allowedRoles={['cliente']}><CitaClienteComponent /></ProtectedRoute>} />
            
            {/* Ruta para registro de clientes */}
            <Route path="/registro" element={<LoginComponent isRegistration={true} />} />
            
            {/* Ruta de fallback para URLs no encontradas */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <FooterComponent />
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;