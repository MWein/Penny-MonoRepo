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
exports.getOrders = exports.getOrder = exports.filterForOptionBuyToCloseOrders = exports.filterForCashSecuredPutOrders = exports.filterForCoveredCallOrders = void 0;
var network = require("./network");
var option_symbol_parser_1 = require("@penny/option-symbol-parser");
var filterForCoveredCallOrders = function (orders) {
    return orders.filter(function (ord) {
        return ord.class === 'option'
            && ['open', 'partially_filled', 'pending', 'calculated', 'accepted_for_bidding', 'held'].includes(ord.status)
            && ord.side === 'sell_to_open'
            && (0, option_symbol_parser_1.getType)(ord.option_symbol) === 'call';
    });
};
exports.filterForCoveredCallOrders = filterForCoveredCallOrders;
var filterForCashSecuredPutOrders = function (orders) {
    return orders.filter(function (ord) {
        return ord.class === 'option'
            && ['open', 'partially_filled', 'pending', 'calculated', 'accepted_for_bidding', 'held'].includes(ord.status)
            && ord.side === 'sell_to_open'
            && (0, option_symbol_parser_1.getType)(ord.option_symbol) === 'put';
    });
};
exports.filterForCashSecuredPutOrders = filterForCashSecuredPutOrders;
var filterForOptionBuyToCloseOrders = function (orders) {
    return orders.filter(function (ord) {
        return ord.class === 'option'
            && ['open', 'partially_filled', 'pending', 'calculated', 'accepted_for_bidding', 'held'].includes(ord.status)
            && ord.side === 'buy_to_close'
            && (0, option_symbol_parser_1.isOption)(ord.option_symbol);
    });
};
exports.filterForOptionBuyToCloseOrders = filterForOptionBuyToCloseOrders;
var getOrder = function (orderId) { return __awaiter(void 0, void 0, void 0, function () {
    var url, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = "accounts/".concat(process.env.ACCOUNTNUM, "/orders/").concat(orderId);
                return [4 /*yield*/, network.get(url)];
            case 1:
                response = _a.sent();
                if (response.order === 'null') {
                    return [2 /*return*/, null];
                }
                return [2 /*return*/, response.order];
        }
    });
}); };
exports.getOrder = getOrder;
var getOrders = function () { return __awaiter(void 0, void 0, void 0, function () {
    var url, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = "accounts/".concat(process.env.ACCOUNTNUM, "/orders");
                return [4 /*yield*/, network.get(url)];
            case 1:
                response = _a.sent();
                if (response.orders === 'null') {
                    return [2 /*return*/, []];
                }
                if (Array.isArray(response.orders.order)) {
                    return [2 /*return*/, response.orders.order];
                }
                else {
                    return [2 /*return*/, [response.orders.order]];
                }
                return [2 /*return*/];
        }
    });
}); };
exports.getOrders = getOrders;
