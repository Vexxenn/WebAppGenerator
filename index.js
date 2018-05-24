var express = require("express");
var app = express();
var fs = require('fs');
var mustache = require('mustache');
var del = require('del');
var childProcess = require('child_process');
var serverGenerator = require("./Server/server.js");
var classGenerator = require("./Models/generate-class.js");
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded());
app.use(express.static('public'));


app.post('/generate', function (req, res) {

    serverGenerator.GenerateServer();
    res.redirect("http://localhost:8081/");
});




var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
});

