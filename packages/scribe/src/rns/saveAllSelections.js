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
exports.saveAllSelections = void 0;
var tradier = require("@penny/tradier");
var db_models_1 = require("@penny/db-models");
var getATMOptions = function (symbol, prices) { return __awaiter(void 0, void 0, void 0, function () {
    var expirations, expiration, currentPrice_1, chain, putChain, callChain, atmPutLink, atmCallLink, putPerc, callPerc, diff, put, call, e_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                return [4 /*yield*/, tradier.getExpirations(symbol, 10)];
            case 1:
                expirations = _b.sent();
                if (!expirations || expirations.length === 0) {
                    return [2 /*return*/, null];
                }
                expiration = expirations[0];
                if (!expiration) {
                    return [2 /*return*/, null];
                }
                currentPrice_1 = (_a = prices.find(function (x) { return x.symbol === symbol; })) === null || _a === void 0 ? void 0 : _a.price;
                if (!currentPrice_1) {
                    return [2 /*return*/, null];
                }
                return [4 /*yield*/, tradier.getOptionChain(symbol, expiration)];
            case 2:
                chain = _b.sent();
                putChain = chain.filter(function (link) { return link.type === 'put'; });
                callChain = chain.filter(function (link) { return link.type === 'call'; });
                atmPutLink = putChain.filter(function (link) { return link.strike < currentPrice_1; }).reverse()[0];
                atmCallLink = callChain.filter(function (link) { return link.strike > currentPrice_1; })[0];
                putPerc = Number((atmPutLink.premium / atmPutLink.strike).toFixed(2));
                callPerc = Number((atmCallLink.premium / atmCallLink.strike).toFixed(2));
                diff = putPerc - callPerc;
                put = __assign(__assign({}, atmPutLink), { price: currentPrice_1, perc: putPerc, diff: diff });
                call = __assign(__assign({}, atmCallLink), { price: currentPrice_1, perc: callPerc, diff: diff });
                return [2 /*return*/, {
                        put: put,
                        call: call,
                    }];
            case 3:
                e_1 = _b.sent();
                return [2 /*return*/, null];
            case 4: return [2 /*return*/];
        }
    });
}); };
var symbols = require('./weeklyTickers.json');
var saveAllSelections = function () { return __awaiter(void 0, void 0, void 0, function () {
    var x, symbol, prices, atmOpts, putModel, callModel;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                x = 0;
                _a.label = 1;
            case 1:
                if (!(x < symbols.length)) return [3 /*break*/, 6];
                symbol = symbols[x];
                console.log(symbol);
                return [4 /*yield*/, tradier.getPrices([symbol])];
            case 2:
                prices = _a.sent();
                return [4 /*yield*/, getATMOptions(symbol, prices)];
            case 3:
                atmOpts = _a.sent();
                if (!atmOpts) return [3 /*break*/, 5];
                putModel = new db_models_1.RNSModel(atmOpts.put);
                callModel = new db_models_1.RNSModel(atmOpts.call);
                return [4 /*yield*/, Promise.all([
                        putModel.save(),
                        callModel.save(),
                    ])];
            case 4:
                _a.sent();
                _a.label = 5;
            case 5:
                x++;
                return [3 /*break*/, 1];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.saveAllSelections = saveAllSelections;
