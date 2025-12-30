import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetEvaluaciones } from "../hooks/useGetEvaluaciones";

const StudentAnalysis = () => {
  const { rut } = useParams();
  const navigate = useNavigate();

  const { evaluaciones, fetchEvaluaciones } = useGetEvaluaciones();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      if (!evaluaciones || evaluaciones.length === 0) {
        await fetchEvaluaciones();
      }
      setLoading(false);
    };
    init();
  }, [fetchEvaluaciones, evaluaciones]);

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
    // Tabla aproximada Adultos
    if (rawScore >= 55)
      return {
        grade: "I",
        diag: "Intelectualmente Superior",
        color: "#4caf50",
        projection: rawScore,
      };
    if (rawScore >= 45)
      return {
        grade: "II",
        diag: "Superior al Término Medio",
        color: "#8bc34a",
        projection: rawScore,
      };
    if (rawScore >= 35)
      return {
        grade: "III",
        diag: "Término Medio",
        color: "#ffc107",
        projection: rawScore,
      };
    if (rawScore >= 25)
      return {
        grade: "IV",
        diag: "Inferior al Término Medio",
        color: "#ff9800",
        projection: rawScore,
      };
    return {
      grade: "V",
      diag: "Deficiente",
      color: "#f44336",
      projection: rawScore,
    };
  };

  const analisis1 = useMemo(() => getRavenGrade(test1?.puntaje), [test1]);
  const analisis2 = useMemo(() => getRavenGrade(test2?.puntaje), [test2]);

  const calculateSeriesScores = (evalData) => {
    const scores = { A: 0, B: 0, C: 0, D: 0, E: 0 };
    if (!evalData?.respuestas) return scores;

    evalData.respuestas.forEach((resp) => {
      // Asumimos que tu backend trae el objeto 'item' con la propiedad 'serie'
      if (resp.esCorrecta && resp.item?.serie) {
        // Incrementamos el contador de esa serie si existe en nuestro mapa
        if (Object.hasOwn(scores, resp.item.serie)) {
          scores[resp.item.serie]++;
        }
      }
    });
    return scores;
  };

  // Calculamos los desgloses (usamos useMemo para eficiencia)
  const scoresT1 = useMemo(() => calculateSeriesScores(test1), [test1]);
  const scoresT2 = useMemo(() => calculateSeriesScores(test2), [test2]);
  const seriesKeys = ["A", "B", "C", "D", "E"];

  // Función para mostrar la diferencia con colores
  const renderDiff = (val1, val2) => {
    if (val1 === undefined || val2 === undefined)
      return <span className="diff-stable">-</span>;
    const diff = val2 - val1;
    const sign = diff > 0 ? "+" : "";

    // Criterio simple de discrepancia: diferencia mayor a 2 puntos en una serie
    let className = "diff-stable";
    if (Math.abs(diff) >= 3) className = "diff-alert";
    else if (Math.abs(diff) === 2) className = "diff-warning";

    return (
      <span className={className}>
        {sign}
        {diff}
      </span>
    );
  };

  if (loading)
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Cargando expediente...</p>
      </div>
    );

  return (
    <div className="dashboard-page">
      <div className="browser-card">
        <div className="browser-header">
          <button onClick={() => navigate(-1)} className="back-btn">
            ← Volver
          </button>
          <h2>Expediente del Estudiante: {rut}</h2>
        </div>

        <div className="browser-body">
          {/* Si no hay datos después de cargar, mostramos aviso */}
          {studentData.length === 0 && (
            <div
              style={{ textAlign: "center", padding: "40px", color: "#666" }}
            >
              <h3>Este estudiante no tiene evaluaciones registradas.</h3>
            </div>
          )}

          <div className="analysis-grid">
            {/* TARJETA TEST 1 */}
            <div className="kpi-card">
              <h3>Test 1 (Pre-Test)</h3>
              <div
                className="score-circle"
                style={{ borderColor: analisis1.color }}
              >
                <span>{test1?.puntaje || "-"}</span>
                <small>/30</small>
              </div>
              <div className="projection-box">
                <p>
                  Proyección: <strong>{test1 ? test1.puntaje * 2 : "-"}</strong>
                </p>
                <h4 style={{ color: analisis1.color }}>
                  Grado {analisis1.grade}
                </h4>
                <p>{analisis1.diag}</p>
              </div>
              {test1 && (
                <button
                  onClick={() => navigate(`/results/student/${rut}/test/1`)}
                  className="btn-detail"
                >
                  Ver Respuestas 1
                </button>
              )}
            </div>

            {/* TARJETA TEST 2 */}
            <div className="kpi-card">
              <h3>Test 2 (Post-Test)</h3>
              <div
                className="score-circle"
                style={{ borderColor: analisis2.color }}
              >
                <span>{test2?.puntaje || "-"}</span>
                <small>/30</small>
              </div>
              <div className="projection-box">
                <p>
                  Proyección: <strong>{test2 ? test2.puntaje * 2 : "-"}</strong>
                </p>
                <h4 style={{ color: analisis2.color }}>
                  Grado {analisis2.grade}
                </h4>
                <p>{analisis2.diag}</p>
              </div>
              {test2 && (
                <button
                  onClick={() => navigate(`/results/student/${rut}/test/2`)}
                  className="btn-detail"
                >
                  Ver Respuestas 2
                </button>
              )}
            </div>

            {/* SECCIÓN 2: NUEVA TABLA DE ANÁLISIS DE DISCREPANCIAS */}
            {(test1 || test2) && (
              <div className="fade-in">
                <h2 style={{ borderBottom: "none", marginBottom: "10px" }}>
                  Análisis de Consistencia por Serie
                </h2>
                <p style={{ color: "#666", marginBottom: "20px" }}>
                  Comparativa del rendimiento en las distintas series entre
                  ambos tests para detectar discrepancias significativas.
                </p>

                <div className="table-wrapper">
                  <table className="data-table discrepancy-table">
                    <thead>
                      <tr>
                        <th>Serie</th>
                        <th>Test 1 (Correctas)</th>
                        <th>Test 2 (Correctas)</th>
                        <th>Diferencia (T2 vs T1)</th>
                        <th>Análisis Rápido</th>
                      </tr>
                    </thead>
                    <tbody>
                      {seriesKeys.map((serie) => {
                        const t1Score = test1 ? scoresT1[serie] : undefined;
                        const t2Score = test2 ? scoresT2[serie] : undefined;
                        const diff =
                          t1Score !== undefined && t2Score !== undefined
                            ? t2Score - t1Score
                            : 0;

                        let analisisTexto = "Consistente";
                        if (Math.abs(diff) >= 3)
                          analisisTexto = "Discrepancia Alta (Revisar)";
                        else if (diff <= -2)
                          analisisTexto = "Caída de rendimiento";
                        else if (diff >= 2) analisisTexto = "Mejora notable";

                        return (
                          <tr key={serie}>
                            <td>Serie {serie}</td>
                            <td>{t1Score ?? "-"}</td>
                            <td>{t2Score ?? "-"}</td>
                            <td>{renderDiff(t1Score, t2Score)}</td>
                            <td
                              style={{
                                fontSize: "0.9em",
                                color: Math.abs(diff) >= 3 ? "#f44336" : "#666",
                              }}
                            >
                              {t1Score !== undefined && t2Score !== undefined
                                ? analisisTexto
                                : "-"}
                            </td>
                          </tr>
                        );
                      })}
                      {/* Fila de Totales */}
                      <tr
                        style={{
                          borderTop: "2px solid #e0e0e0",
                          fontWeight: "bold",
                          backgroundColor: "#f9f9f9",
                        }}
                      >
                        <td>TOTALES</td>
                        <td>{test1?.puntaje ?? "-"}</td>
                        <td>{test2?.puntaje ?? "-"}</td>
                        <td>{renderDiff(test1?.puntaje, test2?.puntaje)}</td>
                        <td></td>
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
