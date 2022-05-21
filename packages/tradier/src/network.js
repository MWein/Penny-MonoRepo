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
exports.deleteReq = exports.put = exports.post = exports.get = exports.createFormString = exports.wait = void 0;
var superagent = require('superagent');
var sleepUtil = require("@penny/sleep");
// Throttle
var wait = function (throttle) { return __awaiter(void 0, void 0, void 0, function () {
    var throttleTime;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!throttle) return [3 /*break*/, 2];
                throttleTime = process.env.BASEPATH.includes('sandbox') ? 1.2 : 0.7;
                return [4 /*yield*/, sleepUtil.sleep(throttleTime)];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2: return [2 /*return*/];
        }
    });
}); };
exports.wait = wait;
// Generate form string from object
// Superagent doesn't handle this without multiple sends
var createFormString = function (body) {
    return Object.keys(body).map(function (key) {
        var value = body[key];
        var formattedValue = Array.isArray(value) ? value.join(',') : value;
        return "".concat(key, "=").concat(formattedValue);
    }).join('&');
};
exports.createFormString = createFormString;
var get = function (path, throttle) {
    if (throttle === void 0) { throttle = true; }
    return __awaiter(void 0, void 0, void 0, function () {
        var url, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, exports.wait)(throttle)];
                case 1:
                    _a.sent();
                    url = "".concat(process.env.BASEPATH).concat(path);
                    return [4 /*yield*/, superagent.get(url)
                            .set('Authorization', "Bearer ".concat(process.env.APIKEY))
                            .set('Accept', 'application/json')
                            .timeout({
                            response: 5000
                        })
                            .retry(5)];
                case 2:
                    response = _a.sent();
                    return [2 /*return*/, response.body];
            }
        });
    });
};
exports.get = get;
var post = function (path, body, throttle) {
    if (throttle === void 0) { throttle = true; }
    return __awaiter(void 0, void 0, void 0, function () {
        var url, formString, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, exports.wait)(throttle)];
                case 1:
                    _a.sent();
                    url = "".concat(process.env.BASEPATH).concat(path);
                    formString = (0, exports.createFormString)(body);
                    return [4 /*yield*/, superagent.post(url)
                            .set('Authorization', "Bearer ".concat(process.env.APIKEY))
                            .set('Accept', 'application/json')
                            .send(formString)
                            .timeout({
                            response: 10000
                        })];
                case 2:
                    response = _a.sent();
                    return [2 /*return*/, response.body];
            }
        });
    });
};
exports.post = post;
var put = function (path, body, throttle) {
    if (throttle === void 0) { throttle = true; }
    return __awaiter(void 0, void 0, void 0, function () {
        var url, formString, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, exports.wait)(throttle)];
                case 1:
                    _a.sent();
                    url = "".concat(process.env.BASEPATH).concat(path);
                    formString = (0, exports.createFormString)(body);
                    return [4 /*yield*/, superagent.put(url)
                            .set('Authorization', "Bearer ".concat(process.env.APIKEY))
                            .set('Accept', 'application/json')
                            .send(formString)
                            .timeout({
                            response: 10000
                        })
                            .retry(5)];
                case 2:
                    response = _a.sent();
                    return [2 /*return*/, response.body];
            }
        });
    });
};
exports.put = put;
var deleteReq = function (path, throttle) {
    if (throttle === void 0) { throttle = true; }
    return __awaiter(void 0, void 0, void 0, function () {
        var url, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, exports.wait)(throttle)];
                case 1:
                    _a.sent();
                    url = "".concat(process.env.BASEPATH).concat(path);
                    return [4 /*yield*/, superagent.delete(url)
                            .set('Authorization', "Bearer ".concat(process.env.APIKEY))
                            .set('Accept', 'application/json')
                            .timeout({
                            response: 5000
                        })
                            .retry(5)];
                case 2:
                    response = _a.sent();
                    return [2 /*return*/, response.body];
            }
        });
    });
};
exports.deleteReq = deleteReq;
