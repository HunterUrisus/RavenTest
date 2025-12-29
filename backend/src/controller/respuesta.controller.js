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
    res
      .status(201)
      .json({ message: "Respuesta creada exitosamente", data: newRespuesta });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

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

export const getRespuestasByEvaluacionId = async (req, res) => {
  try {
    const { idEvaluacion } = req.params;
    const respuestas = await prisma.respuestaItem.findMany({
      where: { idEvaluacion: parseInt(idEvaluacion) },
    });

    if (!respuestas)
      res.status(400).json({ message: "No se encontraron respuestas." });

    res.status(200).json(respuestas);
  } catch (error) {
    consoler.error(error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

