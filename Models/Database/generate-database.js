var fs = require('fs');
var mustache = require('mustache');
var del = require('del');
var childProcess = require('child_process');
var bodyParser = require("body-parser");
var sqlite3 = require('sqlite3').verbose();

function generate(schema) {
    fs.readFile(schema, function (err, content) {
        if (err) throw err;
        var confFile = JSON.parse(content);
        var db = new sqlite3.Database("./Publish/Models/" + confFile.dbname);
        var dbQuerys = [];
        var tableRelations = [];
        var modelList = generateCheckIsDone(confFile.models);
        for (var i = 0; i < confFile.models.length; i++) {
            run(confFile.models[i].path, db, modelList, tableRelations, dbQuerys);
        }
    });
}


function run(path, db, modelList, tableRelations, dbQuerys) {
    fs.readFile(path, function (err, content) {
        if (err) throw err;
        var object = JSON.parse(content);
        var objectProperties = Object.keys(object.properties);
        var tableProperties = "";
        tableProperties += object.title + "_id " + "INTEGER PRIMARY KEY,\n";
        for (var i = 0; i < objectProperties.length; i++) {
            tableProperties += objectProperties[i] + " " + checkType(object.properties[objectProperties[i]].type) + ""
                + checkRequiered(objectProperties[i], object.required) + "" + isUnique(object.properties[objectProperties[i]].unique);
            i == objectProperties.length - 1 ? tableProperties += "\n" : tableProperties += ",\n";
        }

        if (object.references != undefined) {
            generateRelationObject(object, tableRelations);
        }

        var mustacheObject = {
            tableName: object.title + "s",
            tableProperties: tableProperties
        };

        fs.readFile('./Models/Database/create-table.mustache', function (err, content) {
            if (err) throw err;
            var output = mustache.render(content.toString(), mustacheObject);
            dbQuerys.push(output);
            var position = getModelPosition(modelList, object.title);
            modelList[position].isDone = true;
            if (checkIfAllTrue(modelList)) {
                generateRelations(tableRelations, db, dbQuerys);
            }
        });
    });
}



function checkCompleted(tableRelations, db, dbQuerys) {
    if(checkIfAllTrue(tableRelations)){
        db.serialize(function () {
            for (var i = 0; i < dbQuerys.length; i++) {
                db.run(dbQuerys[i]);
            }   
        });
        db.close();
    }
}

function generateRelationObject(schema, relationObjects) {
    var referencesList = schema.references;
    for (var i = 0; i < referencesList.length; i++) {
        if (schema.references[i].relation != "M-M") {
            relationObjects.push({ primaryTable: schema.title, secondaryTable: referencesList[i].model, relationType: referencesList[i].relation, primaryKey: referencesList[i].model + "_id", isDone : false })
        } else {
            var tableName = [schema.title, referencesList[i].model];
            tableName.sort();
            relationObjects.push({
                primaryTable: tableName[0] + "_" + tableName[1], relationType: referencesList[i].relation,
                table1PrimaryKey: referencesList[i].model, table2PrimaryKey: schema.title, isDone : false
            })
        }
    }
}

function generateRelations(relationList, db, dbQuerys) {
    var currentValue;
    var sqlCommand = "";
    for (var i = 0; i < relationList.length; i++) {
        if (relationList[i].relationType != "M-M") {
            sqlCommand = "ALTER TABLE " + relationList[i].primaryTable + "s ADD COLUMN " + relationList[i].primaryKey + " INTEGER REFERENCES " + relationList[i].secondaryTable +
                "s (" + relationList[i].primaryKey + ");";
            dbQuerys.push(sqlCommand);
            relationList[i].isDone = true;
            checkCompleted(relationList, db, dbQuerys);
        } else {
            currentValue = relationList[i];
            var x = i;
            fs.readFile('./Models/Database/create-table.mustache', function (err, content) {
                if (err) throw err;
                var mustacheObject = {
                    tableName: relationList[x].primaryTable,
                    tableProperties: relationList[x].table1PrimaryKey + "_id" + " INTEGER NOT NULL,\n" + relationList[x].table2PrimaryKey + "_id" + " INTEGER NOT NULL,\n" +
                        "FOREIGN KEY (" + relationList[x].table1PrimaryKey + "_id) REFERENCES " + relationList[x].table1PrimaryKey + "s" + " (" + relationList[x].table1PrimaryKey + "_id),\n" +
                        "FOREIGN KEY (" + relationList[x].table2PrimaryKey + "_id) REFERENCES " + relationList[x].table2PrimaryKey + "s" + " (" + relationList[x].table2PrimaryKey + "_id)\n"
                };
                sqlCommand = mustache.render(content.toString(), mustacheObject);
                dbQuerys.push(sqlCommand);
                relationList[x].isDone = true;
                checkCompleted(relationList, db, dbQuerys);
            });
        }

    }
}

function generateCheckIsDone(models) {
    var modelList = [];
    for (var i = 0; i < models.length; i++) {
        modelList.push({ name: models[i].name, isDone: false });
    }
    return modelList;
}

function getModelPosition(models, name) {
    for (var i = 0; i < models.length; i++) {
        if (models[i].name == name) {
            return i;
        }
    }
}

function checkIfAllTrue(modelList) {
    var arrayAux = [];
    for (var i = 0; i < modelList.length; i++) {
        arrayAux.push(modelList[i].isDone);
    }
    return arrayAux.every(function (value) { if (value) { return true } return false });
}

function checkType(propertie) {
    switch (propertie) {
        case "number":
            return " INTEGER";
            break;
        case "integer":
            return " INTEGER";
            break;
        default:
            return " TEXT";
    }
}

function checkRequiered(element, requiredList) {
    if (requiredList.indexOf(element) != -1) {
        return " NOT NULL";
    }
    return "";
}

function isUnique(element) {
    if (element == true) {
        return " UNIQUE";
    }
    return "";
}


module.exports.GenerateDataBase = generate;