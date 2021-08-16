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
const cheerio_1 = __importDefault(require("cheerio"));
const scraper_1 = require("../lib/scraper");
class default_1 extends scraper_1.Scraper {
    scrape() {
        return __awaiter(this, void 0, void 0, function* () {
            const rawHTML = yield this.get({ url: `https://html.duckduckgo.com/html?q=${this.query}` });
            const $ = cheerio_1.default.load(rawHTML);
            let results = $(".web-result");
            results.each(i => {
                let element = $(results[i]);
                let title = element.find(".result__title").text().trim();
                let content = element.find(".result__snippet").text().trim();
                let url = element.find(".result__url").text().trim();
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
