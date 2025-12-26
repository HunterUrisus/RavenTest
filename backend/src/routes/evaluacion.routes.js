"use strict";
import { Router } from "express";
import { enviarEvaluacion } from "../controller/evaluacion.controller.js";

const router = Router();

router.post("/", enviarEvaluacion);

export default router;