import React, { useEffect, useState } from 'react';
import { listServicios, guardarCita, getEmpleadosPorServicio } from '../services/CitaCliente';
import DatePicker, { registerLocale } from 'react-datepicker';
import es from 'date-fns/locale/es';
import 'react-datepicker/dist/react-datepicker.css';
import './CitaClienteComponent.css';

// Registrar locale español para el datepicker
registerLocale('es', es);

export const CitaClienteComponent = () => {
  const [servicios, setServicios] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [currentCita, setCurrentCita] = useState({
    idCliente: '1', // Este ID debe ser dinámico si el cliente está autenticado
    idEmpleado: '',
    idServicio: '',
    fechaHora: new Date(),
    estado: 'PROGRAMADA',
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    listServicios()
      .then((response) => {
        console.log("Datos de servicios:", response.data);
        setServicios(response.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error obteniendo servicios:", err);
        setError(err.message || "Error al cargar los servicios");
        setIsLoading(false);
      });
  }, []);

  // Esta función carga los empleados que ofrecen un servicio específico
  const cargarEmpleadosPorServicio = (idServicio) => {
    if (!idServicio) {
      setEmpleados([]);
      return Promise.resolve();
    }

    setIsLoading(true);
    return getEmpleadosPorServicio(idServicio)
      .then((response) => {
        console.log("Datos de empleados por servicio:", response.data);
        // Transformamos los datos si es necesario
        const empleadosFormateados = response.data.map(item => ({
          idEmpleado: item.idEmpleado,
          nombreEmpleado: item.nombreEmpleado,
          // Agregamos otros campos que podrían estar disponibles
          especialidad: item.especialidad || { nombreEspecialidad: 'Especialista' }
        }));
        setEmpleados(empleadosFormateados);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error completo obteniendo empleados:", err);
        let errorMsg = "No se pudo obtener la lista de empleados para el servicio seleccionado.";
        
        if (err.response) {
          console.error("Datos del error:", err.response.data);
          errorMsg += " " + (err.response.data.message || `Error ${err.response.status}`);
        }
        
        setError(errorMsg);
        setEmpleados([]); // Aseguramos que la lista de empleados quede vacía en caso de error
        setIsLoading(false);
      });
  };

  const handleServicioChange = (idServicio) => {
    setCurrentCita({ ...currentCita, idServicio, idEmpleado: '' });
    // No cargamos los empleados aquí, lo haremos al avanzar al paso 2
  };

  const handleDateChange = (date) => {
    setCurrentCita({ ...currentCita, fechaHora: date });
  };

  const handleSubmit = () => {
    if (!currentCita.idEmpleado || !currentCita.idServicio) {
      setError("Por favor, complete todos los campos requeridos.");
      return;
    }

    // Crear el objeto de cita con el formato correcto para la API
    const citaData = {
      idCliente: parseInt(currentCita.idCliente) || 1,
      idEmpleado: parseInt(currentCita.idEmpleado),
      idServicio: parseInt(currentCita.idServicio),
      fechaHora: currentCita.fechaHora.toISOString().slice(0, 16),
      estado: currentCita.estado
    };

    console.log("Datos de cita a enviar:", citaData);

    setIsLoading(true);
    guardarCita(citaData)
      .then((response) => {
        console.log("Cita creada exitosamente:", response.data);
        setShowSuccess(true);
        setCurrentCita({
          idCliente: '1',
          idEmpleado: '',
          idServicio: '',
          fechaHora: new Date(),
          estado: 'PROGRAMADA',
        });
        setEmpleados([]);
        setIsLoading(false);
        setCurrentStep(1);
        
        // Ocultar el mensaje de éxito después de 5 segundos
        setTimeout(() => {
          setShowSuccess(false);
        }, 5000);
      })
      .catch((err) => {
        console.error("Error al guardar cita:", err);
        setError(err.message || "Error al agendar la cita");
        setIsLoading(false);
      });
  };

  const getServicioById = (id) => {
    return servicios.find(servicio => servicio.idServicio === parseInt(id) || servicio.idServicio === id);
  };

  const getEmpleadoById = (id) => {
    return empleados.find(empleado => 
      empleado.idEmpleado === parseInt(id) || empleado.idEmpleado === id
    );
  };

  const moveToNextStep = () => {
    if (currentStep === 1 && !currentCita.idServicio) {
      setError("Por favor, selecciona un servicio");
      return;
    }
    
    if (currentStep === 2 && !currentCita.idEmpleado) {
      setError("Por favor, selecciona un especialista");
      return;
    }
    
    // Si estamos en el paso 1 y vamos a avanzar al paso 2, cargar los empleados
    if (currentStep === 1) {
      cargarEmpleadosPorServicio(currentCita.idServicio)
        .then(() => {
          setError(null);
          setCurrentStep(currentStep + 1);
        })
        .catch(() => {
          // El error ya se maneja en cargarEmpleadosPorServicio
        });
    } else {
      setError(null);
      setCurrentStep(currentStep + 1);
    }
  };

  const moveToPreviousStep = () => {
    setError(null);
    setCurrentStep(currentStep - 1);
  };

  return (
    <div className="appointment-container">
      <div className="appointment-header">
        <h1>Agenda tu Momento de Bienestar</h1>
        <p>Reserva tu experiencia de relajación en Spa Divine</p>
      </div>

      {showSuccess && (
        <div className="success-message">
          <i className="success-icon">✓</i>
          <p>¡Tu cita ha sido programada con éxito!</p>
          <p className="success-detail">Recibirás un correo con la confirmación de tu cita.</p>
        </div>
      )}

      <div className="appointment-card">
        <div className="steps-indicator">
          <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
            <div className="step-number">1</div>
            <div className="step-label">Servicio</div>
          </div>
          <div className="step-connector"></div>
          <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
            <div className="step-number">2</div>
            <div className="step-label">Especialista</div>
          </div>
          <div className="step-connector"></div>
          <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
            <div className="step-number">3</div>
            <div className="step-label">Fecha y hora</div>
          </div>
          <div className="step-connector"></div>
          <div className={`step ${currentStep >= 4 ? 'active' : ''}`}>
            <div className="step-number">4</div>
            <div className="step-label">Confirmar</div>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <i className="error-icon">!</i>
            <p>{error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="loading-indicator">
            <div className="spinner"></div>
            <p>Cargando...</p>
          </div>
        ) : (
          <>
            <div className="step-content">
              {currentStep === 1 && (
                <div className="service-selection step-panel">
                  <h2 className="section-title">Selecciona un Servicio</h2>
                  <div className="services-grid">
                    {servicios.map((servicio) => (
                      <div 
                        key={servicio.idServicio}
                        className={`service-card ${currentCita.idServicio === servicio.idServicio ? 'selected' : ''}`}
                        onClick={() => handleServicioChange(servicio.idServicio)}
                      >
                        <div className="service-icon">
                          <i className="spa-icon">✿</i>
                        </div>
                        <h3>{servicio.nombreServicio}</h3>
                        <p>{servicio.descripcionServicio}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="specialist-selection step-panel">
                  <h2 className="section-title">Selecciona un Especialista</h2>
                  <div className="employees-grid">
                    {empleados.length > 0 ? (
                      empleados.map((empleado) => (
                        <div 
                          key={empleado.idEmpleado}
                          className={`employee-card ${currentCita.idEmpleado === empleado.idEmpleado ? 'selected' : ''}`}
                          onClick={() => setCurrentCita({ ...currentCita, idEmpleado: empleado.idEmpleado })}
                        >
                          <div className="employee-avatar">
                            <div className="employee-initial">
                              {empleado.nombreEmpleado.charAt(0)}
                            </div>
                          </div>
                          <h3>{empleado.nombreEmpleado}</h3>
                          <p className="employee-specialty">
                            {empleado.especialidad?.nombreEspecialidad || 'Especialista general'}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="no-results">No hay especialistas disponibles para este servicio</p>
                    )}
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="date-selection step-panel">
                  <h2 className="section-title">Elige Fecha y Hora</h2>
                  <div className="date-time-picker">
                    <DatePicker
                      selected={new Date(currentCita.fechaHora)}
                      onChange={handleDateChange}
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={30}
                      timeCaption="Hora"
                      dateFormat="MMMM d, yyyy h:mm aa"
                      locale="es"
                      minDate={new Date()}
                      className="custom-datepicker"
                      calendarClassName="custom-calendar"
                      inline
                    />
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="confirmation step-panel">
                  <h2 className="section-title">Confirma tu cita</h2>
                  <div className="confirmation-details">
                    <div className="confirmation-item">
                      <span className="confirmation-label">Servicio:</span>
                      <span className="confirmation-value">
                        {getServicioById(currentCita.idServicio)?.nombreServicio}
                      </span>
                    </div>
                    <div className="confirmation-item">
                      <span className="confirmation-label">Especialista:</span>
                      <span className="confirmation-value">
                        {getEmpleadoById(currentCita.idEmpleado)?.nombreEmpleado}
                      </span>
                    </div>
                    <div className="confirmation-item">
                      <span className="confirmation-label">Fecha y hora:</span>
                      <span className="confirmation-value">
                        {new Date(currentCita.fechaHora).toLocaleString('es-ES', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="step-actions">
              {currentStep > 1 && (
                <button className="btn-secondary" onClick={moveToPreviousStep}>
                  Anterior
                </button>
              )}
              
              {currentStep < 4 ? (
                <button className="btn-primary" onClick={moveToNextStep}>
                  Siguiente
                </button>
              ) : (
                <button className="btn-accent" onClick={handleSubmit}>
                  Confirmar Cita
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};