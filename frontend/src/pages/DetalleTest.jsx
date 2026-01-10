import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetEvaluaciones } from "../hooks/useGetEvaluaciones";
// Asegúrate de importar el LoadingScreen si lo creaste en el paso anterior
import LoadingScreen from "../components/Loading"; 

const DetalleTest = () => {
  const { rut, testId } = useParams();
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
  }, []);

  const evaluacion = evaluaciones?.find(
    (e) => e.rutEstudiante === rut && e.codTest === Number(testId)
  );

  if (loading) {
    // Usamos tu componente LoadingScreen si ya lo tienes
    return <LoadingScreen text="Cargando detalle..." />;
  }

  if (!evaluacion) {
    return (
        <div className="dashboard-page">
            <div className="browser-card">
                <div className="browser-body" style={{textAlign: 'center', padding: '20px'}}>
                    <p>No se encontró la evaluación solicitada.</p>
                    <button onClick={() => navigate(-1)}>Volver</button>
                </div>
            </div>
        </div>
    )
  }

  return (
    <div className="dashboard-page">
      <div className="browser-card">
        <div className="browser-header">
          <button onClick={() => navigate(-1)} className="back-btn">
            ← Volver al Análisis
          </button>
          <h2>Detalle de Respuestas: Test {testId}</h2>
        </div>

        <div className="browser-body">
          <div className="summary-bar">
            <span>
              Puntaje: <strong>{evaluacion.puntaje}</strong>/30
            </span>
            <span>
              Tiempo Total:{" "}
              {Math.round(
                evaluacion.respuestas?.reduce(
                  (acc, curr) => acc + curr.tiempo,
                  0
                ) / 1000
              )}
              s
            </span>
          </div>

          <div className="answers-grid">
            {evaluacion.respuestas?.map((resp, index) => {
                // Cálculo de segundos por pregunta
                const segundos = (resp.tiempo / 1000).toFixed(1);
                
                return (
                    <div
                        key={index}
                        className={`answer-card ${
                        resp.esCorrecta ? "correct" : "incorrect"
                        }`}
                        style={{ position: "relative" }} // Para posicionar elementos si es necesario
                    >
                        <div className="item-badge">
                            {resp.item?.serie || "?"}-{resp.item?.numero || index + 1}
                        </div>
                        
                        <div className="selection">
                            <small>Eligió:</small>
                            <strong>{resp.respuesta}</strong>
                        </div>

                        {!resp.esCorrecta && (
                            <div className="correction">
                                <small>Correcta:</small>
                                <strong>{resp.item?.resCorrecta || "?"}</strong>
                            </div>
                        )}

                        {/* --- NUEVO: INDICADOR DE TIEMPO --- */}
                        <div 
                            className="time-stat" 
                            style={{ 
                                marginTop: "8px", 
                                borderTop: "1px solid rgba(0,0,0,0.1)", 
                                paddingTop: "4px",
                                fontSize: "0.85rem",
                                color: "#555",
                                display: "flex",
                                alignItems: "center",
                                gap: "4px"
                            }}
                        >
                            <span>{segundos}s</span>
                        </div>
                    </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalleTest;