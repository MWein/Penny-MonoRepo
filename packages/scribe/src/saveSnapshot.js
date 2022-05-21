"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveSnapshot = void 0;
var db_models_1 = require("@penny/db-models");
var spread_outcome_1 = require("@penny/spread-outcome");
var option_symbol_parser_1 = require("@penny/option-symbol-parser");
var tradier = require("@penny/tradier");
var roundedNumber = function (num) { return Number(num.toFixed(0)); };
var getICPositions = function (optionPositions) { return __awaiter(void 0, void 0, void 0, function () {
    var optionTickers, prices, spreads;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                optionTickers = optionPositions.map(function (x) { return x.symbol; });
                return [4 /*yield*/, tradier.getPrices(optionTickers)];
            case 1:
                prices = _a.sent();
                spreads = (0, spread_outcome_1.getSpreadOutcomes)(optionPositions);
                return [2 /*return*/, spreads.map(function (spread) {
                        var positions = spread.positions;
                        var gainLoss = positions.reduce(function (acc, pos) {
                            var _a;
                            var price = (_a = prices.find(function (x) { return x.symbol === pos.symbol; })) === null || _a === void 0 ? void 0 : _a.price;
                            if (!price) {
                                return acc;
                            }
                            var quantity = Math.abs(pos.quantity);
                            // Short position
                            if (pos.quantity < 0) {
                                var salePrice = Math.abs(pos.cost_basis);
                                var currentBuyBackPrice = Number((price * 100 * quantity).toFixed(0));
                                var gainLoss_1 = salePrice - currentBuyBackPrice;
                                return acc + gainLoss_1;
                            }
                            // Long position
                            //if (pos.quantity > 0) {
                            var buyPrice = pos.cost_basis;
                            var currentSalePrice = Number((price * 100 * quantity).toFixed(0));
                            var gainLoss = currentSalePrice - buyPrice;
                            return acc + gainLoss;
                            //}
                        }, 0);
                        var hasCall = positions.some(function (pos) { return (0, option_symbol_parser_1.getType)(pos.symbol) === 'call'; });
                        var hasPut = positions.some(function (pos) { return (0, option_symbol_parser_1.getType)(pos.symbol) === 'put'; });
                        return {
                            ticker: spread.ticker,
                            side: spread.side,
                            gainLoss: roundedNumber(gainLoss),
                            maxLoss: roundedNumber(spread.maxLoss),
                            maxGain: roundedNumber(spread.maxGain),
                            hasPut: hasPut,
                            hasCall: hasCall,
                        };
                    })];
        }
    });
}); };
// *********** Copied and modified from Penny-Data ***********
var saveSnapshot = function () { return __awaiter(void 0, void 0, void 0, function () {
    var positions, ICPositions, newSnapshot;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db_models_1.positionSnapshotModel.find()];
            case 1:
                positions = _a.sent();
                if (positions.length === 0) {
                    return [2 /*return*/];
                }
                return [4 /*yield*/, getICPositions(positions)];
            case 2:
                ICPositions = _a.sent();
                newSnapshot = new db_models_1.ICSnapshotModel({
                    positions: ICPositions,
                });
                return [4 /*yield*/, newSnapshot.save()];
            case 3:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.saveSnapshot = saveSnapshot;
