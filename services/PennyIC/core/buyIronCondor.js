"use strict";
// TODO Possible Removal
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
exports.buyIronCondors = exports.buyIronCondor = exports.buySpreadByPremium = void 0;
var tradier = require("@penny/tradier");
var option_symbol_parser_1 = require("@penny/option-symbol-parser");
var spread_outcome_1 = require("@penny/spread-outcome");
// Modified function that goes for a premium spread rather than a delta target
// TODO After writing tests for this, change "short" and "long" so future me doesn't get confused
var buySpreadByPremium = function (chain, symbol, type, premiumTarget, targetStrikeWidth) { return __awaiter(void 0, void 0, void 0, function () {
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
                        side: 'buy_to_open',
                        quantity: 1
                    },
                    {
                        symbol: longLink_1.symbol,
                        side: 'sell_to_open',
                        quantity: 1
                    }
                ];
                return [4 /*yield*/, tradier.multilegOptionOrder(symbol, 'debit', legs, 0.20)]; // Buy for $20 or less per side
            case 1:
                _a.sent(); // Buy for $20 or less per side
                return [3 /*break*/, 3];
            case 2:
                e_1 = _a.sent();
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.buySpreadByPremium = buySpreadByPremium;
var buyIronCondor = function (symbol, shortDelta, targetStrikeWidth, put, call) {
    if (put === void 0) { put = true; }
    if (call === void 0) { call = true; }
    return __awaiter(void 0, void 0, void 0, function () {
        var expirations, expiration, chain, e_2;
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
                    return [4 /*yield*/, (0, exports.buySpreadByPremium)(chain, symbol, 'put', shortDelta, targetStrikeWidth)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    if (!call) return [3 /*break*/, 6];
                    return [4 /*yield*/, (0, exports.buySpreadByPremium)(chain, symbol, 'call', shortDelta, targetStrikeWidth)];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6: return [3 /*break*/, 8];
                case 7:
                    e_2 = _a.sent();
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
};
exports.buyIronCondor = buyIronCondor;
var buyIronCondors = function () { return __awaiter(void 0, void 0, void 0, function () {
    var buyICEnabled, targetDelta, targetStrikeWidth, isOpen, symbols, positions, openOptions, openSpreads, longSpreads, openOptionSymbols, openPositionTypes, x, position;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                buyICEnabled = true;
                targetDelta = 15;
                targetStrikeWidth = 1;
                if (!buyICEnabled) {
                    return [2 /*return*/];
                }
                return [4 /*yield*/, tradier.isMarketOpen()];
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
                openSpreads = (0, spread_outcome_1.getSpreadOutcomes)(openOptions);
                longSpreads = openSpreads.filter(function (spread) { return spread.side === 'long'; });
                openOptionSymbols = longSpreads.reduce(function (acc, spread) { return __spreadArray(__spreadArray([], acc, true), spread.positions.map(function (pos) { return pos.symbol; }), true); }, []);
                openPositionTypes = symbols.map(function (symbol) { return ({
                    symbol: symbol,
                    hasCall: openOptionSymbols.some(function (openSymbol) { return (0, option_symbol_parser_1.getUnderlying)(openSymbol) === symbol && (0, option_symbol_parser_1.getType)(openSymbol) === 'call'; }),
                    hasPut: openOptionSymbols.some(function (openSymbol) { return (0, option_symbol_parser_1.getUnderlying)(openSymbol) === symbol && (0, option_symbol_parser_1.getType)(openSymbol) === 'put'; }),
                }); });
                x = 0;
                _a.label = 3;
            case 3:
                if (!(x < openPositionTypes.length)) return [3 /*break*/, 6];
                position = openPositionTypes[x];
                return [4 /*yield*/, (0, exports.buyIronCondor)(position.symbol, targetDelta, targetStrikeWidth, !position.hasPut, !position.hasCall)];
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
exports.buyIronCondors = buyIronCondors;
