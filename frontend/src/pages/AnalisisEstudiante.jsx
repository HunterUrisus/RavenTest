import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetEvaluaciones } from "../hooks/useGetEvaluaciones";
import LoadingScreen from "../components/Loading";
import {
  getEstudianteByRut,
  updateGrupoEstudiante,
} from "../services/estudiantes.service";

const StudentAnalysis = () => {
  const { rut } = useParams();
  const navigate = useNavigate();

  const { evaluaciones, fetchEvaluaciones } = useGetEvaluaciones();
  const [loading, setLoading] = useState(true);

  const [grupo, setGrupo] = useState(1);
  const [savingGrupo, setSavingGrupo] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (!evaluaciones || evaluaciones.length === 0) {
        await fetchEvaluaciones();
      }

      try {
        const estData = await getEstudianteByRut({ rut });
        if (estData && estData.grupo) {
          setGrupo(estData.grupo);
        }
      } catch (error) {
        console.error("No se pudo cargar info del estudiante", error);
      }

      setLoading(false);
    };
    init();
  }, [fetchEvaluaciones, evaluaciones, rut]);

  const handleGroupChange = async (e) => {
    const isChecked = e.target.checked;
    const nuevoValor = isChecked ? 1 : 2;

    setGrupo(nuevoValor);
    setSavingGrupo(true);

    const body = { grupo: nuevoValor };
    try {
      await updateGrupoEstudiante(rut, body);
    } catch (error) {
      console.error("Error actualizando grupo", error);
      setGrupo(isChecked ? 2 : 1);
      alert("Error al actualizar el grupo");
    } finally {
      setSavingGrupo(false);
    }
  };

  const studentData = useMemo(
    () => evaluaciones?.filter((e) => e.rutEstudiante === rut) || [],
    [evaluaciones, rut]
  );
  const test1 = useMemo(
    () => studentData.find((e) => e.codTest === 1),
    [studentData]
  );
  const test2 = useMemo(
    () => studentData.find((e) => e.codTest === 2),
    [studentData]
  );

  const getRavenGrade = (puntajeParcial) => {
    if (puntajeParcial === undefined || puntajeParcial === null)
      return { grade: "-", diag: "No rendido", color: "#ccc", projection: "-" };

    const rawScore = puntajeParcial * 2;
    if (rawScore >= 55) return { grade: "I", diag: "Intelectualmente Superior", color: "#4caf50", projection: rawScore };
    if (rawScore >= 45) return { grade: "II", diag: "Superior al Término Medio", color: "#8bc34a", projection: rawScore };
    if (rawScore >= 35) return { grade: "III", diag: "Término Medio", color: "#ffc107", projection: rawScore };
    if (rawScore >= 25) return { grade: "IV", diag: "Inferior al Término Medio", color: "#ff9800", projection: rawScore };
    return { grade: "V", diag: "Deficiente", color: "#f44336", projection: rawScore };
  };

  const analisis1 = useMemo(() => getRavenGrade(test1?.puntaje), [test1]);
  const analisis2 = useMemo(() => getRavenGrade(test2?.puntaje), [test2]);

  const calculateSeriesScores = (evalData) => {
    const scores = { A: 0, B: 0, C: 0, D: 0, E: 0 };
    if (!evalData?.respuestas) return scores;

    evalData.respuestas.forEach((resp) => {
      if (resp.esCorrecta && resp.item?.serie) {
        if (Object.hasOwn(scores, resp.item.serie)) {
          scores[resp.item.serie]++;
        }
      }
    });
    return scores;
  };

  // --- CORRECCIÓN: Manejo de Milisegundos ---
  const calculateTimeStats = (evalData) => {
    if (!evalData?.respuestas || evalData.respuestas.length === 0) {
      return { total: 0, avg: 0, count: 0 };
    }
    
    // 1. Sumamos el tiempo en MILISEGUNDOS
    const totalMs = evalData.respuestas.reduce((acc, curr) => acc + (curr.tiempo || 0), 0);
    
    // 2. Convertimos a SEGUNDOS para facilitar el resto de los cálculos
    const totalSeconds = totalMs / 1000; 

    // 3. Calculamos el promedio (también quedará en segundos)
    const avgSeconds = totalSeconds / evalData.respuestas.length;

    return { total: totalSeconds, avg: avgSeconds, count: evalData.respuestas.length };
  };

  const formatTime = (seconds) => {
    if (!seconds) return "-";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}m ${secs}s`; 
  };

  const scoresT1 = useMemo(() => calculateSeriesScores(test1), [test1]);
  const scoresT2 = useMemo(() => calculateSeriesScores(test2), [test2]);
  
  // Calculamos Estadísticas de Tiempo
  const timesT1 = useMemo(() => calculateTimeStats(test1), [test1]);
  const timesT2 = useMemo(() => calculateTimeStats(test2), [test2]);

  const seriesKeys = ["A", "B", "C", "D", "E"];

  const renderDiff = (val1, val2) => {
    if (val1 === undefined || val2 === undefined)
      return <span className="diff-stable">-</span>;
    const diff = val2 - val1;
    const sign = diff > 0 ? "+" : "";
    let className = "diff-stable";
    if (Math.abs(diff) >= 3) className = "diff-alert";
    else if (Math.abs(diff) === 2) className = "diff-warning";

    return <span className={className}>{sign}{diff}</span>;
  };

  const renderTimeDiff = (val1, val2) => {
    if (!val1 || !val2) return "-";
    const diff = val2 - val1;
    const sign = diff > 0 ? "+" : ""; // + es más lento, - es más rápido
    
    // Verde si bajó el tiempo (negativo), Rojo si subió mucho (> 10s), Gris si es poco
    const color = diff < 0 ? "#2e7d32" : diff > 10 ? "#d32f2f" : "#666";
    
    return (
      <span style={{ color, fontWeight: "bold" }}>
        {sign}{diff.toFixed(1)}s
      </span>
    );
  };

  if (loading)
    return <LoadingScreen text="Cargando expediente del estudiante..." />;

  return (
    <div className="dashboard-page">
      <div className="browser-card">
        <div className="browser-header">
          <button onClick={() => navigate(-1)} className="back-btn">
            ← Volver
          </button>
          <h2>Expediente del Estudiante: {rut}</h2>

          <div className="group-control" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {savingGrupo && (
              <span style={{ fontSize: "0.8rem", color: "#888" }}>Guardando...</span>
            )}
            <label
              style={{
                display: "flex", alignItems: "center", gap: "8px", cursor: "pointer",
                background: grupo === 1 ? "#e8f5e9" : "#f5f5f5",
                padding: "5px 10px", borderRadius: "6px", border: "1px solid #ddd",
              }}
            >
              <input
                type="checkbox"
                checked={grupo === 1}
                onChange={handleGroupChange}
                style={{ cursor: "pointer", width: "16px", height: "16px" }}
              />
              <span style={{ fontWeight: "bold", color: grupo === 1 ? "#2e7d32" : "#666" }}>
                {grupo === 1 ? "Grupo Experimental (1)" : "Grupo Control (2)"}
              </span>
            </label>
          </div>
        </div>

        <div className="browser-body">
          {studentData.length === 0 && (
            <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
              <h3>Este estudiante no tiene evaluaciones registradas.</h3>
            </div>
          )}

          <div className="analysis-grid">
            {/* --- CARDS SUPERIORES --- */}
            <div className="kpi-card">
              <h3>Test 1 (Pre-Test)</h3>
              <div className="score-circle" style={{ borderColor: analisis1.color }}>
                <span>{test1?.puntaje || "-"}</span>
                <small>/30</small>
              </div>
              <div className="projection-box">
                <p>Proyección: <strong>{test1 ? test1.puntaje * 2 : "-"}</strong></p>
                <h4 style={{ color: analisis1.color }}>Grado {analisis1.grade}</h4>
                <p>{analisis1.diag}</p>
              </div>
              {test1 && (
                <button onClick={() => navigate(`/results/student/${rut}/test/1`)} className="btn-detail">
                  Ver Respuestas 1
                </button>
              )}
            </div>

            <div className="kpi-card">
              <h3>Test 2 (Post-Test)</h3>
              <div className="score-circle" style={{ borderColor: analisis2.color }}>
                <span>{test2?.puntaje || "-"}</span>
                <small>/30</small>
              </div>
              <div className="projection-box">
                <p>Proyección: <strong>{test2 ? test2.puntaje * 2 : "-"}</strong></p>
                <h4 style={{ color: analisis2.color }}>Grado {analisis2.grade}</h4>
                <p>{analisis2.diag}</p>
              </div>
              {test2 && (
                <button onClick={() => navigate(`/results/student/${rut}/test/2`)} className="btn-detail">
                  Ver Respuestas 2
                </button>
              )}
            </div>

            {/* --- SECCIÓN 2: TABLA DE SERIES --- */}
            {(test1 || test2) && (
              <div className="fade-in">
                <h2 style={{ borderBottom: "none", marginBottom: "10px" }}>
                  Análisis de Consistencia por Serie
                </h2>
                <p style={{ color: "#666", marginBottom: "20px" }}>
                  Comparativa del rendimiento en las distintas series entre ambos tests.
                </p>

                <div className="table-wrapper">
                  <table className="data-table discrepancy-table">
                    <thead>
                      <tr>
                        <th>Serie</th>
                        <th>Test 1 (Correctas)</th>
                        <th>Test 2 (Correctas)</th>
                        <th>Diferencia (T2 vs T1)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {seriesKeys.map((serie) => {
                        const t1Score = test1 ? scoresT1[serie] : undefined;
                        const t2Score = test2 ? scoresT2[serie] : undefined;
                        return (
                          <tr key={serie}>
                            <td>Serie {serie}</td>
                            <td>{t1Score ?? "-"}</td>
                            <td>{t2Score ?? "-"}</td>
                            <td>{renderDiff(t1Score, t2Score)}</td>
                          </tr>
                        );
                      })}
                      <tr style={{ borderTop: "2px solid #e0e0e0", fontWeight: "bold", backgroundColor: "#f9f9f9" }}>
                        <td>TOTALES</td>
                        <td>{test1?.puntaje ?? "-"}</td>
                        <td>{test2?.puntaje ?? "-"}</td>
                        <td>{renderDiff(test1?.puntaje, test2?.puntaje)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* --- SECCIÓN 3: TABLA DE TIEMPOS --- */}
            {(test1 || test2) && (
              <div className="fade-in">
                <h2 >
                  Análisis de Velocidad y Tiempos
                </h2>
                <p style={{ color: "#666", marginBottom: "20px" }}>
                  Comparativa de tiempos de respuesta. (Valores negativos indican mayor velocidad en el segundo intento).
                </p>

                <div className="table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Métrica</th>
                        <th>Test 1 (Pre)</th>
                        <th>Test 2 (Post)</th>
                        <th>Diferencia (T2 - T1)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong>Tiempo Total</strong></td>
                        <td>{formatTime(timesT1.total)}</td>
                        <td>{formatTime(timesT2.total)}</td>
                        <td>{renderTimeDiff(timesT1.total, timesT2.total)}</td>
                      </tr>
                      <tr>
                        <td><strong>Promedio por Pregunta</strong></td>
                        <td>{timesT1.avg > 0 ? timesT1.avg.toFixed(2) + "s" : "-"}</td>
                        <td>{timesT2.avg > 0 ? timesT2.avg.toFixed(2) + "s" : "-"}</td>
                        <td>{renderTimeDiff(timesT1.avg, timesT2.avg)}</td>
                        
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentAnalysis;