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
exports.getExpirations = exports._nextStrikeDates = void 0;
var network = require("./network");
var logUtil = require("@penny/logger");
// Failover function
var _nextStrikeDates = function (maxWeeksOut) {
    if (maxWeeksOut === void 0) { maxWeeksOut = 4; }
    var date = new Date();
    var dates = [];
    while (dates.length < maxWeeksOut) {
        var day = date.getDay();
        if (day === 5) {
            date.setDate(date.getDate() + 7); // Off to next friday
        }
        else if (day === 6) {
            date.setDate(date.getDate() + 6);
        }
        else {
            date.setDate(date.getDate() + (5 - day));
        }
        // ISO string returns zulu time and can screw up the date
        var offset = date.getTimezoneOffset();
        var actualDate = new Date(date.getTime() - (offset * 60 * 1000));
        dates.push(actualDate.toISOString().split('T')[0]);
    }
    return dates;
};
exports._nextStrikeDates = _nextStrikeDates;
var getExpirations = function (symbol, limit) {
    if (limit === void 0) { limit = 2; }
    return __awaiter(void 0, void 0, void 0, function () {
        var url, response, currentDate_1, dates, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    if (limit === 0) {
                        return [2 /*return*/, []];
                    }
                    url = "/markets/options/expirations?symbol=".concat(symbol);
                    return [4 /*yield*/, network.get(url)
                        // Tradier has this annoying tendency to return a single object rather than an array if there is one return value
                        // This should never happen with expirations, so I'm not doing the usual Array.isArray thing
                    ];
                case 1:
                    response = _a.sent();
                    currentDate_1 = new Date().toISOString().split('T')[0];
                    dates = response.expirations.date.filter(function (x) { return x != currentDate_1; });
                    // These symbols have multiple expirations per week
                    // if ([ 'SPY', 'IWM', 'QQQ' ].includes(symbol)) {
                    //   return [ dates[0] ]
                    // }
                    return [2 /*return*/, dates.slice(0, limit)];
                case 2:
                    e_1 = _a.sent();
                    logUtil.log({
                        type: 'error',
                        message: e_1.toString()
                    });
                    return [2 /*return*/, (0, exports._nextStrikeDates)(limit)];
                case 3: return [2 /*return*/];
            }
        });
    });
};
exports.getExpirations = getExpirations;
