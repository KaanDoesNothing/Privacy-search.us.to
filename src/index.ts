import {app, start} from "./server";

import {getResults} from "./main";
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

    let results = await getResults({query});

    return res.render("search", {results});
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