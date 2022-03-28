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
exports.groupOptionsIntoSpreads = void 0;
var option_symbol_parser_1 = require("@penny/option-symbol-parser");
// If quantity (math.abs) is 2, there should be 2 of the same symbol
var optionSymbolsSpreadOut = function (options) {
    return options.reduce(function (acc, opt) { return __spreadArray(__spreadArray([], acc, true), Array(Math.abs(opt.quantity)).fill(opt.symbol), true); }, []);
};
var getSymbolsOfType = function (options, type, longOrShort) {
    var quantityFunc = longOrShort === 'long' ? function (opt) { return opt.quantity > 0; } : function (opt) { return opt.quantity < 0; };
    return optionSymbolsSpreadOut(options.filter(function (x) { return quantityFunc(x) && (0, option_symbol_parser_1.getType)(x.symbol) === type; }));
};
var groupIntoSpreads = function (longOptSymbols, shortOptSymbols, type) {
    var longFilterFunc = type === 'call' ?
        function (shortOpt, opt) { return (0, option_symbol_parser_1.getStrike)(opt) > (0, option_symbol_parser_1.getStrike)(shortOpt); }
        : function (shortOpt, opt) { return (0, option_symbol_parser_1.getStrike)(opt) < (0, option_symbol_parser_1.getStrike)(shortOpt); };
    var longSortFunc = type === 'call' ?
        function (a, b) { return (0, option_symbol_parser_1.getStrike)(a) - (0, option_symbol_parser_1.getStrike)(b); }
        : function (a, b) { return (0, option_symbol_parser_1.getStrike)(b) - (0, option_symbol_parser_1.getStrike)(a); };
    return shortOptSymbols.reduce(function (acc, shortOpt) {
        var underlying = (0, option_symbol_parser_1.getUnderlying)(shortOpt);
        var expiration = (0, option_symbol_parser_1.getExpiration)(shortOpt);
        var longsWithCompatibleStrike = acc.longOptsLeft.filter(function (x) { return (0, option_symbol_parser_1.getUnderlying)(x) === underlying && (0, option_symbol_parser_1.getExpiration)(x) === expiration && longFilterFunc(shortOpt, x); })
            .sort(longSortFunc);
        if (longsWithCompatibleStrike.length === 0) {
            return __assign(__assign({}, acc), { lonelyShorts: __spreadArray(__spreadArray([], acc.lonelyShorts, true), [shortOpt], false) });
        }
        var longOpt = longsWithCompatibleStrike[0];
        var newSpreads = __spreadArray(__spreadArray([], acc.spreads, true), [
            {
                long: longOpt,
                short: shortOpt,
            }
        ], false);
        // Splice isn't working right for some reason
        // Modified filter, only removes first occurence of longOpt in case there are multiple
        var newLongOptsLeft = acc.longOptsLeft.reduce(function (acc, x) {
            return !acc.removed && x === longOpt ? __assign(__assign({}, acc), { removed: true }) : __assign(__assign({}, acc), { newLongOptsLeft: __spreadArray(__spreadArray([], acc.newLongOptsLeft, true), [x], false) });
        }, {
            newLongOptsLeft: [],
            removed: false
        }).newLongOptsLeft;
        return __assign(__assign({}, acc), { spreads: newSpreads, longOptsLeft: newLongOptsLeft });
    }, {
        spreads: [],
        longOptsLeft: longOptSymbols,
        lonelyShorts: []
    });
};
var groupOptionsIntoSpreads = function (positions) {
    var options = positions.filter(function (pos) { return (0, option_symbol_parser_1.isOption)(pos.symbol); });
    var shortPuts = getSymbolsOfType(options, 'put', 'short');
    var longPuts = getSymbolsOfType(options, 'put', 'long');
    var shortCalls = getSymbolsOfType(options, 'call', 'short');
    var longCalls = getSymbolsOfType(options, 'call', 'long');
    var putSpreadResults = groupIntoSpreads(longPuts, shortPuts, 'put');
    var callSpreadResults = groupIntoSpreads(longCalls, shortCalls, 'call');
    return {
        call: callSpreadResults,
        put: putSpreadResults,
    };
};
exports.groupOptionsIntoSpreads = groupOptionsIntoSpreads;
