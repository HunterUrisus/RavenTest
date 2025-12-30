"use strict";
import { useState } from "react";
import { getAllEstudiantes } from "../services/estudiantes.service";

export const useGetEstudiantes = () => { 
    const [estudiantes, setEstudiantes] = useState([null]);
    const [error, setError] = useState(null);

    const fetchEstudiantes = async () => {
        try {
            const estudiantes = await getAllEstudiantes();
            setEstudiantes(estudiantes);
        } catch (error) {
            setError(error.message);
            console.error("Error fetching estudiantes at fetchEstudiantes():", error);
        }
    };

    return { estudiantes, setEstudiantes, fetchEstudiantes, error };
}

export default useGetEstudiantes;