var fs = require('fs');
var mustache = require('mustache');
var bodyParser = require("body-parser");

function generateClass(schema) {
    var object = JSON.parse(schema);
    var objectProperties = Object.keys(object.properties);
    var title = object.title;
    var properties = objectProperties.join();
    var nonEnumerable = [];
    var requiredProperties = object.required;
    

    var constructor = function () {
        var constructorProperties = "";
        for (var i = 0; i < objectProperties.length; i++) {
            if (requiredProperties.indexOf(objectProperties[i]) != -1) {
                constructorProperties += "this." + objectProperties[i] + "=" + objectProperties[i] + ";";
            } else {
                nonEnumerable.push(objectProperties[i]);
            }
        }
        return constructorProperties;
    };
    var defineNonEnumerable = function () {
        var nonEnumprops = "";
        for (var i = 0; i < nonEnumerable.length; i++) {
            nonEnumprops += "Object.defineProperty(this,\'" + nonEnumerable[i] + "\',{value:" + nonEnumerable[i] + ", enumerable: false, writable: true, configurable: true});\n"
        }
        if(object.references != null){
            for(var i = 0; i < object.references.length; i++){
                if(object.references[i].relation == "1-M"){
                    nonEnumprops += "Object.defineProperty(this,\'" + object.references[i].model + "_id" + "\',{enumerable: false, writable: true, configurable: true});\n"
                }
            }
        }
        nonEnumprops += "Object.defineProperty(this,\'" + title + "_id" + "\',{enumerable: false, writable: true, configurable: true});\n"
        return nonEnumprops;
    }
    var requiredValues = function() {
        var values = "[";
        for(var i = 0; i < objectProperties.length; i++){
            values += "this." + objectProperties[i];
            i == objectProperties.length - 1 ? values += "]" : values += ", ";
        }
        return values;
    }
    var requiredValuesInsert = function(){
        var formatedValues = "";
        for (var i = 0; i < objectProperties.length; i++) {
            formatedValues += "?";
            i == objectProperties.length - 1 ? formatedValues += "" : formatedValues += ", ";
        }
        return formatedValues;
    }
    var requiredValuesUpdate = function(){
        var formatedValues = "";
        for (var i = 0; i < objectProperties.length; i++) {
            formatedValues += objectProperties[i] + " = ?";
            i == objectProperties.length - 1 ? formatedValues += "" : formatedValues += ", ";
        }
        return formatedValues;
    }
    var objectMapping = function(){
        var dbMapping = "";
        for(var i = 0; i < objectProperties.length; i++){
            dbMapping += objectProperties[i] + ":\'" + objectProperties[i] + "\'";
            i == objectProperties.length - 1 ? dbMapping += "," + title + "_id:\'" + title + "_id\'" : dbMapping += ", ";
        }
        return dbMapping;
    } 
    var classInfo = {
        classTitle: title,
        classProperties: properties,
        classConstructor: constructor,
        nonEnumProps: defineNonEnumerable,
        values : requiredValues,
        insertValues : requiredValuesInsert,
        updateValues : requiredValuesUpdate,
        primaryKey: title + "_id",
        mappingDBtoObject : objectMapping
    };

    fs.readFile('./Models/class.mustache', function (err, data) {
        var output = mustache.render(data.toString(), classInfo);
        fs.appendFile('./Publish/Models/' + classInfo.classTitle + '.js', '', function (err) {
            if (err) throw err;
            console.log('Saved!');
        });
        var path = "./Publish/Models/" + classInfo.classTitle + ".js";
        fs.writeFile(path, output, function () {
        })
    });
}

module.exports.GenerateClass = generateClass;
