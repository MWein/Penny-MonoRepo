"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.incomeTargetModel = void 0;
var mongoose_1 = require("mongoose");
var IncomeTargetSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    scope: {
        type: String,
        enum: ['month', 'year', 'allTime'],
        required: true,
    },
    stackable: {
        type: Boolean,
        required: true,
    },
});
exports.incomeTargetModel = (0, mongoose_1.model)('incomeTarget', IncomeTargetSchema);
