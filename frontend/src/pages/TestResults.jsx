import "../styles/TestResults.css";

const TestResults = ({ user, resultado, totalPreguntas = 30, onReset }) => {
  // Desestructuramos lo que devuelve tu backend
    // Asumo que 'resultado' trae { puntaje: number, evaluacionId: number, ... }
  const puntaje = resultado?.puntaje || 0;
  const porcentaje = Math.round((puntaje / totalPreguntas) * 100);

  // Un pequeño feedback visual según el resultado
  const getFeedback = () => {
    if (porcentaje >= 90) return { color: "#4caf50" };
    if (porcentaje >= 75) return { color: "#8bc34a" };
    if (porcentaje >= 50) return { color: "#ffc107" };
    return { color: "#646cff" };
  }; 

  const feedback = getFeedback();

  return (
    <div className="result-page">
      <div className="result-card">
        <div className="icon-check">✓</div>
        
        <h1>Test Finalizado</h1>
        <p className="subtitle">Tus respuestas han sido guardadas exitosamente.</p>

        <div className="score-container">
          <div className="score-circle" style={{ borderColor: feedback.color }}>
            <span className="score-number">{puntaje}</span>
            <span className="score-total">/ {totalPreguntas}</span>
          </div>
          <h2 style={{ color: feedback.color }}>{"Gracias por tu participación"}</h2>
        </div>

        <div className="details-box">
          <div className="detail-item">
            <span>Nombre:</span>
            <strong>{user?.nombre || "---"}</strong>
          </div>
          <div className="detail-item">
            <span>Fecha:</span>
            <strong>{new Date().toLocaleDateString()}</strong>
          </div>
        </div>

        <div className="actions">
            {onReset && (
                <button onClick={onReset} className="btn-primary">
                    Volver al Inicio
                </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default TestResults;