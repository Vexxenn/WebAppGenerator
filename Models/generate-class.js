var fs = require('fs');
var mustache = require('mustache');
var bodyParser = require("body-parser");

/**
 * This function's main objective is to generate the various classcontained in the schema parameter. This schema contains all the inforamtion
 * of one class. The function mainly creates a couple of strings that will later on be passed to an mustache template that will create the class.
 * @param {String} schema - The schema content that contains all the required information to create the class
 */
function generateClass(schema) {
    var object = JSON.parse(schema);
    var objectProperties = Object.keys(object.properties);
    var title = object.title;
    var nonEnumerable = [];
    var requiredProperties = object.required;
    var propsAndReferences = objectProperties;
    

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
    if(object.references != null){
        var modelReferences = [];
        for(let i = 0; i < object.references.length; i++){
            if(object.references[i].relation == "1-M"){
                modelReferences.push(object.references[i].model + "_id");
            }
        }
        propsAndReferences = propsAndReferences.concat(modelReferences);
    }
    var requiredValues = function() {
        var values = "[";
        for(var i = 0; i < propsAndReferences.length; i++){
            values += "this." + propsAndReferences[i];
            i == propsAndReferences.length - 1 ? values += ",this." + title + "_id]" : values += ", ";
        }
        return values;
    }
    var requiredValuesInsert = function(){
        var formatedValues = "";
        for (var i = 0; i < propsAndReferences.length; i++) {
            formatedValues += "?";
            i == propsAndReferences.length - 1 ? formatedValues += "" : formatedValues += ", ";
        }
        return formatedValues;
    }
    var requiredValuesUpdate = function(){
        var formatedValues = "";
        for (var i = 0; i < propsAndReferences.length; i++) {
            formatedValues += propsAndReferences[i] + " = ?";
            i == propsAndReferences.length - 1 ? formatedValues += "" : formatedValues += ", ";
        }
        return formatedValues;
    }
    var objectMapping = function(){
        var dbMapping = "";
        for(var i = 0; i < propsAndReferences.length; i++){
            dbMapping += propsAndReferences[i] + ":\'" + propsAndReferences[i] + "\'";
            i == propsAndReferences.length - 1 ? dbMapping += "," + title + "_id:\'" + title + "_id\'" : dbMapping += ", ";
        }
        return dbMapping;
    } 
    var classInfo = {
        classTitle: title,
        classProperties: propsAndReferences,
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
