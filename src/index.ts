import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);

import {app, start, appVersion} from "./server";

import {getResults} from "./scrape_manager";
import { takeScreenshot } from "./utils";
import { port } from "./config.json";

app.use((req, res, done) => {
    res.locals.query = {};

    res.locals.app_version = appVersion;

    done();
});

app.get("/", async (req, res) => {
    return res.render("home");
});

app.get("/view", async (req, res) => {
    return res.render("view/index");
});

app.get("/search", async (req, res) => {
    let query = req.query.q;

    if(!query || query?.length < 1) return res.render("home", {error: {
        type: "search_error",
        message: "You need to enter something to search!"
    }});

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