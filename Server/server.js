var fs = require('fs');
var del = require('del');
var childProcess = require('child_process');
var mustache = require('mustache');
var bodyParser = require("body-parser");
var classGenerator = require("../Models/generate-class.js");
var databaseGenerator = require("../Models/Database/generate-database.js");



/**
 * This function's main objective is to generate the Publish folder and all its sub-folders that will contain all the parts of the 
 * auto-generated website. This function mainlly relys on the use of generators (the classGenerator and the databaseGenerator) that 
 * will generate the database and necessary classes based on the config.json file that is included in the project.
 * @param {String} cssStyle - The CSS file picked by the user to be displayed on the generated website
 */
function generateServer(cssStyle){
    del(['Publish']).then(paths => {
        fs.mkdirSync('Publish',function() {
            fs.appendFile('./Publish/Public/index.html', '<h1>IT WORKS</h1>' ,function(err){
                if (err) throw err;
            });
        });
        fs.mkdirSync('./Publish/Controllers',function() {});
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
            for(let i = 0; confFile.staticFiles.length > i; i++){
                let destinationPath = confFile.staticFiles[i].destinationPath;
                fs.readFile(confFile.staticFiles[i].originalPath, function(err, content){
                    let fileContent = content;
                    fs.writeFile(destinationPath, fileContent, function(err){
                        if(err) throw err;
                    });
                });
            }
            
            fs.readFile(cssStyle, function(err, content){
                if (err) throw err;
                let fileContent = content;
                console.log(decodeURIComponent(escape(content)))
                fs.writeFile('./Publish/Public/Css/style.css', fileContent, function(err){
                    if(err) throw err;
                });
            });


            for(let i = 0; confFile.models.length > i; i++){
                fs.readFile(confFile.models[i].path, function(err, content){
                    
                    let modelSchema = {
                        Schema : decodeURIComponent(escape(content))
                    }
                    fs.readFile('./Models/Schemas/schema-converter.mustache',function(err, data){
                        let output = mustache.render(data.toString(), modelSchema);
                        fs.writeFile('./Publish/Models/' + confFile.models[i].name + '-schema.js', output, function(err){
                            if (err) throw err;
                        });
                    });
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
                var output = mustache.render(data.toString(), objMustache);
                fs.writeFile('./Publish/Controllers/backoffice.js', output, function(err){
                    if(err) throw err;
                });
            });
            fs.readFile('./Server/front-office.mustache', function(err, data){
                var frontOfficeObj = {
                    model: confFile.frontoffice.model,
                    property: confFile.frontoffice.property,
                    order: confFile.frontoffice.order,
                    limit: confFile.frontoffice.limit
                }
                var output = mustache.render(data.toString(), frontOfficeObj);
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