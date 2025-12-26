import axios from "./root.service.js";

export async function sendEvaluacion(evaluacionData) {
    try {
        const response = await axios.post("/evaluaciones/", evaluacionData);
        return response.data;
    } catch (error) {
        console.error("Error sending evaluacion:", error);
    }
}