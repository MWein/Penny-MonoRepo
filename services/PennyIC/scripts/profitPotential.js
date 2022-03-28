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
require('dotenv').config({ path: '../../../.env' });
var tradier = require("@penny/tradier");
var lodash_1 = require("lodash");
var option_symbol_parser_1 = require("@penny/option-symbol-parser");
var getSpreadStanding = function (spread, prices) {
    var _a;
    var type = (0, option_symbol_parser_1.getType)(spread.short);
    var symbol = (0, option_symbol_parser_1.getUnderlying)(spread.short);
    var currentPrice = (_a = prices.find(function (x) { return x.symbol === symbol; })) === null || _a === void 0 ? void 0 : _a.price;
    if (!currentPrice) {
        return null;
    }
    var targetPriceSortFunc = type === 'call' ? function (a, b) { return a - b; } : function (a, b) { return b - a; };
    var targetPrice = Object.values(spread).map(function (x) { return (0, option_symbol_parser_1.getStrike)(x); }).sort(targetPriceSortFunc)[0];
    var winning = type === 'call' ? currentPrice < targetPrice : currentPrice > targetPrice;
    return {
        symbol: symbol,
        type: type,
        spread: spread,
        currentPrice: currentPrice,
        targetPrice: targetPrice,
        winning: winning,
    };
};
var printResult = function (title, numberWinning, numberLosing, total) {
    console.log("\n------ ".concat(title, " ------"));
    console.log('Winning', numberWinning, "".concat(((numberWinning / total) * 100).toFixed(2), "%"));
    console.log('Losing', numberLosing, "".concat(((numberLosing / total) * 100).toFixed(2), "%"));
    console.log('-------------------\n');
};
var spreadStandings = function (positions) { return __awaiter(void 0, void 0, void 0, function () {
    var spreads, allTickers, currentPrices, standings, total, numberWinning, numberLosing, putStandings, numberPutsWinning, numberPutsLosing, callStandings, numberCallsWinning, numberCallsLosing;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                spreads = tradier.groupOptionsIntoSpreads(positions);
                allTickers = (0, lodash_1.uniq)(__spreadArray(__spreadArray([], spreads.put.spreads, true), spreads.call.spreads, true).map(function (x) { return (0, option_symbol_parser_1.getUnderlying)(x.short); }));
                return [4 /*yield*/, tradier.getPrices(allTickers)];
            case 1:
                currentPrices = _a.sent();
                standings = __spreadArray(__spreadArray([], spreads.put.spreads, true), spreads.call.spreads, true).map(function (x) { return getSpreadStanding(x, currentPrices); });
                total = standings.length;
                numberWinning = standings.filter(function (x) { return x.winning; }).length;
                numberLosing = standings.filter(function (x) { return !x.winning; }).length;
                putStandings = standings.filter(function (x) { return x.type === 'put'; });
                numberPutsWinning = putStandings.filter(function (x) { return x.winning; }).length;
                numberPutsLosing = putStandings.filter(function (x) { return !x.winning; }).length;
                callStandings = standings.filter(function (x) { return x.type === 'call'; });
                numberCallsWinning = callStandings.filter(function (x) { return x.winning; }).length;
                numberCallsLosing = callStandings.filter(function (x) { return !x.winning; }).length;
                printResult('Total', numberWinning, numberLosing, total);
                printResult('Puts', numberPutsWinning, numberPutsLosing, putStandings.length);
                printResult('Calls', numberCallsWinning, numberCallsLosing, callStandings.length);
                return [2 /*return*/];
        }
    });
}); };
var getStandings = function () { return __awaiter(void 0, void 0, void 0, function () {
    var positions, optionTickers, prices, totalCostBasis, currentGainLoss, tickers;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, tradier.getPositions()];
            case 1:
                positions = _a.sent();
                optionTickers = positions.map(function (x) { return x.symbol; });
                return [4 /*yield*/, tradier.getPrices(optionTickers)];
            case 2:
                prices = _a.sent();
                return [4 /*yield*/, spreadStandings(positions)];
            case 3:
                _a.sent();
                totalCostBasis = positions.reduce(function (acc, x) { return acc + x.cost_basis; }, 0) * -1;
                currentGainLoss = positions.reduce(function (acc, pos) {
                    var _a;
                    var price = (_a = prices.find(function (x) { return x.symbol === pos.symbol; })) === null || _a === void 0 ? void 0 : _a.price;
                    if (!price) {
                        return acc;
                    }
                    // Short position
                    if (pos.quantity < 0) {
                        var salePrice = Math.abs(pos.cost_basis);
                        var currentBuyBackPrice = Number((price * 100).toFixed(0));
                        var gainLoss = salePrice - currentBuyBackPrice;
                        return acc + gainLoss;
                        //return acc
                    }
                    // Long position
                    if (pos.quantity > 0) {
                        var buyPrice = pos.cost_basis;
                        var currentSalePrice = Number((price * 100).toFixed(0));
                        var gainLoss = currentSalePrice - buyPrice;
                        return acc + gainLoss;
                        //return acc
                    }
                    return 0;
                }, 0);
                console.log("Total Profit Potential $".concat(totalCostBasis, "\n"));
                console.log("Total Profit if Closed Now $".concat(currentGainLoss, "\n"));
                tickers = (0, lodash_1.uniq)(positions.map(function (x) { return (0, option_symbol_parser_1.getUnderlying)(x.symbol); }));
                tickers.map(function (ticker) {
                    var positionsWithTicker = positions.filter(function (x) { return (0, option_symbol_parser_1.getUnderlying)(x.symbol) === ticker; });
                    var costBasis = positionsWithTicker.reduce(function (acc, x) { return acc + x.cost_basis; }, 0) * -1;
                    console.log(ticker, costBasis, 100 - costBasis);
                });
                return [2 /*return*/];
        }
    });
}); };
getStandings();
