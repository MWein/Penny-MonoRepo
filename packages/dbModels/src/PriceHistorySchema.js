"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PriceHistoryModel = void 0;
var mongoose_1 = require("mongoose");
var PriceHistorySchema = new mongoose_1.Schema({
    symbol: String,
    price: Number,
    date: Date,
});
exports.PriceHistoryModel = (0, mongoose_1.model)('rnsPriceHistory', PriceHistorySchema);
