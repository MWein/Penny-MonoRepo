"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.purchaseGoalModel = void 0;
var mongoose_1 = require("mongoose");
var PurchaseGoalSchema = new mongoose_1.Schema({
    symbol: {
        type: String,
        required: true,
    },
    enabled: {
        type: Boolean,
        required: true,
        default: true,
    },
    priority: {
        type: Number,
        required: true,
        default: 0, // Higher the number, higher the priority
    },
    goal: {
        type: Number,
        required: true,
    },
    fulfilled: {
        type: Number,
        required: true,
        default: 0,
    }
});
exports.purchaseGoalModel = (0, mongoose_1.model)('purchaseGoal', PurchaseGoalSchema);
