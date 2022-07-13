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
exports.trendTest = void 0;
var tradier = require("@penny/tradier");
var db_models_1 = require("@penny/db-models");
var lodash_1 = require("lodash");
var testForDate = function (date) { return __awaiter(void 0, void 0, void 0, function () {
    var filter, calls, callsToCheck, _loop_1, x, selectedResults, _loop_2, x, winners, losers, totalProfit, totalPremium;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                filter = {
                    perc: { $lte: 1 },
                    price: { $gte: 10 },
                    type: 'put',
                    premium: { $lte: 500, $gte: 20 },
                    date: date,
                };
                return [4 /*yield*/, db_models_1.RNSModel.find(filter).sort({ perc: 1 }).lean()];
            case 1:
                calls = _a.sent();
                callsToCheck = [];
                _loop_1 = function (x) {
                    var call, history, previous2Days, priceHistory, isUptrend;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                call = calls[x];
                                return [4 /*yield*/, tradier.getHistory(call.underlying, '2022-02-01', call.date)];
                            case 1:
                                history = _b.sent();
                                previous2Days = history.slice(-3).slice(0, 2);
                                priceHistory = previous2Days.reduce(function (acc, timeSeries) { return __spreadArray(__spreadArray([], acc, true), [timeSeries.open, timeSeries.close], false); }, []);
                                isUptrend = priceHistory.reduce(function (acc, num, index) {
                                    if (index === 0) {
                                        return acc;
                                    }
                                    return priceHistory[index - 1] < num ? false : acc;
                                }, true);
                                if (isUptrend) {
                                    callsToCheck.push(call);
                                }
                                return [2 /*return*/];
                        }
                    });
                };
                x = 0;
                _a.label = 2;
            case 2:
                if (!(x < calls.length)) return [3 /*break*/, 5];
                return [5 /*yield**/, _loop_1(x)];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4:
                x++;
                return [3 /*break*/, 2];
            case 5:
                selectedResults = [];
                _loop_2 = function (x) {
                    var call, symbol, priceHistory, dateObj, nextDate, nextDateStr, dayPriceHistory, lastPrice;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                call = callsToCheck[x];
                                symbol = call.symbol;
                                return [4 /*yield*/, db_models_1.PriceHistoryModel.find({ symbol: symbol }).lean()];
                            case 1:
                                priceHistory = _c.sent();
                                dateObj = new Date(date);
                                nextDate = new Date(date);
                                if (dateObj.getDay() === 4) {
                                    nextDate.setDate(nextDate.getDate() + 3);
                                }
                                else {
                                    nextDate.setDate(nextDate.getDate() + 1);
                                }
                                nextDateStr = nextDate.toISOString().split('T')[0];
                                dayPriceHistory = priceHistory.filter(function (x) { return x.date.toISOString().split('T')[0] === nextDateStr; });
                                if (dayPriceHistory.length > 0) {
                                    lastPrice = dayPriceHistory[0];
                                    selectedResults.push({
                                        symbol: symbol,
                                        premium: call.premium,
                                        endOfDay: lastPrice.price,
                                        profit: lastPrice.price - call.premium,
                                        win: lastPrice.price > call.premium
                                    });
                                }
                                return [2 /*return*/];
                        }
                    });
                };
                x = 0;
                _a.label = 6;
            case 6:
                if (!(x < callsToCheck.length)) return [3 /*break*/, 9];
                return [5 /*yield**/, _loop_2(x)];
            case 7:
                _a.sent();
                _a.label = 8;
            case 8:
                x++;
                return [3 /*break*/, 6];
            case 9:
                winners = selectedResults.filter(function (x) { return x.win; }).length;
                losers = selectedResults.filter(function (x) { return !x.win; }).length;
                totalProfit = selectedResults.reduce(function (acc, x) { return acc + x.profit; }, 0);
                totalPremium = selectedResults.reduce(function (acc, x) { return acc + x.premium; }, 0);
                console.log("".concat(date, "\t\t").concat(winners, "\t\t").concat(losers, "\t\t").concat(totalPremium, "\t\t$").concat(totalProfit));
                return [2 /*return*/];
        }
    });
}); };
var trendTest = function () { return __awaiter(void 0, void 0, void 0, function () {
    var allDates, dates, skipDates, checkDates, x;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db_models_1.RNSModel.find({}, 'date').lean()];
            case 1:
                allDates = _a.sent();
                dates = (0, lodash_1.uniq)(allDates.map(function (x) { return x.date; })).reverse();
                skipDates = [] //[ '2022-06-22', '2022-06-21', '2022-06-20', '2022-06-17', '2022-06-16', '2022-06-15', '2022-06-14', '2022-06-13', '2022-06-10', '2022-06-09', '2022-06-08', '2022-06-07', '2022-06-06' ]
                ;
                checkDates = dates.filter(function (x) { return !skipDates.includes(x); });
                x = 0;
                _a.label = 2;
            case 2:
                if (!(x < checkDates.length)) return [3 /*break*/, 5];
                return [4 /*yield*/, testForDate(checkDates[x])];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4:
                x++;
                return [3 /*break*/, 2];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.trendTest = trendTest;
