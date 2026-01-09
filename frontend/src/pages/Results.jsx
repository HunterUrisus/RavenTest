import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/results.css";
import { useGetEstudiantes } from "../hooks/useGetEstudiantes.jsx";
import { useGetEvaluaciones } from "../hooks/useGetEvaluaciones.jsx";

const Results = () => {
  const [activeTab, setActiveTab] = useState("students");
  const [loading, setLoading] = useState(true);
  const { estudiantes, fetchEstudiantes } = useGetEstudiantes();
  const { evaluaciones, fetchEvaluaciones } = useGetEvaluaciones();
  const navigate = useNavigate();

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        await Promise.all([fetchEstudiantes(), fetchEvaluaciones()]);
      } catch (error) {
        console.error("Error cargando datos del dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [fetchEstudiantes, fetchEvaluaciones]);

  // 1. Procesamiento de datos base
  const statsEstudiantes =
    estudiantes && evaluaciones
      ? estudiantes
          .filter((est) => est && est.rut)
          .map((est) => {
            const test1Val = evaluaciones.find(
              (ev) => ev.rutEstudiante === est.rut && ev.codTest === 1
            )?.puntaje;
            const test2Val = evaluaciones.find(
              (ev) => ev.rutEstudiante === est.rut && ev.codTest === 2
            )?.puntaje;

            return {
              id: estudiantes.indexOf(est),
              rut: est.rut,
              grupo: est.grupo, // Mantenemos el valor original (1 o 2) para filtrar
              nombre: est.nombre,
              test1: test1Val ?? "-",
              test2: test2Val ?? "-",
              mejora: (() => {
                if (test1Val != null && test2Val != null) {
                  const diff = test2Val - test1Val;
                  return (diff >= 0 ? "+" : "") + diff;
                }
                return "---";
              })(),
            };
          })
      : [];

  // 2. Lógica de Filtrado según la pestaña activa
  const filteredStudents = statsEstudiantes.filter((st) => {
    if (activeTab === "group1") return st.grupo === 1;
    if (activeTab === "group2") return st.grupo === 2;
    return true; // 'students' muestra todos
  });

  // Título dinámico según la pestaña
  const getTitle = () => {
    if (activeTab === "group1") return "Grupo 1: Experimental";
    if (activeTab === "group2") return "Grupo 2: Control";
    return "Todos los Estudiantes";
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Cargando resultados...</p>
      </div>
    );
  } else {
    return (
      <div className="dashboard-page">
        <div className="browser-card">
          {/* --- HEADER TIPO NAVEGADOR --- */}
          <div className="browser-header">
            <div className="tabs-container">
              <button
                className={`tab ${activeTab === "students" ? "active" : ""}`}
                onClick={() => setActiveTab("students")}
              >
                Todos
              </button>
              <button
                className={`tab ${activeTab === "group1" ? "active" : ""}`}
                onClick={() => setActiveTab("group1")}
              >
                Grupo 1 (Exp)
              </button>
              <button
                className={`tab ${activeTab === "group2" ? "active" : ""}`}
                onClick={() => setActiveTab("group2")}
              >
                Grupo 2 (Control)
              </button>
            </div>
          </div>

          {/* --- CUERPO DEL CONTENIDO --- */}
          <div className="browser-body">
            <div className="tab-content fade-in">
              <div className="table-header">
                <h2>{getTitle()}</h2>
                {/* Contador de estudiantes visibles */}
                <span style={{color: '#666', fontSize: '0.9em'}}>
                    Mostrando {filteredStudents.length} registros
                </span>
              </div>

              <div className="table-wrapper">
                <table className="data-table hover-table">
                  <thead>
                    <tr>
                      <th>RUT</th>
                      <th>Grupo</th>
                      <th>Nombre (Ver Análisis)</th>
                      <th>Test 1 (Detalle)</th>
                      <th>Test 2 (Detalle)</th>
                      <th>Progreso</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.length > 0 ? (
                      filteredStudents.map((st) => (
                        <tr key={st.id}>
                          <td className="mono">{st.rut}</td>

                          {/* Columna de Grupo Estilizada */}
                          <td style={{ textAlign: "center" }}>
                            <span
                              style={{
                                padding: "4px 8px",
                                borderRadius: "12px",
                                fontSize: "0.85em",
                                fontWeight: "bold",
                                backgroundColor: st.grupo === 1 ? "#e8f5e9" : "#eceff1",
                                color: st.grupo === 1 ? "#2e7d32" : "#546e7a",
                                border: st.grupo === 1 ? "1px solid #c8e6c9" : "1px solid #cfd8dc",
                              }}
                            >
                              {st.grupo === 1 ? "Exp. (1)" : st.grupo === 2 ? "Ctrl. (2)" : "-"}
                            </span>
                          </td>

                          <td
                            className="clickable-cell name-cell"
                            onClick={() =>
                              navigate(`/results/student/${st.rut}`)
                            }
                          >
                            {st.nombre} ↗
                          </td>

                          <td
                            className={`clickable-cell ${
                              st.test1 !== "-" ? "score-link" : ""
                            }`}
                            onClick={() =>
                              st.test1 !== "-" &&
                              navigate(`/results/student/${st.rut}/test/1`)
                            }
                          >
                            {st.test1}
                          </td>

                          <td
                            className={`clickable-cell ${
                              st.test2 !== "-" ? "score-link" : ""
                            }`}
                            onClick={() =>
                              st.test2 !== "-" &&
                              navigate(`/results/student/${st.rut}/test/2`)
                            }
                          >
                            {st.test2}
                          </td>

                          <td
                            className={
                              st.mejora.includes("-") ? "negative" : "positive"
                            }
                          >
                            {st.mejora}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                          No hay estudiantes en este grupo.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default Results;