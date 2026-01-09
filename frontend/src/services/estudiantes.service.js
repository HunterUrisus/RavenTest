import axios from "./root.service.js";

export async function getAllEstudiantes() {
    try {
        const response = await axios.get("/users/");
        return response.data;
    } catch (error) {
        console.error("Error fetching estudiantes:", error);
    }
}

export const updateGrupoEstudiante = async (rut, grupo) => { 
    try {
        const response = await axios.patch(`/users/${rut}`, { grupo });
        return response.data;
    } catch (error) {
        console.error("Error updating grupo for estudiante:", error);
    }
}

export const getEstudianteByRut = async (rut) => {
    try {
        const response = await axios.get(`/users/${rut}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching estudiante by RUT:", error);
    }
}

export const createEstudiante = async (estudianteData) => { 
    try {
        const response = await axios.post("/users/", estudianteData);
        return response.data;
    } catch (error) {
        console.error("Error creating estudiante:", error);
    }
}