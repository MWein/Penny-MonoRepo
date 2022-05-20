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
exports.saveOptPrices = void 0;
var tradier = require("@penny/tradier");
var db_models_1 = require("@penny/db-models");
var lodash_1 = require("lodash");
var saveOptPricesBatch = function (limit, offset) { return __awaiter(void 0, void 0, void 0, function () {
    var start, today, currentDate, filter, matchingOptions, symbols, tradierPrices, currentPrices, end;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                start = new Date();
                today = new Date();
                currentDate = new Date().toISOString().split('T')[0];
                filter = {
                    expiration: { $gte: currentDate },
                };
                return [4 /*yield*/, db_models_1.RNSModel.find(filter)
                        .select('symbol')
                        .limit(limit)
                        .skip(offset)
                        .sort({ symbol: 1 })
                        .lean()];
            case 1:
                matchingOptions = _a.sent();
                if (matchingOptions.length === 0) {
                    return [2 /*return*/, false];
                }
                symbols = (0, lodash_1.uniq)(matchingOptions.map(function (x) { return x.symbol; }));
                return [4 /*yield*/, tradier.getPrices(symbols)];
            case 2:
                tradierPrices = _a.sent();
                currentPrices = tradierPrices.map(function (x) { return (__assign(__assign({}, x), { price: Number((x.price * 100).toFixed(0)), date: today })); });
                return [4 /*yield*/, db_models_1.PriceHistoryModel.insertMany(currentPrices)
                    // Takes far too long
                    // for (let x = 0; x < currentPrices.length; x++) {
                    //   // Update main table
                    //   const priceListing = currentPrices[x]
                    //   await RNSModel.updateMany({ symbol: priceListing.symbol }, {
                    //     $push: {
                    //       history: {
                    //         price: priceListing.price,
                    //         date: priceListing.date,
                    //       }
                    //     }
                    //   })
                    // }
                ];
            case 3:
                _a.sent();
                end = new Date();
                console.log('This took:', end.valueOf() - start.valueOf());
                return [2 /*return*/, true];
        }
    });
}); };
var saveOptPrices = function () { return __awaiter(void 0, void 0, void 0, function () {
    var limit, offset, hasMore;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                limit = 400 // Should be divisible by 200 for efficiency
                ;
                offset = 0;
                _a.label = 1;
            case 1:
                if (!true) return [3 /*break*/, 3];
                console.log(offset);
                return [4 /*yield*/, saveOptPricesBatch(limit, offset)];
            case 2:
                hasMore = _a.sent();
                if (!hasMore) {
                    return [3 /*break*/, 3];
                }
                offset += limit;
                return [3 /*break*/, 1];
            case 3:
                console.log('Done');
                return [2 /*return*/];
        }
    });
}); };
exports.saveOptPrices = saveOptPrices;
