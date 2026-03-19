import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import storesRouter from "./stores";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/auth", authRouter);
router.use("/stores", storesRouter);

export default router;
