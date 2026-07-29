import { Router } from "express";

import { getWeatherForecastController } from "../controllers/weatherController.js";

const weatherRouter = Router();

weatherRouter.get(
    "/forecast",
    getWeatherForecastController,
);

export default weatherRouter;