"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logModel = void 0;
var mongoose_1 = require("mongoose");
var LogSchema = new mongoose_1.Schema({
    date: {
        type: Date,
        required: true,
        default: Date.now,
    },
    type: {
        type: String,
        required: true,
        enum: ['info', 'ping', 'error'],
        default: 'info',
    },
    message: {
        type: String,
        required: true,
    },
});
exports.logModel = (0, mongoose_1.model)('log', LogSchema);
