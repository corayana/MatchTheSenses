// express und http Module importieren. Sie sind dazu da, die HTML-Dateien aus dem Ordner "public" zu veröffentlichen.
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var port = 3000;

// Starten des Webservers
server.listen(port, function () {
console.log('Webserver läuft und hört auf Port %d', port);
});

// Öffentliche HTML-Dateien aus Ordner "public"
app.use(express.static(__dirname + '/public'));

// Start: node server.js --> http://localhost:3000/game.html