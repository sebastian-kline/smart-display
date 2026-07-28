export function notFoundHandler(request, response) {
    response.status(404).json({
        error: {
            code: "NOT_FOUND",
            message: `No endpoint exists at ${request.method} ${request.path}.`,
        },
    });
}

export function errorHandler(error, _request, response, next) {
    if (response.headersSent) {
        return next(error);
    }

    console.error("Backend request failed:", error);

    return response.status(500).json({
        error: {
            code: "SYSTEM_DATA_UNAVAILABLE",
            message: "The requested system information is unavailable.",
        },
    });
}