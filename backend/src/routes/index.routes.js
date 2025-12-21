"use strict";
import { Router } from "express";
import userRoutes from "./user.routes.js";
import testRoutes from "./test.routes.js";

const router = Router();

router.use("/users", userRoutes);

router.use("/tests", testRoutes);

export default router;
