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
var CronJob = require('cron').CronJob;
var mongoose = require('mongoose');
var packageJson = require('../../package.json');
var logger_1 = require("@penny/logger");
var scribe_1 = require("@penny/scribe");
var closeExpiringPositions_1 = require("./core/closeExpiringPositions");
var saveAndPurchase_1 = require("./core/saveAndPurchase");
var cronFunc = function (func, cronName) { return __awaiter(void 0, void 0, void 0, function () {
    var e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, func()];
            case 1:
                _a.sent();
                (0, logger_1.logCron)(cronName, true);
                return [3 /*break*/, 3];
            case 2:
                e_1 = _a.sent();
                (0, logger_1.logCron)(cronName, false, e_1.toString());
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
var launchCrons = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        (0, logger_1.log)('StartingCrons');
        new CronJob('0 0 * * * *', function () {
            (0, logger_1.log)({
                type: 'ping',
                message: 'Checking In'
            });
        }, null, true, 'America/New_York');
        new CronJob('0 */15 * * * 1-5', scribe_1.saveAllData, null, true, 'America/New_York');
        new CronJob('0 50 9 * * 1-5', function () { return cronFunc(saveAndPurchase_1.saveAndPurchase, 'RNS Init'); }, null, true, 'America/New_York');
        // One hour before Tradier does it
        new CronJob('0 15 14 * * 1-5', function () { return cronFunc(closeExpiringPositions_1.closeExpiringPositions, 'CloseExp'); }, null, true, 'America/New_York');
        // Run every day at 4:10 NY time
        // 10 mins after market close
        new CronJob('0 10 16 * * *', function () { return cronFunc(logger_1.clearOldLogs, 'Housekeeping'); }, null, true, 'America/New_York');
        // For deploy script checking
        console.log('Deployment successful RNS');
        console.log(packageJson.version);
        return [2 /*return*/];
    });
}); };
// Recursively continuously try until the damn thing decides to work
var connectToDB = function () {
    console.log('Connecting to Database');
    mongoose.connect(process.env.CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true }, function (err) {
        if (err) {
            // Not much choice in logging to a database we can't connect to
            console.log('Database Connection Failure - Trying Again');
            connectToDB();
            return;
        }
        (0, logger_1.log)({
            message: 'Connection Established'
        });
        launchCrons();
    });
};
connectToDB();
