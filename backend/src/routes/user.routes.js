"use strict";
import { Router } from "express";
import { getAllUsers, getUserById, createUser, deleteUser, updateUser } from "../controller/user.controller.js";

const router = Router();

router.get("/", getAllUsers);

router.get("/:rut", getUserById);

router.post("/", createUser);

router.delete("/", deleteUser);

router.put("/", updateUser);

export default router;