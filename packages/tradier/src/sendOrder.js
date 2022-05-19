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
exports.cancelOrders = exports.multilegOptionOrder = exports.buyToCloseMarket = exports.buyToClose = exports.sellToClose = exports.sellToOpen = exports.buy = exports._sendOrder = void 0;
var network = require("./network");
var logUtil = require("@penny/logger");
var _sendOrder = function (body, successLog, failureLog) { return __awaiter(void 0, void 0, void 0, function () {
    var url, bodyWithAccountId, result, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = "accounts/".concat(process.env.ACCOUNTNUM, "/orders");
                bodyWithAccountId = __assign({ account_id: process.env.ACCOUNTNUM }, body);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, network.post(url, bodyWithAccountId, false)];
            case 2:
                result = _a.sent();
                logUtil.log(successLog);
                return [2 /*return*/, result];
            case 3:
                e_1 = _a.sent();
                logUtil.log({
                    type: 'error',
                    message: failureLog,
                });
                logUtil.log({
                    type: 'error',
                    message: e_1.message,
                });
                return [2 /*return*/, {
                        status: 'not ok'
                    }];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports._sendOrder = _sendOrder;
var buy = function (symbol, quantity) { return __awaiter(void 0, void 0, void 0, function () {
    var body, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                body = {
                    class: 'equity',
                    symbol: symbol,
                    side: 'buy',
                    quantity: quantity,
                    type: 'market',
                    duration: 'day',
                };
                return [4 /*yield*/, (0, exports._sendOrder)(body, "Buy ".concat(quantity, " ").concat(symbol), "Buy ".concat(quantity, " ").concat(symbol, " Failed"))];
            case 1:
                result = _a.sent();
                return [2 /*return*/, result];
        }
    });
}); };
exports.buy = buy;
var sellToOpen = function (symbol, option_symbol, quantity) { return __awaiter(void 0, void 0, void 0, function () {
    var body, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                body = {
                    class: 'option',
                    symbol: symbol,
                    option_symbol: option_symbol,
                    side: 'sell_to_open',
                    quantity: quantity,
                    type: 'market',
                    duration: 'day',
                };
                return [4 /*yield*/, (0, exports._sendOrder)(body, "Sell-to-open ".concat(quantity, " ").concat(option_symbol), "Sell-to-open ".concat(quantity, " ").concat(option_symbol, " Failed"))];
            case 1:
                result = _a.sent();
                return [2 /*return*/, result];
        }
    });
}); };
exports.sellToOpen = sellToOpen;
var sellToClose = function (symbol, option_symbol, quantity) { return __awaiter(void 0, void 0, void 0, function () {
    var body, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                body = {
                    class: 'option',
                    symbol: symbol,
                    option_symbol: option_symbol,
                    side: 'sell_to_close',
                    quantity: quantity,
                    type: 'market',
                    duration: 'gtc',
                };
                return [4 /*yield*/, (0, exports._sendOrder)(body, "Sell-to-close ".concat(quantity, " ").concat(option_symbol), "Sell-to-close ".concat(quantity, " ").concat(option_symbol, " Failed"))];
            case 1:
                result = _a.sent();
                return [2 /*return*/, result];
        }
    });
}); };
exports.sellToClose = sellToClose;
var buyToClose = function (symbol, option_symbol, quantity, buyToCloseAmount) { return __awaiter(void 0, void 0, void 0, function () {
    var body, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                body = {
                    class: 'option',
                    symbol: symbol,
                    option_symbol: option_symbol,
                    side: 'buy_to_close',
                    quantity: quantity,
                    type: 'limit',
                    price: buyToCloseAmount,
                    duration: 'gtc',
                };
                return [4 /*yield*/, (0, exports._sendOrder)(body, "Buy-to-close ".concat(quantity, " ").concat(option_symbol), "Buy-to-close ".concat(quantity, " ").concat(option_symbol, " Failed"))];
            case 1:
                result = _a.sent();
                return [2 /*return*/, result];
        }
    });
}); };
exports.buyToClose = buyToClose;
var buyToCloseMarket = function (symbol, option_symbol, quantity) { return __awaiter(void 0, void 0, void 0, function () {
    var body, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                body = {
                    class: 'option',
                    symbol: symbol,
                    option_symbol: option_symbol,
                    side: 'buy_to_close',
                    quantity: quantity,
                    type: 'market',
                    duration: 'gtc',
                };
                return [4 /*yield*/, (0, exports._sendOrder)(body, "Buy-to-close Market Price ".concat(quantity, " ").concat(option_symbol), "Buy-to-close Market Price ".concat(quantity, " ").concat(option_symbol, " Failed"))];
            case 1:
                result = _a.sent();
                return [2 /*return*/, result];
        }
    });
}); };
exports.buyToCloseMarket = buyToCloseMarket;
var multilegOptionOrder = function (underlying, type, legs, price) {
    if (price === void 0) { price = 0.07; }
    return __awaiter(void 0, void 0, void 0, function () {
        var mainBody, bodyWithLegs, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mainBody = {
                        class: 'multileg',
                        symbol: underlying,
                        type: type,
                        duration: 'day',
                        price: price,
                    };
                    bodyWithLegs = legs.reduce(function (acc, leg, index) {
                        var _a;
                        var optionSymbolKey = "option_symbol[".concat(index, "]");
                        var sideKey = "side[".concat(index, "]");
                        var quantityKey = "quantity[".concat(index, "]");
                        return __assign(__assign({}, acc), (_a = {}, _a[optionSymbolKey] = leg.symbol, _a[sideKey] = leg.side, _a[quantityKey] = leg.quantity, _a));
                    }, mainBody);
                    return [4 /*yield*/, (0, exports._sendOrder)(bodyWithLegs, "Multileg Order ".concat(underlying), "Multileg Order ".concat(underlying, " Failed"))];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, result];
            }
        });
    });
};
exports.multilegOptionOrder = multilegOptionOrder;
var cancelOrders = function (orderIDs) { return __awaiter(void 0, void 0, void 0, function () {
    var x, url, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                x = 0;
                _a.label = 1;
            case 1:
                if (!(x < orderIDs.length)) return [3 /*break*/, 6];
                url = "accounts/".concat(process.env.ACCOUNTNUM, "/orders/").concat(orderIDs[x]);
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                return [4 /*yield*/, network.deleteReq(url)];
            case 3:
                _a.sent();
                return [3 /*break*/, 5];
            case 4:
                e_2 = _a.sent();
                logUtil.log({
                    type: 'error',
                    message: "Could not cancel ".concat(orderIDs[x]),
                });
                return [3 /*break*/, 5];
            case 5:
                x++;
                return [3 /*break*/, 1];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.cancelOrders = cancelOrders;
