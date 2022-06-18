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
exports.checkDiffs = exports.checkDayTrading = exports.checkThemTest = void 0;
var db_models_1 = require("@penny/db-models");
var tradier = require("@penny/tradier");
var checkThemTest = function () { return __awaiter(void 0, void 0, void 0, function () {
    var date, strategy, matchingOptions, filter, matching, filter, matching, tradierPrices, currentPrices, optionsWithProfit;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                date = '2022-06-06';
                strategy = 'long';
                matchingOptions = [];
                if (!['both', 'short'].includes(strategy)) return [3 /*break*/, 2];
                filter = {
                    perc: { $gte: 5 },
                    price: { $gte: 10 },
                    type: 'put',
                    premium: { $lte: 1000 },
                    date: date,
                };
                return [4 /*yield*/, db_models_1.RNSModel.find(filter).sort({ perc: -1 }).lean()];
            case 1:
                matching = _a.sent();
                matchingOptions.push.apply(matchingOptions, matching);
                _a.label = 2;
            case 2:
                if (!['both', 'long'].includes(strategy)) return [3 /*break*/, 4];
                filter = {
                    perc: { $lte: 1 },
                    price: { $gte: 10 },
                    type: 'put',
                    premium: { $lte: 1000, $gte: 20 },
                    date: date,
                };
                return [4 /*yield*/, db_models_1.RNSModel.find(filter).sort({ perc: 1 }).lean()];
            case 3:
                matching = _a.sent();
                matchingOptions.push.apply(matchingOptions, matching);
                _a.label = 4;
            case 4: return [4 /*yield*/, tradier.getPrices(matchingOptions.map(function (x) { return x.symbol; }))];
            case 5:
                tradierPrices = _a.sent();
                console.log(tradierPrices);
                currentPrices = tradierPrices.map(function (x) { return (__assign(__assign({}, x), { price: Number((x.price * 100).toFixed(0)) })); });
                optionsWithProfit = matchingOptions.map(function (opt) {
                    var _a;
                    var currentPrice = ((_a = currentPrices.find(function (x) { return x.symbol === opt.symbol; })) === null || _a === void 0 ? void 0 : _a.price) || opt.premium;
                    var profit = currentPrice - opt.premium;
                    return __assign(__assign({}, opt), { currentPrice: currentPrice, profit: profit });
                });
                console.log(optionsWithProfit);
                console.log("Premium $".concat(optionsWithProfit.reduce(function (acc, x) { return acc + x.premium; }, 0)));
                console.log("Profit: $".concat(optionsWithProfit.reduce(function (acc, x) { return acc + x.profit; }, 0)));
                return [2 /*return*/];
        }
    });
}); };
exports.checkThemTest = checkThemTest;
var checkDayTrading = function () { return __awaiter(void 0, void 0, void 0, function () {
    var dates, _loop_1, x;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                dates = ['2022-05-23', '2022-05-24', '2022-05-25', '2022-05-26', '2022-05-27', '2022-05-31', '2022-06-01', '2022-06-02', '2022-06-03', '2022-06-06', '2022-06-07', '2022-06-08'];
                _loop_1 = function (x) {
                    var todayGainLoss, todayPremium, date, filter, matching, y, current, priceHistory, currentDatePriceHistory, lastEntry, gainLoss;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                todayGainLoss = 0;
                                todayPremium = 0;
                                date = dates[x];
                                filter = {
                                    perc: { $lte: 1 },
                                    price: { $gte: 10 },
                                    type: 'call',
                                    premium: { $lte: 100, $gte: 20 },
                                    date: date,
                                };
                                return [4 /*yield*/, db_models_1.RNSModel.find(filter).sort({ perc: 1 }).lean()
                                    // Get EOD prices and entry prices
                                ];
                            case 1:
                                matching = _b.sent();
                                y = 0;
                                _b.label = 2;
                            case 2:
                                if (!(y < matching.length)) return [3 /*break*/, 5];
                                current = matching[y];
                                return [4 /*yield*/, db_models_1.PriceHistoryModel.find({ symbol: current.symbol }).lean()];
                            case 3:
                                priceHistory = _b.sent();
                                currentDatePriceHistory = priceHistory.filter(function (x) { return x.date.toISOString().split('T')[0] === date; });
                                lastEntry = currentDatePriceHistory[currentDatePriceHistory.length - 1];
                                gainLoss = lastEntry.price - current.premium;
                                todayPremium += current.premium;
                                todayGainLoss += gainLoss;
                                _b.label = 4;
                            case 4:
                                y++;
                                return [3 /*break*/, 2];
                            case 5:
                                console.log(date, todayPremium, todayGainLoss);
                                return [2 /*return*/];
                        }
                    });
                };
                x = 0;
                _a.label = 1;
            case 1:
                if (!(x < dates.length)) return [3 /*break*/, 4];
                return [5 /*yield**/, _loop_1(x)];
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
exports.checkDayTrading = checkDayTrading;
var checkDiffs = function () { return __awaiter(void 0, void 0, void 0, function () {
    var dates, x, todayGainLoss, todayPremium, date, filter, matching;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                dates = ['2022-05-23', '2022-05-24', '2022-05-25', '2022-05-26', '2022-05-27', '2022-05-31', '2022-06-01'];
                x = 0;
                _a.label = 1;
            case 1:
                if (!(x < dates.length)) return [3 /*break*/, 4];
                todayGainLoss = 0;
                todayPremium = 0;
                date = dates[x];
                filter = {
                    perc: { $lte: 0.6 },
                    price: { $gte: 10 },
                    //type: 'call',
                    premium: { $lte: 1000, $gte: 20 },
                    date: date,
                };
                return [4 /*yield*/, db_models_1.RNSModel.find(filter).sort({ perc: 1 }).lean()
                    // Get EOD prices and entry prices
                ];
            case 2:
                matching = _a.sent();
                // Get EOD prices and entry prices
                console.log(date);
                matching.map(function (match) { return console.log(match.underlying, match.diff); });
                console.log('\n');
                _a.label = 3;
            case 3:
                x++;
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.checkDiffs = checkDiffs;
