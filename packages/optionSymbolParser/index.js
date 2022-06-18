"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStrike = exports.getExpiration = exports.getType = exports.getUnderlying = exports.isOption = void 0;
var nums = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
var isOption = function (symbol) {
    return symbol.split('').some(function (char) { return nums.includes(char); });
};
exports.isOption = isOption;
var getUnderlying = function (symbol) {
    return (0, exports.isOption)(symbol) ?
        symbol.split('').filter(function (char) { return !nums.includes(char); }).slice(0, -1).join('')
        : symbol;
};
exports.getUnderlying = getUnderlying;
var getType = function (symbol) {
    if (!(0, exports.isOption)(symbol)) {
        return 'neither';
    }
    var lettersInSymbol = symbol.split('').filter(function (char) { return !nums.includes(char); });
    var lastChar = lettersInSymbol[lettersInSymbol.length - 1];
    if (lastChar === 'P') {
        return 'put';
    }
    else {
        return 'call';
    }
};
exports.getType = getType;
var getExpiration = function (symbol) {
    return (0, exports.isOption)(symbol) ?
        symbol.replace((0, exports.getUnderlying)(symbol), '').split(/C|P/g)[0].split('').reduce(function (acc, x, index) {
            return [1, 3].includes(index) ? acc + x + '-' : acc + x;
        }, '20')
        : null;
};
exports.getExpiration = getExpiration;
var getStrike = function (symbol) {
    return (0, exports.isOption)(symbol) ?
        Number(symbol.replace((0, exports.getUnderlying)(symbol), '').split(/C|P/g)[1].split('').reduce(function (acc, x, index) {
            return index === 4 ? acc + x + '.' : acc + x;
        }, ''))
        : null;
};
exports.getStrike = getStrike;
