import express, { type Express } from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth";
import router from "./routes";

const app: Express = express();

// Better Auth — debe ir antes del body parser
app.all("/api/auth/*splat", toNodeHandler(auth));

// Middlewares globales
app.use(cors({
  origin: process.env.BASE_PATH || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas de la app
app.use("/api", router);

export default app;
