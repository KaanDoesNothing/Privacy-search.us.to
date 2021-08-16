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
const axios_1 = __importDefault(require("axios"));
const cheerio_1 = __importDefault(require("cheerio"));
const scraper_1 = require("../lib/scraper");
class default_1 extends scraper_1.Scraper {
    scrape() {
        return __awaiter(this, void 0, void 0, function* () {
            let final = [];
            let rawHTML = (yield axios_1.default.post(`https://www.startpage.com/sp/search?query=${this.query}`, {
                "query": this.query,
                "page": 1,
                "cat": "web",
                "cmd": "process_search",
                "engine0": "v1all",
            }, {
                headers: {
                    "Content-Length": 0,
                    "User-Agent": "PostmanRuntime/7.26.8",
                    "Accept": "*/*",
                    "Accept-Encoding": "gzip, deflate, br",
                    "Connection": "keep-alive"
                }
            })).data;
            const $ = cheerio_1.default.load(rawHTML);
            let results = $(".w-gl__result__main");
            results.each((i) => {
                let element = $(results[i]);
                let title = element.find(".w-gl__result-title").text().trim();
                let content = element.find(".w-gl__description").text().trim();
                let url = element.find(".w-gl__result-url").text().trim();
                this.pushToResults({
                    title,
                    content,
                    url
                });
            });
            return this.results;
        });
    }
}
exports.default = default_1;
