"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.showcaseRNSController = void 0;
var tradier = require("@penny/tradier");
var cache_1 = require("../utils/cache");
var option_symbol_parser_1 = require("@penny/option-symbol-parser");
var getSunday = function (d) {
    d = new Date(d);
    var day = d.getDay(), diff = d.getDate() - day + (day == 0 ? -6 : 0);
    return new Date(d.setDate(diff));
};
var retrieveGainLoss = function (start) { return __awaiter(void 0, void 0, void 0, function () {
    var gainLossResult, gainLoss;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, tradier.getGainLoss(1, 20000, start)];
            case 1:
                gainLossResult = _a.sent();
                gainLoss = Number(gainLossResult.reduce(function (acc, gl) { return acc + gl.gain_loss; }, 0).toFixed(2));
                return [2 /*return*/, gainLoss];
        }
    });
}); };
var retrieveEquity = function () { return __awaiter(void 0, void 0, void 0, function () {
    var balances;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, tradier.getBalances()];
            case 1:
                balances = _a.sent();
                return [2 /*return*/, balances.total_equity];
        }
    });
}); };
var getPositionsWithGainLoss = function () { return __awaiter(void 0, void 0, void 0, function () {
    var positions, symbols, prices, correctedPrices;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, tradier.getPositions()];
            case 1:
                positions = _a.sent();
                symbols = positions.map(function (x) { return x.symbol; });
                return [4 /*yield*/, tradier.getPrices(symbols)];
            case 2:
                prices = _a.sent();
                correctedPrices = prices.map(function (x) { return (__assign(__assign({}, x), { price: (0, option_symbol_parser_1.isOption)(x.symbol) ? Number((x.price * 100).toFixed(0)) : x.price })); });
                return [2 /*return*/, positions.map(function (pos) {
                        var _a, _b;
                        var price = (_b = (_a = correctedPrices.find(function (x) { return x.symbol === pos.symbol; })) === null || _a === void 0 ? void 0 : _a.price) !== null && _b !== void 0 ? _b : 0;
                        var priceAdjustedForPositions = price * pos.quantity;
                        var gainLoss = priceAdjustedForPositions - pos.cost_basis;
                        return __assign(__assign({}, pos), { gainLoss: gainLoss });
                    })];
        }
    });
}); };
var showcaseRNSController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var positions, equity, today, monthNum, firstOfYear, firstOfMonth, firstOfWeek, monthEarnings, yearEarnings, theft, realizedWeekEarnings, unrealizedWeekEarnings, weekEarnings;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, cache_1.useCache)('positions', getPositionsWithGainLoss, [], 840)];
            case 1:
                positions = _a.sent();
                return [4 /*yield*/, (0, cache_1.useCache)('equity', retrieveEquity, 0)];
            case 2:
                equity = _a.sent();
                today = new Date();
                monthNum = today.getUTCMonth() + 1;
                firstOfYear = "".concat(today.getFullYear(), "-01-01");
                firstOfMonth = "".concat(today.getFullYear(), "-").concat(monthNum < 10 ? "0".concat(monthNum) : monthNum, "-01");
                firstOfWeek = getSunday(today).toISOString().split('T')[0];
                return [4 /*yield*/, (0, cache_1.useCache)('monthEarnings', function () { return retrieveGainLoss(firstOfMonth); }, 0)];
            case 3:
                monthEarnings = _a.sent();
                return [4 /*yield*/, (0, cache_1.useCache)('yearEarnings', function () { return retrieveGainLoss(firstOfYear); }, 0)
                    // TODO Make service for this
                ];
            case 4:
                yearEarnings = _a.sent();
                theft = Math.max(0, yearEarnings * 0.22);
                return [4 /*yield*/, (0, cache_1.useCache)('realizedWeekEarnings', function () { return retrieveGainLoss(firstOfWeek); }, 0)];
            case 5:
                realizedWeekEarnings = _a.sent();
                unrealizedWeekEarnings = positions.reduce(function (acc, pos) { return acc + pos.gainLoss; }, 0);
                weekEarnings = unrealizedWeekEarnings + realizedWeekEarnings;
                res.json({
                    equity: equity,
                    weekEarnings: weekEarnings,
                    monthEarnings: monthEarnings,
                    yearEarnings: yearEarnings,
                    theft: theft,
                    lastYearTheft: 0,
                    positions: positions
                });
                return [2 /*return*/];
        }
    });
}); };
exports.showcaseRNSController = showcaseRNSController;
