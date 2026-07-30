import { Router } from "express";

import { getBackgroundsController } from "../controllers/backgroundController.js";

const backgroundRouter = Router();

backgroundRouter.get("/", getBackgroundsController);

export default backgroundRouter;