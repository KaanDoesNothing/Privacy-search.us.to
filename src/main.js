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
exports.getResults = void 0;
const duckduckgo_1 = __importDefault(require("./scrapers/duckduckgo"));
const startpage_1 = __importDefault(require("./scrapers/startpage"));
const wikipedia_1 = __importDefault(require("./scrapers/wikipedia"));
const getResults = ({ query }) => __awaiter(void 0, void 0, void 0, function* () {
    let results = yield Promise.all([
        new duckduckgo_1.default({ query }).scrape(),
        new startpage_1.default({ query }).scrape(),
        new wikipedia_1.default({ query }).scrape()
    ]);
    let fixedResults = [];
    //Shitty fix I know
    results.forEach(result => result.forEach(result => fixedResults.filter(row => row.title === result.title)[0] ? "" : fixedResults.push(result)));
    return fixedResults;
});
exports.getResults = getResults;
