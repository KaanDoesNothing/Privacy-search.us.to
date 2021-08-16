"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server");
const main_1 = require("./main");
const utils_1 = require("./utils");
const config_json_1 = require("./config.json");
server_1.app.use((req, res, done) => {
    res.locals.query = {};
    done();
});
server_1.app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.render("home");
}));
server_1.app.get("/search", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let query = req.query.q;
    let results = yield main_1.getResults({ query });
    return res.render("search", { results });
}));
server_1.app.get("/screenshot", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let screenshot = yield utils_1.takeScreenshot(req.query.url);
    res.set({
        "Content-Type": "image/png",
        "Content-Disposition": "attachment; filename=screenshot.png"
    });
    return res.send(screenshot);
}));
server_1.start(config_json_1.port);
