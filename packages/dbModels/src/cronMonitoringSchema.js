"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cronModel = void 0;
var mongoose_1 = require("mongoose");
var CronMonitoringSchema = new mongoose_1.Schema({
    date: {
        type: Date,
        required: true,
        default: Date.now,
    },
    cronName: {
        type: String,
        required: true,
    },
    success: {
        type: Boolean,
        required: true,
    },
    errorMessage: {
        type: String,
        required: false,
    }
});
exports.cronModel = (0, mongoose_1.model)('cron', CronMonitoringSchema);
