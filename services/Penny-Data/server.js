"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = require("./app");
var mongoose = require("mongoose");
var port = 3001;
// Recursively continuously try until the damn thing decides to work
var connectToDB = function () {
    console.log('Connecting to Database');
    mongoose.connect(process.env.CONNECTION_STRING, null, function (err) {
        if (err) {
            // Not much choice in logging to a database we can't connect to
            console.log('Database Connection Failure - Trying Again');
            connectToDB();
            return;
        }
        console.log('Connection Established');
        app_1.default.listen(port, function () {
            console.log("Listening on Port ".concat(port));
        });
    });
};
connectToDB();
