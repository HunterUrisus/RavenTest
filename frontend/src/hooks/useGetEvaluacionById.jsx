"use strict";
import { useState } from "react";
import { getEvaluacionById } from "../services/evaluacion.service.js";

export const useGetEvaluacionById = () => { 
    const [evaluacion, setEvaluacion] = useState(null);
    const [error, setError] = useState(null);
    const fetchEvaluacionById = async (evaluacionId) => {
        try {
            const evaluacion = await getEvaluacionById(evaluacionId);
            setEvaluacion(evaluacion);
        } catch (error) {
            setError(error.message);
            console.error("Error fetching evaluacion at fetchEvaluacionById():", error);
        }
    };

    return { evaluacion, setEvaluacion, fetchEvaluacionById, error };
}

export default useGetEvaluacionById;