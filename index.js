var express = require("express");
var app = express();
var fs = require('fs');
var mustache = require('mustache');
var serverGenerator = require("./Server/server.js");
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded());
app.use(express.static('public'));
app.use(express.static(__dirname + '/Static'));


app.post('/generate', function (req, res) {
    console.log(req.body.styleCss)
    serverGenerator.GenerateServer(req.body.styleCss);
    res.redirect("http://localhost:8081/");
});


app.post('/generateSchema', function(req, res){
    var properties = [];
    var required = "";
    var bodyInfo = req.body;
    var requiredArrayAux = [];
    var relations = [];
    for(let i = 0; i< bodyInfo.textBox.length; i++){
        properties.push({
            name: bodyInfo.textBox[i],
            type: "type: " + bodyInfo.typeDropDown[i],
            minRestriction: bodyInfo.typeDropDown[i] == "string" ? "\"minLenght\": \"" + bodyInfo.minValue[i] + "\"" : "\"min\": \"" + bodyInfo.minValue[i] + "\"",
            maxRestriction: bodyInfo.typeDropDown[i] == "string" ? "\"maxLenght\": \"" + bodyInfo.maxValue[i] + "\"" : "\"max\": \"" + bodyInfo.maxValue[i] + "\"",
            unique: false,
            comma: i != bodyInfo.textBox.length-1 ? ",": ""
        });
        if(bodyInfo.requiredCheckbox[i] == "Required")
            requiredArrayAux.push(bodyInfo.textBox[i]); 
    } 
    for(let i = 0; i < requiredArrayAux.length; i++){
        required += "\"" + requiredArrayAux[i] + "\"",
        i != requiredArrayAux.length-1 ? required += ", " : required +="";
    }
    for(let i = 0; i < bodyInfo.relationName.length; i++){
        relations.push({
            name: bodyInfo.relationName[i],
            relation: bodyInfo.relationType[i],
            label: bodyInfo.relationLabel[i],
            comma: i != bodyInfo.relationName.length-1 ? ",":""
        })
    }
    var mustacheObj = {
        title: bodyInfo.title,
        type: "object",
        properties: properties,
        required: required,
        references: relations
    }
    fs.readFile('Models/Schemas/schema.mustache',function(err, data){
        if(err) throw err;
        let output = mustache.render(data.toString(), mustacheObj);
        fs.writeFile('Models/Schemas/' + mustacheObj.title + 'Schema.json', output, function(err){
            if (err) throw err;
        });
    });
    res.redirect("http://localhost:8081/");
})


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

