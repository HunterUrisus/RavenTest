import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetEvaluaciones } from "../hooks/useGetEvaluaciones";

const DetalleTest = () => {
    const { rut, testId } = useParams();
    const navigate = useNavigate();
  
    // 1. Destructuramos también la función fetch para asegurar la carga
    const { evaluaciones, fetchEvaluaciones } = useGetEvaluaciones();
    const [loading, setLoading] = useState(true);

    // 2. useEffect ÚNICO para cargar datos iniciales (sin lógica de setEvaluacion)
    useEffect(() => {
        const init = async () => {
            // Si no hay evaluaciones en memoria, las pedimos al backend
            if (!evaluaciones || evaluaciones.length === 0) {
                await fetchEvaluaciones();
            }
            setLoading(false);
        };
        init();
    }, []);

    // 3. ESTADO DERIVADO: Calculamos la evaluación "al vuelo"
    // Esto evita el useState redundante y el error de sincronización
    const evaluacion = evaluaciones?.find(
        (e) => e.rutEstudiante === rut && e.codTest === Number(testId)
    );
    console.log("Evaluacion encontrada:", evaluacion);

  // --- Renderizado Condicional ---

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="loading-screen">
          <div className="spinner"></div>
          <p>Cargando detalle...</p>
        </div>
      </div>
    );
  }

  if (!evaluacion) {
    return (
      <div className="dashboard-page">
        <div className="browser-card">
          <div className="browser-body" style={{textAlign: 'center', padding: '50px'}}>
            <h3>No se encontró la evaluación solicitada.</h3>
            <button onClick={() => navigate(-1)} className="back-btn">Volver</button>
          </div>
        </div>
      </div>
    );
  }

  // --- Renderizado Principal (Igual que antes) ---
  return (
    <div className="dashboard-page">
      <div className="browser-card">
        <div className="browser-header">
           <button onClick={() => navigate(-1)} className="back-btn">← Volver al Análisis</button>
           <h2>Detalle de Respuestas: Test {testId}</h2>
        </div>

        <div className="browser-body">
            <div className="summary-bar">
                <span>Puntaje: <strong>{evaluacion.puntaje}</strong>/30</span>
                <span>
                  Tiempo Total: {Math.round(evaluacion.respuestas?.reduce((acc, curr) => acc + curr.tiempo, 0) / 1000)}s
                </span>
            </div>

            <div className="answers-grid">
                {evaluacion.respuestas?.map((resp, index) => (
                    <div 
                        key={index} 
                        className={`answer-card ${resp.esCorrecta ? "correct" : "incorrect"}`}
                    >
                        <div className="item-badge">{resp.item?.serie || "?"}-{resp.item?.numero || index + 1}</div>
                        <div className="selection">
                            <small>Eligió:</small>
                            <strong>{resp.respuesta}</strong>
                        </div>
                        {!resp.esCorrecta && (
                           <div className="correction">
                               <small>Correcta:</small>
                               {/* Si tu backend trae el item, muestra la correcta */}
                               <strong>{resp.item?.resCorrecta || "?"}</strong>
                           </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default DetalleTest;