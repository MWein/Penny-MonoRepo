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
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveAndPurchase = void 0;
var tradier = require("@penny/tradier");
var getATMOptions_1 = require("./getATMOptions");
var evalAndPurchase_1 = require("./evalAndPurchase");
var db_models_1 = require("@penny/db-models");
var symbols = require('../core/weeklyTickers.json');
var saveAndPurchase = function () { return __awaiter(void 0, void 0, void 0, function () {
    var open, x, symbol, prices, atmOpts, diff, putModel, callModel;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, tradier.isMarketOpen()];
            case 1:
                open = _b.sent();
                if (!open) {
                    return [2 /*return*/];
                }
                x = 0;
                _b.label = 2;
            case 2:
                if (!(x < symbols.length)) return [3 /*break*/, 11];
                symbol = symbols[x];
                console.log(symbol);
                return [4 /*yield*/, tradier.getPrices([symbol])];
            case 3:
                prices = _b.sent();
                return [4 /*yield*/, (0, getATMOptions_1.getATMOptions)(symbol, prices)];
            case 4:
                atmOpts = _b.sent();
                if (!atmOpts) return [3 /*break*/, 10];
                diff = (_a = atmOpts.put.diff) !== null && _a !== void 0 ? _a : atmOpts.call.diff;
                if (!(diff < 0)) return [3 /*break*/, 6];
                return [4 /*yield*/, (0, evalAndPurchase_1.evalAndPurchase)(atmOpts.put)];
            case 5:
                _b.sent();
                return [3 /*break*/, 8];
            case 6: return [4 /*yield*/, (0, evalAndPurchase_1.evalAndPurchase)(atmOpts.call)];
            case 7:
                _b.sent();
                _b.label = 8;
            case 8:
                putModel = new db_models_1.RNSModel(atmOpts.put);
                callModel = new db_models_1.RNSModel(atmOpts.call);
                return [4 /*yield*/, Promise.all([
                        putModel.save(),
                        callModel.save(),
                    ])];
            case 9:
                _b.sent();
                _b.label = 10;
            case 10:
                x++;
                return [3 /*break*/, 2];
            case 11: return [2 /*return*/];
        }
    });
}); };
exports.saveAndPurchase = saveAndPurchase;
