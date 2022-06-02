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
exports.sellCoveredCalls = void 0;
var option_symbol_parser_1 = require("@penny/option-symbol-parser");
var tradier = require("@penny/tradier");
var sellCoveredCalls = function () { return __awaiter(void 0, void 0, void 0, function () {
    var positions, optionableStockPositions, existingCoveredCalls, positionsWithNumOptions, _loop_1, x;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, tradier.getPositions()];
            case 1:
                positions = _a.sent();
                optionableStockPositions = positions.filter(function (pos) { return !(0, option_symbol_parser_1.isOption)(pos.symbol) && pos.quantity > 100; });
                existingCoveredCalls = positions.filter(function (pos) {
                    return (0, option_symbol_parser_1.isOption)(pos.symbol) && (0, option_symbol_parser_1.getType)(pos.symbol) === 'call' && pos.quantity < 0;
                });
                if (optionableStockPositions.length === 0) {
                    return [2 /*return*/];
                }
                positionsWithNumOptions = optionableStockPositions.map(function (pos) {
                    var numAllowedOptions = Math.floor(pos.quantity / 100);
                    var coveredCallsForSymbol = existingCoveredCalls.filter(function (cc) { return (0, option_symbol_parser_1.getUnderlying)(cc.symbol) === pos.symbol; }).length;
                    var numOptionsToSell = numAllowedOptions - coveredCallsForSymbol;
                    return __assign(__assign({}, pos), { numOptionsToSell: numOptionsToSell });
                });
                _loop_1 = function (x) {
                    var position, expirations, optionChain, callOptions, MAX_DELTA, DELTA_TARGET, closestDeltaOpt;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                position = positionsWithNumOptions[x];
                                return [4 /*yield*/, tradier.getExpirations(position.symbol, 1)];
                            case 1:
                                expirations = _b.sent();
                                if (expirations.length === 0) {
                                    return [2 /*return*/, "continue"];
                                }
                                return [4 /*yield*/, tradier.getOptionChain(position.symbol, expirations[0])];
                            case 2:
                                optionChain = _b.sent();
                                callOptions = optionChain.filter(function (opt) { return opt.type === 'call'; });
                                MAX_DELTA = 0.4;
                                DELTA_TARGET = 0.30;
                                closestDeltaOpt = callOptions.filter(function (opt) { return opt.delta < MAX_DELTA; }).reduce(function (acc, opt) {
                                    return (DELTA_TARGET - opt.delta) < (DELTA_TARGET - acc.delta) ? opt : acc;
                                }, { symbol: '', delta: 10 });
                                if (closestDeltaOpt.symbol === '') {
                                    return [2 /*return*/, "continue"];
                                }
                                return [4 /*yield*/, tradier.sellToOpen(position.symbol, closestDeltaOpt.symbol, position.numOptionsToSell)];
                            case 3:
                                _b.sent();
                                return [2 /*return*/];
                        }
                    });
                };
                x = 0;
                _a.label = 2;
            case 2:
                if (!(x < positionsWithNumOptions.length)) return [3 /*break*/, 5];
                return [5 /*yield**/, _loop_1(x)];
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
exports.sellCoveredCalls = sellCoveredCalls;
