"use strict";
import { useCallback, useState } from "react";
import { getAllEvaluaciones } from "../services/evaluacion.service";

export const useGetEvaluaciones = () => {
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [error, setError] = useState(null);
  const fetchEvaluaciones = useCallback(async (evaluacionId) => {
    try {
      const evaluaciones = await getAllEvaluaciones(evaluacionId);
      setEvaluaciones(evaluaciones);
    } catch (error) {
      setError(error.message);
      console.error("Error fetching evaluacion at fetchEvaluacion():", error);
    }
  }, []);
  return { evaluaciones, setEvaluaciones, fetchEvaluaciones, error };
};

export default useGetEvaluaciones;
