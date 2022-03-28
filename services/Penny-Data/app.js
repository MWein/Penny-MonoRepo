"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config({ path: '../../.env' });
var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
var pennyStatus_1 = require("./controllers/pennyStatus");
var getLogs_1 = require("./controllers/getLogs");
//import { getGainLossController, getGainLossGraphController } from './controllers/gainLoss'
var settings_1 = require("./controllers/settings");
//import { getWatchlistController } from './controllers/watchlist'
//import { getIncomeTargetsController, createIncomeTargetController } from './controllers/incomeTargets'
//import { premiumEarnedController, premiumGraphController } from './controllers/premiumHistory'
var app = express();
app.use(bodyParser.json());
app.use(cors());
// Status endpoint that checks the last action by Penny via the logs database
app.get('/penny-status', pennyStatus_1.pennyStatusController);
// Watchlist Endpoints
//app.get('/watchlist', getWatchlistController)
// Dump all logs from the database
app.get('/logs', getLogs_1.getLogsController);
//app.get('/gain-loss', getGainLossController)
//app.get('/gain-loss-graph', getGainLossGraphController)
//app.get('/premium-earned', premiumEarnedController)
//app.get('/premium-graph', premiumGraphController)
// Settings
app.get('/settings', settings_1.getSettingsController);
app.put('/settings', settings_1.setSettingsController);
// Income target endpoints
//app.get('/income-targets', getIncomeTargetsController)
//app.post('/income-targets', createIncomeTargetController)
exports.default = app;
