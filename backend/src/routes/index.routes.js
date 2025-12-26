"use strict";
import { Router } from "express";
import userRoutes from "./user.routes.js";
import testRoutes from "./test.routes.js";
import itemRoutes from "./item.routes.js";
import evaluacionRoutes from "./evaluacion.routes.js";

const router = Router();

router.use("/users", userRoutes);
router.use("/tests", testRoutes);
router.use("/items", itemRoutes);
router.use("/evaluaciones", evaluacionRoutes);

export default router;
