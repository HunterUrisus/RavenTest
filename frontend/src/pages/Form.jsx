import "../styles/Form.css";
import { useState } from "react";

const Form = () => {
  const [rut, setRut] = useState();
  const [nombre, setNombre] = useState();
  const [fechaNacimiento, setFechaNacimiento] = useState();
  const [anoIngreso, setAnoIngreso] = useState();
  const [expVideojuegos, setExpVideojuegos] = useState();

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
      const res = await fetch("http://localhost:3000/api/users/", {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.message || "Error al crear usuario");
        return;
      }

      const data = await res.json();
      alert("Usuario creado correctamente");
      console.log(data);
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
        <h1>Test de Raven</h1>
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
            value={fechaNacimiento}
            onChange={(e) => setFechaNacimiento(e.target.value)}
          />
          <br />
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
          <br />
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

          <br />
          <button type="submit">Enviar</button>
        </form>
      </div>
    </div>
  );
};

export default Form;
