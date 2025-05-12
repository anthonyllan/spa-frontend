import React from 'react';


const InicioComponent = () => {
  return (
    <div className="container">
      <div className="row">
        <div>
          <hr />
        </div>
        <div className="col-md-12">
          <h1 className="text-center">Bienvenido al centro de administración</h1>
          <h2>SPA Divine</h2>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <p className="text-center">Aquí puedes agregar, editar y eliminar registros de empleados, clientes y productos.</p>
        </div>
      </div>
    </div>
  );
};

export default InicioComponent;
