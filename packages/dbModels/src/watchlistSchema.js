"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.watchlistModel = void 0;
var mongoose_1 = require("mongoose");
var WatchlistSchema = new mongoose_1.Schema({
    symbol: {
        type: String,
        required: true,
    },
    maxPositions: {
        type: Number,
        required: true,
        default: 0,
    },
    volatility: {
        type: Number,
        required: false,
    },
    call: {
        enabled: {
            type: Boolean,
            required: true,
            default: false,
        },
        targetDelta: {
            type: Number,
            required: true,
            default: 0.3,
            min: [0.1],
            max: [1]
        },
        minStrikeMode: {
            type: String,
            required: true,
            default: 'auto',
            enum: ['auto', 'custom', 'off']
        },
        minStrike: {
            type: Number,
            required: false,
        }
    },
    put: {
        enabled: {
            type: Boolean,
            required: true,
            default: false,
        },
        targetDelta: {
            type: Number,
            required: true,
            default: 0.3,
            min: [0.1],
            max: [1]
        },
    }
});
exports.watchlistModel = (0, mongoose_1.model)('watchlist', WatchlistSchema);
