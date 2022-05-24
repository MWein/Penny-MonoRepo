"use strict";
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
exports.getSpreadOutcomes = exports.getSpreadOutcome = void 0;
var option_symbol_parser_1 = require("@penny/option-symbol-parser");
var lodash_1 = require("lodash");
var determineSide = function (costBasis) {
    if (costBasis < 0) {
        return 'short';
    }
    else if (costBasis > 0) {
        return 'long';
    }
    return 'indeterminate';
};
var determinePositionResultForStrike = function (position, strike) {
    var posType = (0, option_symbol_parser_1.getType)(position.symbol);
    var posStrike = (0, option_symbol_parser_1.getStrike)(position.symbol);
    if (posType === 'call') {
        if (strike >= posStrike) {
            var purchaseValue = posStrike * -100;
            return {
                invoked: true,
                value: purchaseValue * position.quantity
            };
        }
        return {
            invoked: false,
            value: 0,
        };
    }
    // Put
    if (strike <= posStrike) {
        var saleValue = posStrike * 100;
        return {
            invoked: true,
            value: saleValue * position.quantity
        };
    }
    return {
        invoked: false,
        value: 0,
    };
};
// Assumes that all of them expire on the same day
var getSpreadOutcome = function (underlying, positions) {
    var onlyUnderlying = positions.filter(function (pos) { return (0, option_symbol_parser_1.getUnderlying)(pos.symbol) === underlying && (0, option_symbol_parser_1.isOption)(pos.symbol); });
    var costBasis = positions.reduce(function (acc, pos) { return acc + pos.cost_basis; }, 0);
    var fullyCovered = onlyUnderlying.reduce(function (acc, pos) { return acc + pos.quantity; }, 0) === 0;
    var strikes = onlyUnderlying.map(function (pos) { return (0, option_symbol_parser_1.getStrike)(pos.symbol); }).sort(function (a, b) { return a - b; });
    strikes.push(strikes[strikes.length - 1] + 1); // Add last strike plus 1
    strikes.unshift(strikes[0] - 1); // Add first strike minus 1
    var resultAtEachStrike = strikes.map(function (strike) {
        return onlyUnderlying.reduce(function (acc, pos) {
            var _a = determinePositionResultForStrike(pos, strike), invoked = _a.invoked, value = _a.value;
            return {
                numInvoked: acc.numInvoked + (invoked ? 1 : 0),
                total: acc.total + value
            };
        }, {
            numInvoked: 0,
            total: 0,
        });
    })
        // If fully covered, do not return results where protective side not invoked
        .filter(function (result) { return result.numInvoked % 2 === 0; })
        .map(function (result) { return result.total - costBasis; });
    // For iron condors, there would be no strike between the spreads with the above, adding it manually
    // A lot less complex
    // Also theres a weird edge case where -0 is returned, using a ternary to just return 0
    resultAtEachStrike.push(costBasis === 0 ? 0 : costBasis * -1);
    var maxLoss = Math.min.apply(Math, resultAtEachStrike);
    var maxGain = Math.max.apply(Math, resultAtEachStrike);
    // Edge case for straddles and strangles
    // Only one unique value is returned since resultAtEachStrike only contains values where number of legs invoked is even
    var uniqResults = (0, lodash_1.uniq)(resultAtEachStrike);
    if (uniqResults.length === 1) {
        var result = uniqResults[0];
        if (result < 0) {
            maxGain = Infinity;
        }
        if (result > 0) {
            maxLoss = -Infinity;
        }
    }
    return {
        ticker: underlying,
        side: determineSide(costBasis),
        maxLoss: maxLoss,
        maxGain: maxGain,
        fullyCovered: fullyCovered,
        positions: positions,
    };
};
exports.getSpreadOutcome = getSpreadOutcome;
var getSpreadOutcomes = function (positions) {
    return (0, lodash_1.uniq)(positions.map(function (pos) { return (0, option_symbol_parser_1.getUnderlying)(pos.symbol); })).reduce(function (acc, underlying) {
        var positionsWithUnderlying = positions.filter(function (pos) { return (0, option_symbol_parser_1.getUnderlying)(pos.symbol) === underlying; });
        var expirations = (0, lodash_1.uniq)(positionsWithUnderlying.map(function (pos) { return (0, option_symbol_parser_1.getExpiration)(pos.symbol); }));
        var spreadResults = expirations.map(function (exp) {
            return (0, exports.getSpreadOutcome)(underlying, positionsWithUnderlying.filter(function (pos) { return (0, option_symbol_parser_1.getExpiration)(pos.symbol) === exp; }));
        });
        return __spreadArray(__spreadArray([], acc, true), spreadResults, true);
    }, []);
};
exports.getSpreadOutcomes = getSpreadOutcomes;
