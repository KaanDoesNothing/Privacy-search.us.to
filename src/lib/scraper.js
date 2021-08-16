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
exports.Scraper = void 0;
const axios_1 = __importDefault(require("axios"));
const path_1 = __importDefault(require("path"));
class Scraper {
    constructor({ query }) {
        this.name = path_1.default.basename(__filename);
        this.query = query;
        this.results = [];
    }
    pushToResults(data) {
        this.results.push(Object.assign(Object.assign({}, data), { scraper: this.name }));
    }
    get({ url }) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield axios_1.default.post(url)).data;
        });
    }
}
exports.Scraper = Scraper;
