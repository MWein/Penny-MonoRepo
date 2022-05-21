"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ICSnapshotModel = void 0;
var mongoose_1 = require("mongoose");
var ICPosition = new mongoose_1.Schema({
    ticker: String,
    side: {
        type: String,
        enum: ['long', 'short', 'indeterminate'],
    },
    gainLoss: Number,
    maxLoss: Number,
    maxGain: Number,
    hasPut: Boolean,
    hasCall: Boolean,
});
var ICSnapshotSchema = new mongoose_1.Schema({
    date: {
        type: Date,
        required: true,
        default: Date.now,
    },
    positions: [ICPosition]
});
exports.ICSnapshotModel = (0, mongoose_1.model)('ICSnapshot', ICSnapshotSchema);
