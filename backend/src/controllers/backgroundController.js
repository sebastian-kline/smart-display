import { getAvailableBackgrounds } from "../services/backgroundService.js";

export async function getBackgroundsController(
    _request,
    response,
) {
    const backgrounds = await getAvailableBackgrounds();

    response.setHeader("Cache-Control", "no-store");

    response.status(200).json({
        data: {
            backgrounds,
        },
    });
}