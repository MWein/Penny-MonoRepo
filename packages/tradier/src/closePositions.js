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
exports.closePositionsIndividual = exports.closePositions = void 0;
var getOrders_1 = require("./getOrders");
var sendOrder_1 = require("./sendOrder");
var option_symbol_parser_1 = require("@penny/option-symbol-parser");
var lodash_1 = require("lodash");
var sleepUtil = require("@penny/sleep");
var closePositions = function (positions) { return __awaiter(void 0, void 0, void 0, function () {
    var optionPositions, orders, openOrders, expiringSymbols, ordersWithExpiringPositions, underlyingSymbols, _loop_1, x;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (positions.length === 0) {
                    return [2 /*return*/];
                }
                optionPositions = positions.filter(function (pos) { return (0, option_symbol_parser_1.isOption)(pos.symbol); });
                return [4 /*yield*/, (0, getOrders_1.getOrders)()];
            case 1:
                orders = _a.sent();
                openOrders = orders.filter(function (ord) { return ord.status === 'open' && ord.class === 'multileg'; });
                expiringSymbols = optionPositions.map(function (pos) { return pos.symbol; });
                ordersWithExpiringPositions = openOrders.filter(function (ord) {
                    var symbolKeys = Object.keys(ord).filter(function (key) { return key.includes('option_symbol['); });
                    var symbols = symbolKeys.map(function (key) { return ord[key]; });
                    return symbols.some(function (symbol) { return expiringSymbols.includes(symbol); });
                }).map(function (ord) { return ord.id; });
                if (!(ordersWithExpiringPositions.length > 0)) return [3 /*break*/, 3];
                return [4 /*yield*/, (0, sendOrder_1.cancelOrders)(ordersWithExpiringPositions)];
            case 2:
                _a.sent();
                sleepUtil.sleep(10);
                _a.label = 3;
            case 3:
                underlyingSymbols = (0, lodash_1.uniq)(optionPositions.map(function (pos) { return (0, option_symbol_parser_1.getUnderlying)(pos.symbol); }));
                _loop_1 = function (x) {
                    var underlying, positionsWithUnderlying, legs;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                underlying = underlyingSymbols[x];
                                positionsWithUnderlying = optionPositions.filter(function (pos) { return (0, option_symbol_parser_1.getUnderlying)(pos.symbol) === underlying; });
                                legs = positionsWithUnderlying.map(function (pos) {
                                    var side = pos.quantity > 0 ? 'sell_to_close' : 'buy_to_close';
                                    return {
                                        symbol: pos.symbol,
                                        side: side,
                                        quantity: 1
                                    };
                                });
                                return [4 /*yield*/, (0, sendOrder_1.multilegOptionOrder)(underlying, 'market', legs)];
                            case 1:
                                _b.sent();
                                return [2 /*return*/];
                        }
                    });
                };
                x = 0;
                _a.label = 4;
            case 4:
                if (!(x < underlyingSymbols.length)) return [3 /*break*/, 7];
                return [5 /*yield**/, _loop_1(x)];
            case 5:
                _a.sent();
                _a.label = 6;
            case 6:
                x++;
                return [3 /*break*/, 4];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.closePositions = closePositions;
var closePositionsIndividual = function (positions) { return __awaiter(void 0, void 0, void 0, function () {
    var optionPositions, chunks, x, chunk_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                optionPositions = positions.filter(function (pos) { return (0, option_symbol_parser_1.isOption)(pos.symbol); });
                if (optionPositions.length === 0) {
                    return [2 /*return*/];
                }
                chunks = (0, lodash_1.chunk)(optionPositions, 10);
                x = 0;
                _a.label = 1;
            case 1:
                if (!(x < chunks.length)) return [3 /*break*/, 4];
                chunk_1 = chunks[x];
                return [4 /*yield*/, Promise.all(chunk_1.map(function (pos) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!(pos.quantity > 0)) return [3 /*break*/, 2];
                                    return [4 /*yield*/, (0, sendOrder_1.sellToClose)((0, option_symbol_parser_1.getUnderlying)(pos.symbol), pos.symbol, pos.quantity)];
                                case 1:
                                    _a.sent();
                                    return [3 /*break*/, 4];
                                case 2: return [4 /*yield*/, (0, sendOrder_1.buyToCloseMarket)((0, option_symbol_parser_1.getUnderlying)(pos.symbol), pos.symbol, pos.quantity * -1)];
                                case 3:
                                    _a.sent();
                                    _a.label = 4;
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); }))];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3:
                x++;
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.closePositionsIndividual = closePositionsIndividual;
