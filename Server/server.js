var fs = require('fs');
var del = require('del');
var childProcess = require('child_process');
var mustache = require('mustache');
var bodyParser = require("body-parser");
var classGenerator = require("../Models/generate-class.js");
var databaseGenerator = require("../Models/Database/generate-database.js");


function generateServer(){
    del(['Publish']).then(paths => {
        fs.mkdir('Publish',function() {
            fs.appendFile('./Publish/Public/index.html', '<h1>IT WORKS</h1>' ,function(err){
                if (err) throw err;
            });
        });
        fs.mkdir('./Publish/Controllers',function() {});
        fs.mkdir('./Publish/Models',function() {
            fs.readFile('./Server/config.json', function (err, content) {
                if (err) throw err;
                var confFile = JSON.parse(content);
                for (var i = 0; i < confFile.models.length; i++) {
                    fs.readFile(confFile.models[i].path, function(err, content){
                        classGenerator.GenerateClass(content);
                    });
                }
            });
        });
        fs.mkdir('./Publish/Public',function() {});
        fs.mkdir('./Publish/Public/Css',function() {});
        fs.mkdir('./Publish/Public/Images',function() {});
        fs.mkdir('./Publish/Public/Js',function() {});
        fs.mkdir('./Publish/Views',function() {});
        fs.mkdir('./Publish/Database',function() {});

        fs.readFile('./Server/config.json', function(err, content){
            if (err) throw err;
            var confFile = JSON.parse(content);
            for(var i = 0; confFile.staticFiles.length > i; i++){
                var destinationPath = confFile.staticFiles[i].destinationPath;
                fs.readFile(confFile.staticFiles[i].originalPath, function(err, content){
                    var fileContent = content;
                    fs.writeFile(destinationPath, fileContent, function(){});
                });
            }
            var modelList = [];
            for(var i = 0; confFile.models.length > i; i++){
                modelList.push({classTitle : confFile.models[i].name, path : '\'../Models/' + confFile.models[i].name + '.js\''});
            }
            var objMustache = {
                models : modelList
            };
            fs.readFile('./Models/controller.mustache', function (err, data) {
                var output = mustache.render(data.toString(), objMustache);
                fs.writeFile('./Publish/Controllers/Api.js', output, function (err) {
                    if (err) throw err;
                });
            });
            fs.readFile('./Server/back-office.mustache', function(err, data){
                console.log(data.toString());
                console.log(objMustache);
                var output = mustache.render(data.toString(), objMustache);
                fs.writeFile('./Publish/Controllers/backoffice.js', output, function(err){
                    if(err) throw err;
                });
            });
            fs.readFile('./Server/front-office.mustache', function(err, data){
                var output = mustache.render(data.toString(), {});
                fs.writeFile('./Publish/Controllers/frontoffice.js', output, function(err,data){
                    if(err) throw err;
                });
            });
            
        });

        fs.readFile('./Server/server.mustache', function(err,data) {
            var serverInfo;
            fs.readFile("./Server/config.json", function(err, content) {
                if (err) {
                    console.log(err);
                };
                var jsonInfo = JSON.parse(content);
                serverInfo = {
                    port: jsonInfo.port,
                    module: jsonInfo.modules.module1
                };
                var output = mustache.render(data.toString(), serverInfo);
                fs.writeFile('./Publish/index.js',output, function(){
                    childProcess.fork('./Publish/index.js');
                })
                databaseGenerator.GenerateDataBase("./Server/config.json");
            }); 
        });
    });
}

module.exports.GenerateServer = generateServer;