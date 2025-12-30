"use strict";
import { useState } from "react";
import { getAllRespuestasPorEvaluacion } from "../services/respuestas.service.js";

export const useGetRespuestasPorEvaluacion = () => {
    const [respuestas, setRespuestas] = useState([null]);
    const [error, setError] = useState(null);

    const fetchRespuestasPorEvaluacion = async (evaluacionId) => {
        try {
            const respuestas = await getAllRespuestasPorEvaluacion(evaluacionId);
            setRespuestas(respuestas);
        } catch (error) {
            setError(error.message);
            console.error("Error fetching respuestas at fetchRespuestasPorEvaluacion():", error);
        }
    };
    return { respuestas, setRespuestas, fetchRespuestasPorEvaluacion, error };
}

export default useGetRespuestasPorEvaluacion;