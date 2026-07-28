import express from "express";

import {
    errorHandler,
    notFoundHandler,
} from "./middleware/errorHandlers.js";
import systemRouter from "./routes/systemRoutes.js";

const app = express();

app.disable("x-powered-by");

app.get("/api/health", (_request, response) => {
    response.status(200).json({
        status: "ok",
    });
});

app.use("/api/system", systemRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;