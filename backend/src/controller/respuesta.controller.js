"use strict";
import { prisma } from "../lib/prisma";

export const createRespuesta = async (req, res) => {
    try {
        const { rutEstudiante, idItem, respuesta, tiempo } = req.body;

        const newRespuesta = await prisma.respuesta.create({
            data: {
                rutEstudiante,
                idItem,
                respuesta,
                tiempo,
            },
        });
        res.status(201).json({message: "Respuesta creada exitosamente", data: newRespuesta});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
}

export const getRespuestasByEstudiante = async (req, res) => {
    try {
        const { rutEstudiante } = req.params;
        const respuestas = await prisma.respuesta.findMany({
            where: { rutEstudiante },
        });
        res.status(201).json(respuestas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
};