import { Router } from "express";

import {
    exitKioskController,
    getBrightnessController,
    getCpuTemperatureController,
    getVolumeController,
    updateBrightnessController,
    updateVolumeController,
} from "../controllers/systemController.js";

const systemRouter = Router();

systemRouter.get(
    "/cpu-temperature",
    getCpuTemperatureController,
);

systemRouter.get(
    "/control/brightness",
    getBrightnessController,
);

systemRouter.put(
    "/control/brightness",
    updateBrightnessController,
);

systemRouter.get(
    "/control/volume",
    getVolumeController,
);

systemRouter.put(
    "/control/volume",
    updateVolumeController,
);

systemRouter.post(
    "/control/kiosk/exit",
    exitKioskController,
);

export default systemRouter;