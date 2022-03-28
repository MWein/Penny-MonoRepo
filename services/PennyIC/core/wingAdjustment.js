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
exports.wingAdjustment = exports.openNewWings = void 0;
var tradier = require("@penny/tradier");
var option_symbol_parser_1 = require("@penny/option-symbol-parser");
var lodash_1 = require("lodash");
var sellIronCondor = require("./sellIronCondor");
var logger = require("@penny/logger");
var closeSpreads_1 = require("../common/closeSpreads");
// Returns the distance between the short strike and the current price
var getDistanceFromPrice = function (spread, priceMap) {
    var price = priceMap[(0, option_symbol_parser_1.getUnderlying)(spread.short)];
    var shortStrike = (0, option_symbol_parser_1.getStrike)(spread.short);
    return (0, option_symbol_parser_1.getType)(spread.short) === 'call' ? shortStrike - price : price - shortStrike;
};
var openNewWings = function (closedSpreads) { return __awaiter(void 0, void 0, void 0, function () {
    var newWingsToOpen, x, _a, symbol, type, expiration, chain;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                newWingsToOpen = closedSpreads.map(function (spread) { return ({
                    type: (0, option_symbol_parser_1.getType)(spread.short),
                    symbol: (0, option_symbol_parser_1.getUnderlying)(spread.short),
                    expiration: (0, option_symbol_parser_1.getExpiration)(spread.short)
                }); });
                x = 0;
                _b.label = 1;
            case 1:
                if (!(x < newWingsToOpen.length)) return [3 /*break*/, 5];
                _a = newWingsToOpen[x], symbol = _a.symbol, type = _a.type, expiration = _a.expiration;
                return [4 /*yield*/, tradier.getOptionChain(symbol, expiration)];
            case 2:
                chain = _b.sent();
                return [4 /*yield*/, sellIronCondor.sellSpread(chain, symbol, type, 0.15, 1)];
            case 3:
                _b.sent();
                _b.label = 4;
            case 4:
                x++;
                return [3 /*break*/, 1];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.openNewWings = openNewWings;
var wingAdjustment = function () { return __awaiter(void 0, void 0, void 0, function () {
    var isOpen, today, positions, positionsNotOpenedToday, spreadGroupResults, allSpreads, spreadTickers, prices, priceMap, spreadsWithDist, spreadsToClose, spreadsNotExpiringToday;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, tradier.isMarketOpen()];
            case 1:
                isOpen = _a.sent();
                if (!isOpen) {
                    return [2 /*return*/];
                }
                today = new Date().toISOString().split('T')[0];
                return [4 /*yield*/, tradier.getPositions()
                    // Filter out ones opened today
                ];
            case 2:
                positions = _a.sent();
                positionsNotOpenedToday = positions.filter(function (pos) { return pos.date_acquired.split('T')[0] !== today; });
                spreadGroupResults = tradier.groupOptionsIntoSpreads(positionsNotOpenedToday);
                allSpreads = __spreadArray(__spreadArray([], spreadGroupResults.call.spreads, true), spreadGroupResults.put.spreads, true);
                spreadTickers = (0, lodash_1.uniq)(allSpreads.map(function (spread) { return (0, option_symbol_parser_1.getUnderlying)(spread.short); }));
                return [4 /*yield*/, tradier.getPrices(spreadTickers)];
            case 3:
                prices = _a.sent();
                priceMap = prices.reduce(function (acc, price) {
                    var _a;
                    return (__assign(__assign({}, acc), (_a = {}, _a[price.symbol] = price.price, _a)));
                }, {});
                spreadsWithDist = allSpreads
                    .map(function (spread) { return (__assign(__assign({}, spread), { dist: getDistanceFromPrice(spread, priceMap) })); });
                spreadsToClose = spreadsWithDist.filter(function (spread) { return spread.dist <= 0; });
                if (spreadsToClose.length > 0) {
                    logger.log({
                        type: 'info',
                        message: 'WING ADJUSTMENT HAPPENED'
                    });
                }
                return [4 /*yield*/, (0, closeSpreads_1.closeSpreads)(spreadsToClose)
                    // Filter out ones that expire today
                ];
            case 4:
                _a.sent();
                spreadsNotExpiringToday = spreadsToClose.filter(function (spread) { return (0, option_symbol_parser_1.getExpiration)(spread.short) !== today; });
                return [4 /*yield*/, (0, exports.openNewWings)(spreadsNotExpiringToday)];
            case 5:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.wingAdjustment = wingAdjustment;
