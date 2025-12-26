"use strict";
import { Router } from "express";
import { createItem, getAllItems, getItemsByTestId } from "../controller/item.controller.js";

const router = Router();

router.post("/", createItem);
router.get("/", getAllItems);
router.get("/:testId", getItemsByTestId);

export default router;