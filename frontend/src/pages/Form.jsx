import "../styles/Form.css";
import { useState } from "react";

const Form = () => {
  const [rut, setRut] = useState();

  const formatRut = (rut) => {
    let actual = rut.replace(/^0+|[^0-9kK]+/g, "").toUpperCase();
    if (actual.length <= 1) return actual;

    const dv = actual.slice(-1);
    let cuerpo = actual.slice(0, -1);
    cuerpo = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    return `${cuerpo}-${dv}`;
  };

  const handleRutChange = (e) => {
    const valorFormateado = formatRut(e.target.value);
    setRut(valorFormateado);
  };

  return (
    <div>
      <div className="main-container">
        <h1>Test de Raven</h1>
        <p>Por favor completa tus datos:</p>

        <form className="formulario">
          <label>Nombre y Apellido:</label>
          <input
            type="text"
            name="nombre"
            required
            placeholder="Ingresa tu nombre"
          />
          <br />
          <label>Rut:</label>
          <input
            type="text"
            name="rut"
            required
            placeholder="XX.XXX.XXX-X"
            value={rut}
            onChange={handleRutChange}
            maxLength={12}
          />
          <br />
          <label>Fecha de nacimiento:</label>
          <input
            type="date"
            name="fecha_nacimiento"
            required
            placeholder="2022"
          />
          <br />
          <label>Año de ingreso:</label>
          <input
            type="number"
            name="año_ingreso"
            required
            min={2015}
            max={2025}
          />
          <br />
          <label>Exp en videojuegos:</label>
          <select
            id="experienciaVideojuegos"
            name="experienciaVideojuegos"
            required
          >
            <option value="">Selecciona una opción</option>
            <option value="nula">Nula</option>
            <option value="baja">Baja</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
          </select>

          <br />
          <button type="submit">Enviar</button>
        </form>
      </div>
    </div>
  );
};

export default Form;
