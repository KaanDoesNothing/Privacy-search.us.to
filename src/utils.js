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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fixURL = exports.takeScreenshot = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
const takeScreenshot = (url) => __awaiter(void 0, void 0, void 0, function* () {
    const browser = yield puppeteer_1.default.launch({ headless: false });
    const page = (yield browser.pages())[0];
    yield page.goto(exports.fixURL(url), { waitUntil: "networkidle2", timeout: 60000 });
    const screenshot = yield page.screenshot({
        fullPage: true,
        omitBackground: true
    });
    yield page.close();
    return screenshot;
});
exports.takeScreenshot = takeScreenshot;
const fixURL = (url) => {
    let httpString = "http://";
    let httpsString = "https://";
    if (url.substr(0, httpString.length).toLowerCase() !== httpString && url.substr(0, httpsString.length).toLowerCase() !== httpsString)
        url = httpString + url;
    return url;
};
exports.fixURL = fixURL;
