"use strict";
// Check the price history for the current cycle throughout the week
// Used to see if going long and selling same or next day would work
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
require('dotenv').config({ path: '../../../.env' });
var tradier = require("@penny/tradier");
var getNextDates = function (startDate) {
    var dates = [];
    var today = new Date().toISOString().split('T')[0];
    var current = startDate;
    dates.push(current);
    while (current !== today) {
        var next = new Date(current);
        next.setDate(next.getDate() + 1);
        // Handle weird bug where date increment results in the same date
        if (next.toISOString().split('T')[0] === current) {
            next.setDate(next.getDate() + 1);
        }
        current = next.toISOString().split('T')[0];
        dates.push(current);
    }
    return dates;
};
var checkPriceHistory = function () { return __awaiter(void 0, void 0, void 0, function () {
    var keyToUse, positions, shortCostBasis, earliestAquiredDate, datesToCalc, positionsWithPriceHistory, today, x, position, start, quotes;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                keyToUse = 'open';
                return [4 /*yield*/, tradier.getPositions()];
            case 1:
                positions = _a.sent();
                shortCostBasis = positions.reduce(function (acc, pos) {
                    if (pos.quantity > 0) {
                        return acc + pos.cost_basis;
                    }
                    return acc;
                }, 0);
                earliestAquiredDate = positions.reduce(function (acc, pos) {
                    var accDate = new Date(acc);
                    var curDate = new Date(pos.date_acquired);
                    return accDate > curDate ? curDate.toISOString().split('T')[0] : acc;
                }, positions[0].date_acquired.split('T')[0]);
                datesToCalc = getNextDates(earliestAquiredDate);
                positionsWithPriceHistory = [];
                today = new Date().toISOString().split('T')[0];
                x = 0;
                _a.label = 2;
            case 2:
                if (!(x < positions.length)) return [3 /*break*/, 5];
                position = positions[x];
                console.log('Fetching history for', position.symbol);
                start = position.date_acquired.split('T')[0];
                return [4 /*yield*/, tradier.getHistoricalQuote(position.symbol, start, today)];
            case 3:
                quotes = _a.sent();
                positionsWithPriceHistory.push(__assign(__assign({}, position), { quotes: quotes }));
                _a.label = 4;
            case 4:
                x++;
                return [3 /*break*/, 2];
            case 5:
                datesToCalc.map(function (date) {
                    var profitForDay = positionsWithPriceHistory.reduce(function (acc, pos) {
                        var quote = pos.quotes.find(function (x) { return x.date === date; });
                        if (!quote) {
                            return acc;
                        }
                        // Short position
                        if (pos.quantity < 0) {
                            var salePrice = Math.abs(pos.cost_basis);
                            var currentBuyBackPrice = Number((quote[keyToUse] * 100).toFixed(0));
                            var gainLoss = salePrice - currentBuyBackPrice;
                            return acc + gainLoss;
                            //return acc
                        }
                        // Long position
                        if (pos.quantity > 0) {
                            var buyPrice = pos.cost_basis;
                            var currentSalePrice = Number((quote[keyToUse] * 100).toFixed(0));
                            var gainLoss = currentSalePrice - buyPrice;
                            return acc + gainLoss;
                            //return acc
                        }
                    }, 0);
                    console.log(date, profitForDay);
                });
                return [2 /*return*/];
        }
    });
}); };
checkPriceHistory();
