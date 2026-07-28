import { Router } from "express";

import { getCpuTemperatureController } from "../controllers/systemController.js";

const systemRouter = Router();

systemRouter.get(
    "/cpu-temperature",
    getCpuTemperatureController,
);

export default systemRouter;