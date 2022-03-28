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
exports.clearOldLogs = exports.getLogs = exports.log = exports._logWithMessage = exports._logWithObject = void 0;
var db_models_1 = require("@penny/db-models");
// Log data is the object that will go directly to Mongo
var _logWithObject = function (logData) { return __awaiter(void 0, void 0, void 0, function () {
    var newLog, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                newLog = new db_models_1.logModel(logData);
                return [4 /*yield*/, newLog.save()];
            case 1:
                _a.sent();
                if (logData.type !== 'ping') {
                    console.log(logData.type || 'info', ':', logData.message);
                }
                return [3 /*break*/, 3];
            case 2:
                e_1 = _a.sent();
                console.log('Error reaching database');
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports._logWithObject = _logWithObject;
var _logWithMessage = function (message) { return __awaiter(void 0, void 0, void 0, function () {
    var newLog, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                newLog = new db_models_1.logModel({
                    message: message,
                });
                return [4 /*yield*/, newLog.save()];
            case 1:
                _a.sent();
                console.log('info', ':', message);
                return [3 /*break*/, 3];
            case 2:
                e_2 = _a.sent();
                console.log('Error reaching database');
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports._logWithMessage = _logWithMessage;
var log = function (logData) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(typeof logData === 'string')) return [3 /*break*/, 2];
                return [4 /*yield*/, (0, exports._logWithMessage)(logData)];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2:
                if (!(typeof logData === 'object')) return [3 /*break*/, 4];
                return [4 /*yield*/, (0, exports._logWithObject)(logData)];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.log = log;
var getLogs = function () { return __awaiter(void 0, void 0, void 0, function () {
    var logs;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db_models_1.logModel.find().sort({ date: -1 }).select('-_id -__v')];
            case 1:
                logs = _a.sent();
                return [2 /*return*/, logs];
        }
    });
}); };
exports.getLogs = getLogs;
var clearOldLogs = function () { return __awaiter(void 0, void 0, void 0, function () {
    var DELETEOLDERTHANDAYS, today, priorDate, e_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                DELETEOLDERTHANDAYS = 90;
                today = new Date();
                priorDate = new Date().setDate(today.getDate() - DELETEOLDERTHANDAYS);
                return [4 /*yield*/, db_models_1.logModel.deleteMany({ date: { $lte: priorDate } })];
            case 1:
                _a.sent();
                return [3 /*break*/, 3];
            case 2:
                e_3 = _a.sent();
                console.log('Error reaching database');
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.clearOldLogs = clearOldLogs;
