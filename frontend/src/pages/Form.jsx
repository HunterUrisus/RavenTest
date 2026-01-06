import "../styles/Form.css";
import { useState } from "react";

const Form = ({ onSuccess }) => {
  const [rut, setRut] = useState();
  const [nombre, setNombre] = useState();
  const [fechaNacimiento, setFechaNacimiento] = useState();
  const [anoIngreso, setAnoIngreso] = useState();
  const [expVideojuegos, setExpVideojuegos] = useState();
  const [testSelected, setTestSelected] = useState("1");

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const normalizedRut = rut.replace(/[.-]/g, "").toUpperCase();

    const body = {
      rut: normalizedRut,
      nombre,
      fechaNacimiento,
      anoIngreso: Number(anoIngreso),
      expVideojuegos,
    };

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.message || "Error al crear usuario");
        return;
      }

      const data = await res.json();

      //Avisa al componente padre que todo salió bien
      if (onSuccess) {
        onSuccess(
          data,
          Number(testSelected)
        );
      }

      // limpiar formulario si quieres
      setRut("");
      setNombre("");
      setFechaNacimiento("");
      setAnoIngreso("");
      setExpVideojuegos("");
    } catch (error) {
      console.error(error);
      alert("Error de red al crear usuario");
    }
  };

  return (
    <div>
      <div className="main-container">
        <p>Por favor completa tus datos:</p>

        <form className="formulario" onSubmit={handleSubmit}>
          <label>Nombre y Apellido:</label>
          <input
            type="text"
            name="nombre"
            required
            placeholder="Ingresa tu nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
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
          <label>Fecha de nacimiento:</label>
          <input
            type="date"
            name="fecha_nacimiento"
            required
            placeholder="2022"
            value={fechaNacimiento}
            onChange={(e) => setFechaNacimiento(e.target.value)}
          />
          <label>Año de ingreso:</label>
          <input
            type="number"
            name="año_ingreso"
            required
            min={2015}
            max={2025}
            value={anoIngreso}
            onChange={(e) => setAnoIngreso(e.target.value)}
          />
          <label>Exp en videojuegos:</label>
          <select
            id="experienciaVideojuegos"
            name="experienciaVideojuegos"
            required
            value={expVideojuegos}
            onChange={(e) => setExpVideojuegos(e.target.value)}
          >
            <option value="">Selecciona una opción</option>
            <option value="nula">Nula</option>
            <option value="baja">Baja</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
          </select>
          <div className="test-selector">
            <div>
              <label>Test: </label>
              <input
                type="radio"
                id="1"
                name="testPrevio"
                value="1"
                onChange={(e) => setTestSelected(e.target.value)}
                defaultChecked
              />
              <label htmlFor="1">Test 1</label>
              <input
                type="radio"
                id="2"
                name="testPrevio"
                value="2"
                onChange={(e) => setTestSelected(e.target.value)}
              />
              <label htmlFor="2">Test 2</label>
              <input
                type="radio"
                id="3"
                name="testPrevio"
                value="3"
                onChange={(e) => setTestSelected(e.target.value)}
              />
              <label htmlFor="3">Test 3 (Testing)</label>
            </div>
          </div>

          <button type="submit">Enviar</button>
        </form>
      </div>
    </div>
  );
};

export default Form;
