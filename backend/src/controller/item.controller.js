"use strict";
import { prisma } from "../lib/prisma";

export const getAllItems = async (req, res) => {
    try {
        const items = await prisma.item.findMany();
        if (items.length === 0) {
            return res.status(404).json({
                message: "No se encontraron items",
                data: []
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
}

export const getItemsByTestId = async (req, res) => {
    try {
        const { testId } = req.params;
        const items = await prisma.item.findMany({
            where: { testId: parseInt(testId) },
        });
        res.status(201).json(items);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
};

export const createItem = async (req, res) => { 
    try {
        const { serie, numero, resCorrecta, dificultad, cantOpciones, codTest } = req.body;

        // Verificar formato de imagenPregunta (debe ser A-1, A-2, B-2 ..., E-12)
        const preguntaRegex = /^[A-E]-[1-12]$/;
        if (!preguntaRegex.test(serie + "-" + numero)) {
            return res.status(400).json({ message: "Formato de imagenPregunta inválido. Debe ser de estilo A-1" });
        }

        const respuestaRegex = /^[1-6]$/;
        if (!respuestaRegex.test(resCorrecta)) {
            return res.status(400).json({ message: "Formato de resCorrecta inválido. Debe ser un número entre 1 y 6" });
        }

        const dificultadOptions = ["Fácil", "Medio", "Difícil"];
        if (dificultad && !dificultadOptions.includes(dificultad)) {
            return res.status(400).json({ message: `Dificultad inválida. Opciones permitidas: ${dificultadOptions.join(", ")}` });
        }

        const newItem = await prisma.item.create({
            data: {
                serie,
                numero,
                resCorrecta,
                dificultad,
                codTest,
                cantOpciones,
            },
        });
        res.status(201).json({message: "Item creado exitosamente", data: newItem});


    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
}