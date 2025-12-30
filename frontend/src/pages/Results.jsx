import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/results.css";
import { useGetEstudiantes } from "../hooks/useGetEstudiantes.jsx";
import { useGetEvaluaciones } from "../hooks/useGetEvaluaciones.jsx";

const Results = () => {
  const [activeTab, setActiveTab] = useState("general");
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
  }, []);

  const statsGeneral = {
    totalEstudiantes: estudiantes ? estudiantes.length : 0,
    promedioGeneral: 0,
    mejorPuntaje: 58,
    peorPuntaje: 12,
    testsCompletados: 1, // Asumiendo Pre y Post
  };

  const statsEstudiantes =
    estudiantes && evaluaciones
      ? estudiantes.map((est) => {
          const test1Val = evaluaciones.find(
            (ev) => ev.rutEstudiante === est.rut && ev.codTest === 1
          )?.puntaje;
          const test2Val = evaluaciones.find(
            (ev) => ev.rutEstudiante === est.rut && ev.codTest === 2
          )?.puntaje;

          return {
            id: estudiantes.indexOf(est),
            rut: est.rut,
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

  console.log("Stats: ", statsEstudiantes);

  const preguntasData = [
    { idItem: "A-12", errores: 5, aciertos: 37, dificultad: "Baja" },
    { idItem: "C-08", errores: 20, aciertos: 22, dificultad: "Media" },
    { idItem: "E-10", errores: 38, aciertos: 4, dificultad: "Alta" },
  ];
  // ---------------------------------------------------------

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
                className={`tab ${activeTab === "general" ? "active" : ""}`}
                onClick={() => setActiveTab("general")}
              >
                Visión General
              </button>
              <button
                className={`tab ${activeTab === "students" ? "active" : ""}`}
                onClick={() => setActiveTab("students")}
              >
                Estudiantes
              </button>
              <button
                className={`tab ${activeTab === "questions" ? "active" : ""}`}
                onClick={() => setActiveTab("questions")}
              >
                Preguntas
              </button>
            </div>
          </div>

          {/* --- CUERPO DEL CONTENIDO --- */}
          <div className="browser-body">
            {/* VISTA 1: GENERAL */}
            {activeTab === "general" && (
              <div className="tab-content fade-in">
                <h2>Resumen del Curso</h2>
                <div className="kpi-grid">
                  <div className="kpi-card">
                    <h3>Total Estudiantes</h3>
                    <div className="number">
                      {statsGeneral.totalEstudiantes}
                    </div>
                  </div>
                  <div className="kpi-card">
                    <h3>Promedio Pts</h3>
                    <div className="number">{statsGeneral.promedioGeneral}</div>
                    <small>/ 60 puntos</small>
                  </div>
                  <div className="kpi-card highlight">
                    <h3>Mejor Puntaje</h3>
                    <div className="number">{statsGeneral.mejorPuntaje}</div>
                  </div>
                  <div className="kpi-card warning">
                    <h3>Tests Totales</h3>
                    <div className="number">
                      {statsGeneral.testsCompletados}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* VISTA 2: ESTUDIANTES */}
            {activeTab === "students" && (
              <div className="tab-content fade-in">
                <div className="table-header">
                  <h2>Comparativa Pre vs Post Test</h2>
                  <button className="btn-export">Exportar CSV</button>
                </div>
                <div className="table-wrapper">
                  <table className="data-table hover-table"> {/* Clase extra para hover */}
                    <thead>
                      <tr>
                        <th>RUT</th>
                        <th>Nombre (Ver Análisis)</th>
                        <th>Test 1 (Detalle)</th>
                        <th>Test 2 (Detalle)</th>
                        <th>Progreso</th>
                      </tr>
                    </thead>
                    <tbody>
                      {statsEstudiantes.map((st) => (
                        <tr key={st.id}>
                          <td className="mono">{st.rut}</td>
                          
                          {/* 1. CLICK EN NOMBRE -> ANÁLISIS DEL ESTUDIANTE */}
                          <td 
                            className="clickable-cell name-cell"
                            onClick={() => navigate(`/results/student/${st.rut}`)}
                          >
                            {st.nombre} ↗
                          </td>

                          {/* 2. CLICK EN RESULTADOS -> DETALLE DE RESPUESTAS */}
                          <td 
                            className={`clickable-cell ${st.test1 !== "-" ? "score-link" : ""}`}
                            onClick={() => st.test1 !== "-" && navigate(`/results/student/${st.rut}/test/1`)}
                          >
                            {st.test1}
                          </td>
                          
                          <td 
                            className={`clickable-cell ${st.test2 !== "-" ? "score-link" : ""}`}
                            onClick={() => st.test2 !== "-" && navigate(`/results/student/${st.rut}/test/2`)}
                          >
                            {st.test2}
                          </td>

                          <td className={st.mejora.includes("-") ? "negative" : "positive"}>
                            {st.mejora}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* VISTA 3: PREGUNTAS */}
            {activeTab === "questions" && (
              <div className="tab-content fade-in">
                <h2>Análisis de Dificultad</h2>
                <p>Items con mayor tasa de error.</p>
                <div className="table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Item (Serie-Num)</th>
                        <th>Aciertos</th>
                        <th>Errores</th>
                        <th>Dificultad Estimada</th>
                        <th>Visual</th>
                      </tr>
                    </thead>
                    <tbody>
                      {preguntasData.map((q, idx) => (
                        <tr key={idx}>
                          <td>
                            <strong>{q.idItem}</strong>
                          </td>
                          <td style={{ color: "#4caf50" }}>{q.aciertos}</td>
                          <td style={{ color: "#f44336" }}>{q.errores}</td>
                          <td>
                            <span
                              className={`badge ${q.dificultad.toLowerCase()}`}
                            >
                              {q.dificultad}
                            </span>
                          </td>
                          <td>
                            <div className="bar-container">
                              <div
                                className="bar-fill"
                                style={{
                                  width: `${
                                    (q.errores / (q.errores + q.aciertos)) * 100
                                  }%`,
                                  backgroundColor:
                                    q.errores > q.aciertos
                                      ? "#f44336"
                                      : "#4caf50",
                                }}
                              ></div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
};

export default Results;
