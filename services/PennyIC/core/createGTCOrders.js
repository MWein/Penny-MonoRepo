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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGTCOrders = void 0;
var tradier = require("@penny/tradier");
var option_symbol_parser_1 = require("@penny/option-symbol-parser");
var createGTCOrders = function () { return __awaiter(void 0, void 0, void 0, function () {
    var today, positions, optionPositions, spreadResults, allSpreads, orders, openOrders, _loop_1, x;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                today = new Date().toISOString().split('T')[0];
                return [4 /*yield*/, tradier.getPositions()];
            case 1:
                positions = _a.sent();
                optionPositions = positions.filter(function (x) { return (0, option_symbol_parser_1.isOption)(x.symbol) && x.date_acquired.split('T')[0] !== today; });
                spreadResults = tradier.groupOptionsIntoSpreads(optionPositions);
                allSpreads = __spreadArray(__spreadArray([], spreadResults.call.spreads, true), spreadResults.put.spreads, true);
                return [4 /*yield*/, tradier.getOrders()];
            case 2:
                orders = _a.sent();
                openOrders = orders.filter(function (x) { return ['open', 'pending'].includes(x.status); });
                _loop_1 = function (x) {
                    var spread, optTickers, hasExistingOrders, longPosition, shortPosition, overallCostBasis, target, legs;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                spread = allSpreads[x];
                                optTickers = [spread.long, spread.short];
                                hasExistingOrders = openOrders.some(function (x) { return x === null || x === void 0 ? void 0 : x.leg.some(function (x) { return optTickers.includes(x.option_symbol); }); });
                                if (!!hasExistingOrders) return [3 /*break*/, 2];
                                longPosition = positions.find(function (x) { return x.symbol === spread.long; });
                                shortPosition = positions.find(function (x) { return x.symbol === spread.short; });
                                overallCostBasis = (shortPosition.cost_basis / shortPosition.quantity) - (longPosition.cost_basis / longPosition.quantity);
                                target = Number((overallCostBasis / 2).toFixed(0));
                                legs = [
                                    {
                                        symbol: spread.long,
                                        side: 'sell_to_close',
                                        quantity: 1
                                    },
                                    {
                                        symbol: spread.short,
                                        side: 'buy_to_close',
                                        quantity: 1
                                    },
                                ];
                                return [4 /*yield*/, tradier.multilegOptionOrder((0, option_symbol_parser_1.getUnderlying)(spread.long), 'debit', legs, target)];
                            case 1:
                                _b.sent();
                                _b.label = 2;
                            case 2: return [2 /*return*/];
                        }
                    });
                };
                x = 0;
                _a.label = 3;
            case 3:
                if (!(x < allSpreads.length)) return [3 /*break*/, 6];
                return [5 /*yield**/, _loop_1(x)];
            case 4:
                _a.sent();
                _a.label = 5;
            case 5:
                x++;
                return [3 /*break*/, 3];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.createGTCOrders = createGTCOrders;
