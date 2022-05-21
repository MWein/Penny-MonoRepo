"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.positionSnapshotModel = void 0;
var mongoose_1 = require("mongoose");
var PositionSnapshotSchema = new mongoose_1.Schema({
    id: Number,
    symbol: String,
    cost_basis: Number,
    quantity: Number,
    date_acquired: String,
});
exports.positionSnapshotModel = (0, mongoose_1.model)('positionSnapshot', PositionSnapshotSchema);
