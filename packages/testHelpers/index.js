"use strict";
// These functions generate mock orders and position objects for use in automated tests
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePositionObject = exports.generateOrderObject = exports.generateSymbol = void 0;
var generateSymbol = function (symbol, type) {
    switch (type) {
        case 'stock':
            return symbol;
        case 'call':
            return "".concat(symbol, "1234C3214");
        case 'put':
            return "".concat(symbol, "1234P3214");
    }
};
exports.generateSymbol = generateSymbol;
var generateOrderObject = function (symbol, quantity, type, side, status, id) {
    if (quantity === void 0) { quantity = 1; }
    if (type === void 0) { type = 'stock'; }
    if (side === void 0) { side = 'sell_to_open'; }
    if (status === void 0) { status = 'pending'; }
    if (id === void 0) { id = 123456; }
    var ordClass = type === 'call' || type === 'put' ? 'option' : 'equity';
    var orderObj = {
        id: id,
        type: 'market',
        symbol: symbol,
        side: side,
        quantity: quantity,
        status: status,
        duration: 'pre',
        avg_fill_price: 0.00000000,
        exec_quantity: 0.00000000,
        last_fill_price: 0.00000000,
        last_fill_quantity: 0.00000000,
        remaining_quantity: 0.00000000,
        create_date: '2018-06-06T20:16:17.342Z',
        transaction_date: '2018-06-06T20:16:17.357Z',
        class: ordClass,
        //option_symbol: 'AAPL180720C00274000'
    };
    if (ordClass === 'option') {
        return __assign(__assign({}, orderObj), { option_symbol: (0, exports.generateSymbol)(symbol, type) });
    }
    return orderObj;
};
exports.generateOrderObject = generateOrderObject;
var generatePositionObject = function (symbol, quantity, type, cost_basis, date_acquired, id) {
    if (quantity === void 0) { quantity = 1; }
    if (type === void 0) { type = 'stock'; }
    if (cost_basis === void 0) { cost_basis = 100; }
    if (date_acquired === void 0) { date_acquired = '2019-01-31T17:05'; }
    if (id === void 0) { id = 123456; }
    return ({
        cost_basis: cost_basis,
        date_acquired: date_acquired,
        id: id,
        quantity: quantity,
        symbol: (0, exports.generateSymbol)(symbol, type)
    });
};
exports.generatePositionObject = generatePositionObject;
