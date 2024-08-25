"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors = require('cors');
const path = require('path');
const app = (0, express_1.default)();
const address = "0.0.0.0:3000";
app.use(body_parser_1.default.json());
app.use(cors());
app.get('/', function (req, res) {
    res.send('Hello App!');
});
app.listen(3000, function () {
    console.log(`starting app on: ${address}`);
});
