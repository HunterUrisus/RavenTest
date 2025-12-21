"use strict";
import { Router } from "express";
import { getAllTests, createTest} from "../controller/test.controller.js";

const router = Router();

router.get("/", getAllTests);

router.post("/", createTest);
/*
router.get("/:rut", getTestById);



router.delete("/", deleteTest);

router.put("/", updateTest);
*/
export default router;