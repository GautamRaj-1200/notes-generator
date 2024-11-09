"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const PORT = 5500;
app.get('/', (req, res, next) => {
    res.send("<h1>Hello</h1>");
});
app.listen(PORT, () => {
    console.log("Server is running at port ", PORT);
});