import { useEffect, useState } from "react";
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
  }, []);

  const studentData = evaluaciones?.filter(e => e.rutEstudiante === rut) || [];

  // --- LÓGICA DEL MANUAL RAVEN ---
  const getRavenGrade = (puntajeParcial) => {
    if (puntajeParcial === undefined) return { grade: "-", diag: "No rendido", color: "#ccc" };
    const rawScore = puntajeParcial * 2; 
    if (rawScore >= 55) return { grade: "I", diag: "Intelectualmente Superior", color: "#4caf50" };
    if (rawScore >= 45) return { grade: "II", diag: "Superior al Término Medio", color: "#8bc34a" };
    if (rawScore >= 35) return { grade: "III", diag: "Término Medio", color: "#ffc107" };
    if (rawScore >= 25) return { grade: "IV", diag: "Inferior al Término Medio", color: "#ff9800" };
    return { grade: "V", diag: "Deficiente", color: "#f44336" };
  };

  if (loading) return <div className="loading-screen"><div className="spinner"></div><p>Cargando expediente...</p></div>;

  // Separamos Test 1 y Test 2 usando el array derivado
  const test1 = studentData.find(e => e.codTest === 1);
  const test2 = studentData.find(e => e.codTest === 2);

  const analisis1 = getRavenGrade(test1?.puntaje);
  const analisis2 = getRavenGrade(test2?.puntaje);

  return (
    <div className="dashboard-page">
      <div className="browser-card">
        <div className="browser-header">
            <button onClick={() => navigate(-1)} className="back-btn">← Volver</button>
            <h2>Expediente del Estudiante: {rut}</h2>
        </div>
        
        <div className="browser-body">
            {/* Si no hay datos después de cargar, mostramos aviso */}
            {studentData.length === 0 && (
                <div style={{textAlign: 'center', padding: '40px', color: '#666'}}>
                    <h3>Este estudiante no tiene evaluaciones registradas.</h3>
                </div>
            )}

            <div className="analysis-grid">
                {/* TARJETA TEST 1 */}
                <div className="kpi-card">
                    <h3>Test 1 (Pre-Test)</h3>
                    <div className="score-circle" style={{borderColor: analisis1.color}}>
                        <span>{test1?.puntaje || "-"}</span>
                        <small>/30</small>
                    </div>
                    <div className="projection-box">
                        <p>Proyección: <strong>{test1 ? test1.puntaje * 2 : "-"}</strong></p>
                        <h4 style={{color: analisis1.color}}>Grado {analisis1.grade}</h4>
                        <p>{analisis1.diag}</p>
                    </div>
                    {test1 && (
                        <button onClick={() => navigate(`/results/student/${rut}/test/1`)} className="btn-detail">
                            Ver Respuestas 1
                        </button>
                    )}
                </div>

                {/* TARJETA TEST 2 */}
                <div className="kpi-card">
                    <h3>Test 2 (Post-Test)</h3>
                    <div className="score-circle" style={{borderColor: analisis2.color}}>
                        <span>{test2?.puntaje || "-"}</span>
                        <small>/30</small>
                    </div>
                     <div className="projection-box">
                        <p>Proyección: <strong>{test2 ? test2.puntaje * 2 : "-"}</strong></p>
                        <h4 style={{color: analisis2.color}}>Grado {analisis2.grade}</h4>
                        <p>{analisis2.diag}</p>
                    </div>
                    {test2 && (
                        <button onClick={() => navigate(`/results/student/${rut}/test/2`)} className="btn-detail">
                            Ver Respuestas 2
                        </button>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default StudentAnalysis;