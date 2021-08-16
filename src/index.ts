import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);

import {app, start} from "./server";

import {getResults} from "./scrape_manager";
import { takeScreenshot } from "./utils";
import { port } from "./config.json";

app.use((req, res, done) => {
    res.locals.query = {};

    done();
});

app.get("/", async (req, res) => {
    return res.render("home");
});

app.get("/search", async (req, res) => {
    let query = req.query.q;

    let startTime = Date.now();
    
    let results = await getResults({query});

    let endTime = Date.now();

    return res.render("search", {
        results,
        load_time: {
            formatted: dayjs.duration(endTime - startTime).seconds(),
            raw: endTime - startTime
        }
    });
});

app.get("/screenshot", async (req, res) => {
    let screenshot = await takeScreenshot(req.query.url);

    res.set({
        "Content-Type": "image/png",
        "Content-Disposition": "attachment; filename=screenshot.png"
    });
    
    return res.send(screenshot);
});

start(port);