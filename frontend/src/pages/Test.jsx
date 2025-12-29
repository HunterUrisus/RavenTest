import { useEffect, useState, useRef } from "react";
import Item from "../components/Item.jsx";
import getItemsByTestId from "../hooks/useGetItemsById.jsx";
import { sendEvaluacion } from "../services/test.service.js";

const Test = ({ user, testSelected = 3, onFinish }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [respuestas, setRespuestas] = useState([]);
  const [loading, setLoading] = useState(true);
  const { items, fetchItems } = getItemsByTestId();

  const startTime = useRef(Date.now());

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    fetchItems(testSelected);
  }, []);

  useEffect(() => {
    if (items.length > 0) {
      setLoading(false);
    }
  }, [items]);

  useEffect(() => {
    if (!loading) {
      startTime.current = Date.now();
    }
  }, [currentIndex, loading]);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Cargando preguntas...</p>
      </div>
    );
  }

  const handleAnswer = (selectedOption) => {
    const endTime = Date.now();
    const duracionMs = endTime - startTime.current;
    setLoading(true);

    const itemActual = items[currentIndex];

    const nuevaRespuesta = {
      rutEstudiante: user?.rut,
      idItem: itemActual.idItem,
      selectedOption,
      tiempo: duracionMs,
    };

    const nuevasRespuestas = [...respuestas, nuevaRespuesta];
    setRespuestas(nuevasRespuestas);

    if (currentIndex < items.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      handleFinishTest(nuevasRespuestas);
    }

    setLoading(false);
  };

  const handleFinishTest = async (nuevasRespuestas) => {
    setLoading(true);
    const evaluacionData = {
      rut: user?.rut,
      codTest: testSelected,
      respuestas: nuevasRespuestas,
      puntaje: nuevasRespuestas.filter((r) => {
        return (
          r.selectedOption ===
          items.find((i) => i.idItem === r.idItem).resCorrecta
        );
      }).length,
    };

    const result = await sendEvaluacion(evaluacionData);
    if (onFinish && result != null) {
      onFinish(result, nuevasRespuestas.length);
      setLoading(false);
    }
  };

  const currentQuestion = items[currentIndex];

  return (
    <div className="test-page">
      <div className="title">
        <h1>TEST DE RAVEN</h1>
      </div>
      <div className="test-container">
        {loading ? (
          <p>Cargando pregunta...</p>
        ) : (
          <Item
            questionNumber={currentIndex + 1}
            serie={currentQuestion.serie}
            num={currentQuestion.numero}
            cantOpciones={currentQuestion.cantOpciones}
            onAnswer={handleAnswer}
          />
        )}
      </div>
    </div>
  );
};

export default Test;
