"use strict";
import { Router } from "express";
import { enviarEvaluacion, getEvaluacionById, getAllEvaluaciones } from "../controller/evaluacion.controller.js";

const router = Router();

router.post("/", enviarEvaluacion);
router.get("/:id", getEvaluacionById);
router.get("/", getAllEvaluaciones);

export default router;