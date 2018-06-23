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
app.use(express.static(__dirname + '/Static'));


app.post('/generate', function (req, res) {
    console.log(req.body.styleCss)
    serverGenerator.GenerateServer(req.body.styleCss);
    res.redirect("http://localhost:8081/");
});




var server = app.listen(8081, function () {

    fs.readFile('Server/config.json', function(err, content){
        if (err) throw err;
        var confFile = JSON.parse(content);
        let mustacheObj = {
            options : []
        }
        for(let i = 0; confFile.cssFiles.length > i; i++){
            mustacheObj.options.push({path: confFile.cssFiles[i].path, name : confFile.cssFiles[i].style});
        }
        
        fs.readFile('public/index.mustache',function(err, data){
            let output = mustache.render(data.toString(), mustacheObj);
            fs.writeFile('public/index.html', output, function(err){
                if (err) throw err;
            });
        });
    });
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
});

