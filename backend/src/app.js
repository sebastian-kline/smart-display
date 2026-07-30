import express from "express";

import {
    errorHandler,
    notFoundHandler,
} from "./middleware/errorHandlers.js";
import backgroundRouter from "./routes/backgroundRoutes.js";
import systemRouter from "./routes/systemRoutes.js";
import weatherRouter from "./routes/weatherRoutes.js";

const app = express();

app.disable("x-powered-by");

app.use(
    express.json({
        limit: "10kb",
    }),
);

app.get("/api/health", (_request, response) => {
    response.status(200).json({
        status: "ok",
    });
});

app.use("/api/backgrounds", backgroundRouter);
app.use("/api/system", systemRouter);
app.use("/api/weather", weatherRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;