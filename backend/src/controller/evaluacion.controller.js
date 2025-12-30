"use strict";
import { prisma } from "../lib/prisma";

export const enviarEvaluacion = async (req, res) => {
  const { rut, codTest, respuestas } = req.body;

  try {
    const itemsDb = await prisma.item.findMany({
      where: { codTest: Number(codTest) },
      select: { idItem: true, resCorrecta: true },
    });

    let puntaje = 0;

    const respuestasParaGuardar = respuestas.map((respUser) => {
      const itemReal = itemsDb.find((i) => i.idItem === respUser.idItem);

      const esCorrecta =
        itemReal && itemReal.resCorrecta === respUser.selectedOption + 1;

      if (esCorrecta) puntaje++;

      return {
        idItem: respUser.idItem,
        respuesta: respUser.selectedOption,
        tiempo: respUser.tiempo || 0,
        esCorrecta: esCorrecta,
      };
    });

    const nuevaEvaluacion = await prisma.evaluacion.create({
      data: {
        rutEstudiante: rut,
        codTest: Number(codTest),
        puntaje: puntaje,
        respuestas: {
          create: respuestasParaGuardar,
        },
      },
      include: {
        respuestas: true, // Para devolverle el detalle al frontend
      },
    });

    res.status(200).json({
      message: "Test finalizado con éxito",
      puntaje: puntaje,
      evaluacionId: nuevaEvaluacion.id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getEvaluacionById = async (req, res) => {
  try {
    const { id } = req.params;
    const evaluacion = await prisma.evaluacion.findMany({
      where: { id: parseInt(id) },
    });
    if (!evaluacion) {
      res.status(400).json({ message: "No se pudo encontrar la evaluación." });
    }

    res.status(200).json({ message: "Evaluación encontrada:", evaluacion });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAllEvaluaciones = async (req, res) => {
  try {
    const evaluaciones = await prisma.evaluacion.findMany({
      include: {
        respuestas: {
          include: {
            item: true,
          },
        },
      },
    });
    if (!evaluaciones) {
      res
        .status(400)
        .json({ message: "No se pudieron encontrar las evaluaciones." });
    }
    res.status(200).json(evaluaciones);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
