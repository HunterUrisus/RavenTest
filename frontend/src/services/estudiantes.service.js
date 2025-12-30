import axios from "./root.service.js";

export async function getAllEstudiantes() {
    try {
        const response = await axios.get("/users/");
        return response.data;
    } catch (error) {
        console.error("Error fetching estudiantes:", error);
    }
}