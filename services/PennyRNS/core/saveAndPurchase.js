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
exports.saveAndPurchase = void 0;
var tradier = require("@penny/tradier");
var getATMOptions_1 = require("./getATMOptions");
var evalAndPurchase_1 = require("./evalAndPurchase");
var db_models_1 = require("@penny/db-models");
var symbols = require('../core/weeklyTickers.json');
var evaluateOption = function (option) {
    return option.perc <= 1 && option.price >= 10 && option.premium >= 30 && option.premium < 1000;
};
// TODO Refactor
var determineTrend = function (prices) {
    var isUptrend = prices.reduce(function (acc, num, index) {
        if (index === 0) {
            return acc;
        }
        return prices[index - 1] > num ? false : acc;
    }, true);
    if (isUptrend) {
        return 'uptrend';
    }
    var isDowntrend = prices.reduce(function (acc, num, index) {
        if (index === 0) {
            return acc;
        }
        return prices[index - 1] < num ? false : acc;
    }, true);
    if (isDowntrend) {
        return 'downtrend';
    }
    return null;
};
var saveAndPurchase = function () { return __awaiter(void 0, void 0, void 0, function () {
    var open, date, x, symbol, prices, atmOpts, history, previous2Days, priceHistory, trend, putModel, callModel;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, tradier.isMarketOpen()];
            case 1:
                open = _a.sent();
                if (!open) {
                    return [2 /*return*/];
                }
                date = new Date().toISOString().split('T')[0];
                x = 0;
                _a.label = 2;
            case 2:
                if (!(x < symbols.length)) return [3 /*break*/, 12];
                symbol = symbols[x];
                console.log(symbol);
                return [4 /*yield*/, tradier.getPrices([symbol])];
            case 3:
                prices = _a.sent();
                return [4 /*yield*/, (0, getATMOptions_1.getATMOptions)(symbol, prices)];
            case 4:
                atmOpts = _a.sent();
                if (!atmOpts) return [3 /*break*/, 11];
                if (!(evaluateOption(atmOpts.put) || evaluateOption(atmOpts.call))) return [3 /*break*/, 9];
                return [4 /*yield*/, tradier.getHistory(symbol, '2022-06-10', date)];
            case 5:
                history = _a.sent();
                previous2Days = history.slice(-2).slice(0, 2);
                priceHistory = previous2Days.reduce(function (acc, timeSeries) { return __spreadArray(__spreadArray([], acc, true), [timeSeries.open, timeSeries.close], false); }, []);
                trend = determineTrend(priceHistory);
                if (!(trend === 'uptrend')) return [3 /*break*/, 7];
                return [4 /*yield*/, (0, evalAndPurchase_1.evalAndPurchase)(atmOpts.call)];
            case 6:
                _a.sent();
                return [3 /*break*/, 9];
            case 7:
                if (!(trend === 'downtrend')) return [3 /*break*/, 9];
                return [4 /*yield*/, (0, evalAndPurchase_1.evalAndPurchase)(atmOpts.put)];
            case 8:
                _a.sent();
                _a.label = 9;
            case 9:
                putModel = new db_models_1.RNSModel(atmOpts.put);
                callModel = new db_models_1.RNSModel(atmOpts.call);
                return [4 /*yield*/, Promise.all([
                        putModel.save(),
                        callModel.save(),
                    ])];
            case 10:
                _a.sent();
                _a.label = 11;
            case 11:
                x++;
                return [3 /*break*/, 2];
            case 12: return [2 /*return*/];
        }
    });
}); };
exports.saveAndPurchase = saveAndPurchase;
