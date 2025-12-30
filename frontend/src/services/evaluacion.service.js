"use strict";
import axios from "./root.service.js";

export async function getEvaluacionById(evaluacionId) {
    try {
        const response = await axios.get(`/evaluaciones/${evaluacionId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching evaluacion for ID ${evaluacionId}:`, error);
        throw error;
    }
};

export async function getAllEvaluaciones() {
    try {
        const response = await axios.get("/evaluaciones/");
        return response.data;
    } catch (error) {
        console.error("Error fetching evaluaciones:", error);
        throw error;
    }
};