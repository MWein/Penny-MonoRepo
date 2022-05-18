"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RNSModel = void 0;
var mongoose_1 = require("mongoose");
var RNSSchema = new mongoose_1.Schema({
    symbol: String,
    underlying: String,
    type: String,
    strike: Number,
    premium: Number,
    expiration: String,
    delta: Number,
    price: Number,
    perc: Number,
    diff: Number,
    date: {
        type: String,
        default: new Date().toISOString().split('T')[0]
    },
});
exports.RNSModel = (0, mongoose_1.model)('rnsTest', RNSSchema);
