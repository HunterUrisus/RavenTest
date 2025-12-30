"use strict";
import axios from "./root.service.js";

export async function getAllRespuestasPorEvaluacion(evaluacionId) {
    try {
        const response = await axios.get(`/respuestas/${evaluacionId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching respuestas for evaluacion ID ${evaluacionId}:`, error);
        throw error;
    }
};
