import app from "./app.js";

const host = process.env.HOST ?? "127.0.0.1";
const port = Number.parseInt(process.env.PORT ?? "3001", 10);

const server = app.listen(port, host, () => {
    console.log(`Smart Display API listening at http://${host}:${port}`);
});

function shutDown(signal) {
    console.log(`${signal} received. Shutting down API.`);

    server.close((error) => {
        if (error) {
            console.error("API shutdown failed:", error);
            process.exit(1);
        }

        process.exit(0);
    });

    // Prevent the process from hanging indefinitely during shutdown.
    setTimeout(() => {
        console.error("API shutdown timed out.");
        process.exit(1);
    }, 10_000).unref();
}

process.on("SIGTERM", () => shutDown("SIGTERM"));
process.on("SIGINT", () => shutDown("SIGINT"));