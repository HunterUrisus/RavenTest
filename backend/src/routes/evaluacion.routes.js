"use strict";
import { Router } from "express";
import { enviarEvaluacion, getEvaluacionById } from "../controller/evaluacion.controller.js";

const router = Router();

router.post("/", enviarEvaluacion);
router.get("/:id", getEvaluacionById);

export default router;