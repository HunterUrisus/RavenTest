"use strict";
import { Router } from "express";
import { getAllTests, createTest, getTestById} from "../controller/test.controller.js";

const router = Router();

router.get("/", getAllTests);

router.post("/", createTest);

router.get("/:id", getTestById);

/*

router.delete("/", deleteTest);

router.put("/", updateTest);
*/
export default router;