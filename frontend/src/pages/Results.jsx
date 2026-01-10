import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/results.css";
import LoadingScreen from "../components/Loading.jsx";
import { useGetEstudiantes } from "../hooks/useGetEstudiantes.jsx";
import { useGetEvaluaciones } from "../hooks/useGetEvaluaciones.jsx";

const Results = () => {
  const [activeTab, setActiveTab] = useState("students");
  const [loading, setLoading] = useState(true);
  
  // --- NUEVO ESTADO PARA EL FILTRO ---
  const [showCompletedOnly, setShowCompletedOnly] = useState(false);

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
              grupo: est.grupo,
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

  // 2. Lógica de Filtrado Actualizada
  const filteredStudents = statsEstudiantes.filter((st) => {
    // A. Filtro por Pestaña (Grupo)
    let matchesTab = true;
    if (activeTab === "group1") matchesTab = st.grupo === 1;
    if (activeTab === "group2") matchesTab = st.grupo === 2;

    // B. Filtro por Completitud (NUEVO)
    let matchesCompletion = true;
    if (showCompletedOnly) {
      // Solo mostramos si AMBOS tests tienen valor distinto a "-"
      matchesCompletion = st.test1 !== "-" && st.test2 !== "-";
    }

    return matchesTab && matchesCompletion;
  });

  const getTitle = () => {
    if (activeTab === "group1") return "Grupo 1: Experimental";
    if (activeTab === "group2") return "Grupo 2: Control";
    return "Todos los Estudiantes";
  };

  if (loading) {
    return <LoadingScreen text="Cargando tabla de resultados..." />;
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
              <div 
                className="table-header" 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  marginBottom: '15px' 
                }}
              >
                <div>
                    <h2 style={{margin: 0}}>{getTitle()}</h2>
                    <span style={{ color: "#666", fontSize: "0.9em" }}>
                    Mostrando {filteredStudents.length} registros
                    </span>
                </div>

                {/* --- NUEVO CHECKBOX DE FILTRO --- */}
                <label 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    background: '#f8f9fa',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #e0e0e0',
                    fontSize: '0.9rem',
                    userSelect: 'none'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={showCompletedOnly}
                    onChange={(e) => setShowCompletedOnly(e.target.checked)}
                    style={{ cursor: "pointer", accentColor: "#2e7d32" }}
                  />
                  <span>Sólo completados</span>
                </label>

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
                              {st.grupo === 1
                                ? "Exp. (1)"
                                : st.grupo === 2
                                ? "Ctrl. (2)"
                                : "-"}
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
                        <td
                          colSpan="6"
                          style={{ textAlign: "center", padding: "20px" }}
                        >
                          {showCompletedOnly 
                            ? "No hay estudiantes con ambos tests rendidos en este grupo." 
                            : "No hay estudiantes en este grupo."}
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