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
exports.sellIronCondors = exports.sellIronCondorBigThree = exports.sellIronCondor = exports.sellSpread = exports.sellSpreadByPremium = void 0;
var tradier = require("@penny/tradier");
var option_symbol_parser_1 = require("@penny/option-symbol-parser");
var lodash_1 = require("lodash");
var _insertDistanceToTargetDelta = function (chain, targetDelta) {
    return chain.map(function (link) { return (__assign(__assign({}, link), { distanceToDeltaTarget: Math.abs(targetDelta - link.delta) })); });
};
var _selectLinkClosestToTarget = function (chain) {
    return chain.reduce(function (acc, link) { return link.distanceToDeltaTarget < acc.distanceToDeltaTarget ? link : acc; }, chain[0]);
};
// Modified function that goes for a premium spread rather than a delta target
var sellSpreadByPremium = function (chain, symbol, type, premiumTarget, targetStrikeWidth) { return __awaiter(void 0, void 0, void 0, function () {
    var typeChain, typeChainOrdered_1, longLink_1, shortLink, legs, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                if (type === 'neither') {
                    return [2 /*return*/];
                }
                typeChain = chain.filter(function (x) { return x.type === type; });
                typeChainOrdered_1 = type === 'call' ? typeChain.reverse() : typeChain;
                shortLink = typeChainOrdered_1.find(function (shortCandidate, index) {
                    if (index === 0) {
                        return false;
                    }
                    var shortCandidatePremium = shortCandidate.premium;
                    // Some chains have a strike spread less than the target. Find a good one
                    for (var x = index - 1; x >= 0; x--) {
                        longLink_1 = typeChainOrdered_1[x];
                        if (!(Math.abs(longLink_1.strike - shortCandidate.strike) < targetStrikeWidth)) {
                            break;
                        }
                    }
                    var longCandidatePremium = longLink_1.premium;
                    var netPremium = shortCandidatePremium - longCandidatePremium;
                    return netPremium >= premiumTarget;
                });
                // Too high a delta
                if (!shortLink || shortLink.delta >= 0.30) {
                    return [2 /*return*/];
                }
                // Strike width too wide
                if (Math.abs(shortLink.strike - longLink_1.strike) > targetStrikeWidth) {
                    return [2 /*return*/];
                }
                legs = [
                    {
                        symbol: shortLink.symbol,
                        side: 'sell_to_open',
                        quantity: 1
                    },
                    {
                        symbol: longLink_1.symbol,
                        side: 'buy_to_open',
                        quantity: 1
                    }
                ];
                return [4 /*yield*/, tradier.multilegOptionOrder(symbol, 'credit', legs, 0.14)];
            case 1:
                _a.sent();
                return [3 /*break*/, 3];
            case 2:
                e_1 = _a.sent();
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.sellSpreadByPremium = sellSpreadByPremium;
var sellSpread = function (chain, symbol, type, shortDelta, targetStrikeWidth) { return __awaiter(void 0, void 0, void 0, function () {
    var typeChain, typeChainWithDist, shortLink_1, filterFunc, modifier, longLinkOptions, longLink, legs, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                if (type === 'neither') {
                    return [2 /*return*/];
                }
                typeChain = chain.filter(function (x) { return x.type === type; });
                typeChainWithDist = _insertDistanceToTargetDelta(typeChain, shortDelta);
                shortLink_1 = _selectLinkClosestToTarget(typeChainWithDist);
                // Too far from target delta
                if (shortLink_1.distanceToDeltaTarget > 0.10) {
                    return [2 /*return*/];
                }
                filterFunc = type === 'put' ?
                    function (link) { return (shortLink_1.strike - link.strike) <= targetStrikeWidth && link.strike < shortLink_1.strike; }
                    : function (link) { return (link.strike - shortLink_1.strike) <= targetStrikeWidth && link.strike > shortLink_1.strike; };
                modifier = type === 'put' ?
                    function (chain) { return chain; } :
                    function (chain) { return chain.reverse(); };
                longLinkOptions = modifier(typeChainWithDist.filter(filterFunc));
                if (longLinkOptions.length === 0) {
                    return [2 /*return*/];
                }
                longLink = longLinkOptions[0];
                legs = [
                    {
                        symbol: shortLink_1.symbol,
                        side: 'sell_to_open',
                        quantity: 1
                    },
                    {
                        symbol: longLink.symbol,
                        side: 'buy_to_open',
                        quantity: 1
                    }
                ];
                // SELL SELL SELL
                return [4 /*yield*/, tradier.multilegOptionOrder(symbol, 'credit', legs)];
            case 1:
                // SELL SELL SELL
                _a.sent();
                return [3 /*break*/, 3];
            case 2:
                e_2 = _a.sent();
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.sellSpread = sellSpread;
var sellIronCondor = function (symbol, shortDelta, targetStrikeWidth, put, call, minDTE) {
    if (put === void 0) { put = true; }
    if (call === void 0) { call = true; }
    if (minDTE === void 0) { minDTE = 30; }
    return __awaiter(void 0, void 0, void 0, function () {
        var expirations, expiration, chain, e_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 7, , 8]);
                    if (!put && !call) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, tradier.getExpirations(symbol, 100)];
                case 1:
                    expirations = _a.sent();
                    if (!expirations || expirations.length === 0) {
                        return [2 /*return*/];
                    }
                    expiration = expirations[0];
                    if (!expiration) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, tradier.getOptionChain(symbol, expiration)];
                case 2:
                    chain = _a.sent();
                    if (!put) return [3 /*break*/, 4];
                    return [4 /*yield*/, (0, exports.sellSpreadByPremium)(chain, symbol, 'put', shortDelta, targetStrikeWidth)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    if (!call) return [3 /*break*/, 6];
                    return [4 /*yield*/, (0, exports.sellSpreadByPremium)(chain, symbol, 'call', shortDelta, targetStrikeWidth)];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6: return [3 /*break*/, 8];
                case 7:
                    e_3 = _a.sent();
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
};
exports.sellIronCondor = sellIronCondor;
var sellIronCondorBigThree = function () { return __awaiter(void 0, void 0, void 0, function () {
    var bigThree, isOpen, x;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                bigThree = ['SPY', 'IWM', 'QQQ'];
                return [4 /*yield*/, tradier.isMarketOpen()];
            case 1:
                isOpen = _a.sent();
                if (!isOpen) {
                    return [2 /*return*/];
                }
                x = 0;
                _a.label = 2;
            case 2:
                if (!(x < bigThree.length)) return [3 /*break*/, 5];
                console.log(bigThree[x]);
                return [4 /*yield*/, (0, exports.sellIronCondor)(bigThree[x], 0.1, 1)];
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
exports.sellIronCondorBigThree = sellIronCondorBigThree;
var sellIronCondors = function () { return __awaiter(void 0, void 0, void 0, function () {
    var isOpen, symbols, positions, openOptions, openOptionSymbols, orders, multilegOrders, legs, openOrderSymbols, openSymbols, openPositionTypes, x, position;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, tradier.isMarketOpen()];
            case 1:
                isOpen = _a.sent();
                if (!isOpen) {
                    return [2 /*return*/];
                }
                symbols = [
                    'DIA', 'AAPL', 'TSLA', 'MSFT', 'BAC', 'WFC', 'FB', 'PTON', 'AMC', 'F',
                    'SNDL', 'AMZN', 'DIS', 'NIO', 'LCID', 'NFLX', 'PFE', 'NVDA', 'AAL', 'SNAP', 'PLUG', 'HOOD',
                    'GPRO', 'BABA', 'CCL', 'ACB', 'NOK', 'DAL', 'UAL', 'PLTR', 'GME', 'SBUX', 'AMD',
                    'COIN', 'TLRY', 'TWTR', 'RIVN', 'T', 'KO', 'CGC', 'GOOG', 'MRNA', 'SPCE', 'BB', 'PYPL', 'UBER',
                    'GM', 'ZNGA', 'NCLH', 'WKHS', 'SQ', 'DKNG', 'ABNB', 'BA', 'WMT',
                    'JNJ', 'CHPT', 'LUV', 'MRO', 'ARKK', 'RIOT', 'XOM', 'SOFI', 'WISH', 'SONY',
                    'PENN', 'COST', 'ZM', 'JPM',
                    'RCL', 'CLOV', 'ET', 'INTC', 'V', 'TSM', 'FUBO', 'MA',
                    'XLB', 'XLC', 'XLE', 'XLF', 'XLI', 'XLK', 'XLP', 'XLU', 'XLV', 'XLY',
                    'SPY', 'IWM', 'QQQ',
                    // Leveraged
                    'TQQQ', 'SOXL', 'DUST', 'ERX', 'FAS', 'FAZ', 'JNUG', 'LABD', 'LABU', 'NUGT', 'SDS', 'TNA', 'UPRO', 'YINN'
                ];
                return [4 /*yield*/, tradier.getPositions()];
            case 2:
                positions = _a.sent();
                openOptions = positions.filter(function (x) { return (0, option_symbol_parser_1.isOption)(x.symbol); });
                openOptionSymbols = openOptions.map(function (x) { return x.symbol; });
                return [4 /*yield*/, tradier.getOrders()];
            case 3:
                orders = _a.sent();
                multilegOrders = orders.filter(function (x) { return x.class === 'multileg' && (x.status === 'open' || x.status === 'pending'); });
                legs = multilegOrders.reduce(function (acc, x) { return __spreadArray(__spreadArray([], acc, true), x.leg, true); }, []);
                openOrderSymbols = legs.map(function (x) { return x.option_symbol; });
                openSymbols = (0, lodash_1.uniq)(__spreadArray(__spreadArray([], openOptionSymbols, true), openOrderSymbols, true));
                openPositionTypes = symbols.map(function (symbol) { return ({
                    symbol: symbol,
                    hasCall: openSymbols.some(function (openSymbol) { return (0, option_symbol_parser_1.getUnderlying)(openSymbol) === symbol && (0, option_symbol_parser_1.getType)(openSymbol) === 'call'; }),
                    hasPut: openSymbols.some(function (openSymbol) { return (0, option_symbol_parser_1.getUnderlying)(openSymbol) === symbol && (0, option_symbol_parser_1.getType)(openSymbol) === 'put'; }),
                }); });
                x = 0;
                _a.label = 4;
            case 4:
                if (!(x < openPositionTypes.length)) return [3 /*break*/, 7];
                position = openPositionTypes[x];
                return [4 /*yield*/, (0, exports.sellIronCondor)(position.symbol, 15, 1, !position.hasPut, !position.hasCall)];
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
exports.sellIronCondors = sellIronCondors;
