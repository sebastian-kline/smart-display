import express from "express";
import fs from "fs";

const app = express();

app.get("/api/cpu-temp", (req, res) => {
    fs.readFile(
        "/sys/class/thermal/thermal_zone0/temp",
        "utf8",
        (err, data) => {
            if (err) {
                return res.status(500).json({
                    error: "Couldn't read CPU temp",
                });
            }

            res.json({
                temp: (parseInt(data) / 1000).toFixed(1),
            });
        }
    );
});

app.listen(3001, () => {
    console.log("Backend running on port 3001");
});