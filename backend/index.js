import "dotenv/config";
import express from "express";
import morgan from "morgan";
import indexRoutes from "./src/routes/index.routes.js";

const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.use("/api", indexRoutes);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/api`);
});
