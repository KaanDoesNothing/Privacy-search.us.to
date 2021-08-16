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
exports.start = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
exports.app = express_1.default();
exports.app.set("view engine", "pug");
exports.app.set("views", path_1.default.join(__dirname, "/website/views"));
exports.app.use("/static", express_1.default.static(path_1.default.join(__dirname, "/website/public")));
const start = (port = 7009) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield exports.app.listen(port);
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }
});
exports.start = start;
