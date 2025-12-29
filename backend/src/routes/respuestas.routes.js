"use strict";
import { Router } from "express";
import { getRespuestasByEvaluacionId } from "../controller/respuesta.controller.js";

const router = new Router();

router.get("/:idEvaluacion", getRespuestasByEvaluacionId);

export default router;