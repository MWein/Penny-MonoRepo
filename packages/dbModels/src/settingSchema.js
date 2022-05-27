"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.settingsModel = void 0;
var mongoose_1 = require("mongoose");
var SettingSchema = new mongoose_1.Schema({
    key: {
        type: String,
        required: true,
    },
    value: {
        type: mongoose_1.Schema.Types.Mixed,
        required: true,
    },
});
exports.settingsModel = (0, mongoose_1.model)('setting', SettingSchema);
