import "dotenv/config";
import express from "express";
import morgan from "morgan";
import indexRoutes from "./src/routes/index.routes.js";
import cors from "cors";
import { startSeed } from "./src/prisma/seed.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(morgan("dev"));

// Configurar CORS: permite el front en desarrollo o usa FRONTEND_URL en .env
const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:5173";
app.use(cors({ origin: allowedOrigin, credentials: true }));

app.use("/api", indexRoutes);

await startSeed()
  .then(async () => {
    console.log("Seeding verificado");
  })
  .catch(async (e) => {
    console.error("Error al ejecutar el seeding:", e);
    process.exit(1);
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
