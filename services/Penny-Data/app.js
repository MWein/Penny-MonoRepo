"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
var pennyStatus_1 = require("./controllers/pennyStatus");
var getLogs_1 = require("./controllers/getLogs");
var settings_1 = require("./controllers/settings");
var showcase_1 = require("./controllers/showcase");
var getCronTimes_1 = require("./controllers/getCronTimes");
var nukeController_1 = require("./controllers/nukeController");
var app = express();
app.use(bodyParser.json());
app.use(cors());
// Status endpoint that checks the last action by Penny via the logs database
app.get('/penny-status', pennyStatus_1.pennyStatusController);
// Endpoint for the UI showcase page
app.get('/showcase', showcase_1.showcaseController);
// Dump all logs from the database
app.get('/logs', getLogs_1.getLogsController);
// Get the latest cron run times
app.get('/cron-times', getCronTimes_1.getCronTimesController);
// Settings
app.get('/settings', settings_1.getSettingsController);
app.put('/settings', settings_1.setSettingsController);
// Nuke
app.post('/nuke', nukeController_1.nukeController);
// Income target endpoints
// TODO Am I ever going to use this again?
//app.get('/income-targets', getIncomeTargetsController)
//app.post('/income-targets', createIncomeTargetController)
exports.default = app;
