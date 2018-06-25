var fs = require('fs');
var mustache = require('mustache');
var del = require('del');
var childProcess = require('child_process');
var bodyParser = require("body-parser");
var sqlite3 = require('sqlite3').verbose();

/**
 * This functions recieves the path to the JSON file that contains the path to the schemas, this schemas will then be precessed on at a time
 * to create theyr respective tables on the database.
 * @param {String} schema - Path to the config.json file
 */
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

/**
 * This function will read the json schema for each elemente in the config.json and create the respective table in the database. It recieves 
 * the modelList, tableRelatios and dbQuerys in order to keep track of all the models that have been processed and having all the querys in one array
 * in order to run them all the same time (this also allows the querys to have the correct order of execution).
 * @param {String} path - The path to the model schema.
 * @param {any} db - The variable that contains the sqlite module.
 * @param {List} tableRelations - The array that contains all the objects that will eventually generate relation querys
 * @param {List} dbQuerys - The array that contains all the querys
 * 
 */
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
/**
 * This function is used to run all the querys in the database. This function is only used when all the querys have created and are ordered, this stops the possibility
 * of running querys that depende on other tables.
 * @param {List} tableRelations - Array that contains all the objects that control if the query have been created.
 * @param {any} db - The variable that contains the sqlite module.
 * @param {List} dbQuerys - Array that will contain all the querys that will be porcessed.
 */
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
/**
 * This function is used to generate the objects that will contain all the information requiered to create the constraint querys. It also has a bool
 * to control if the object as been processed and it's query been created.
 * @param {any} schema - The current schema beeing analysed.
 * @param {List} relationObjects - Array that will contain all the objects that have the information to generate the querys.
 */
function generateRelationObject(schema, relationObjects) {
    var referencesList = schema.references;
    for (var i = 0; i < referencesList.length; i++) {
        if (schema.references[i].relation != "M-M") {
            relationObjects.push({ primaryTable: schema.title, secondaryTable: referencesList[i].model, relationType: referencesList[i].relation, primaryKey: referencesList[i].model + "_id", isDone : false })
        } else {
            var tableName = [schema.title, referencesList[i].model];
            tableName.sort();
            var foreginKeyOrder = [referencesList[i].model, schema.title]
            foreginKeyOrder.sort();
            relationObjects.push({
                primaryTable: tableName[0] + "_" + tableName[1], relationType: referencesList[i].relation,
                table1PrimaryKey: foreginKeyOrder[0], table2PrimaryKey: foreginKeyOrder[1], isDone : false
            })
        }
    }
}
/**
 * This function is used to create the querys for the database that will create the foreign key constraints, this only happens in the 1-M relationship
 * other wise it will create a new table to manage the relationship between the tables. The information required for this is contained in the relationList array
 * that contains all the information related to this querys and has a bool to control if the creation of the query has been completed.
 * @param {List} relationList - The array that contains all the objects with the necessary information to create the querys.
 * @param {any} db - The variable that contains the sqlite module.
 * @param {List} dbQuerys - The array that contains all the database querys.
 * 
 */
function generateRelations(relationList, db, dbQuerys) {
    var sqlCommand = "";
    for (var i = 0; i < relationList.length; i++) {
        if (relationList[i].relationType != "M-M") {
            sqlCommand = "ALTER TABLE " + relationList[i].primaryTable + "s ADD COLUMN " + relationList[i].primaryKey + " INTEGER REFERENCES " + relationList[i].secondaryTable +
                "s (" + relationList[i].primaryKey + ");";
            dbQuerys.push(sqlCommand);
            relationList[i].isDone = true;
            checkCompleted(relationList, db, dbQuerys);
        } else {
            let x = i;
            fs.readFile('./Models/Database/create-table.mustache', function (err, content) {
                if (err) throw err;
                var mustacheObject = {
                    tableName: relationList[x].primaryTable,
                    tableProperties: relationList[x].table1PrimaryKey + "_id" + " INTEGER NOT NULL,\n" + relationList[x].table2PrimaryKey + "_id" + " INTEGER NOT NULL,\n" +
                        "FOREIGN KEY (" + relationList[x].table1PrimaryKey + "_id) REFERENCES " + relationList[x].table1PrimaryKey + "s" + " (" + relationList[x].table1PrimaryKey + "_id),\n" +
                        "FOREIGN KEY (" + relationList[x].table2PrimaryKey + "_id) REFERENCES " + relationList[x].table2PrimaryKey + "s" + " (" + relationList[x].table2PrimaryKey + "_id)\n"
                };
                console.log(mustacheObject);
                sqlCommand = mustache.render(content.toString(), mustacheObject);
                dbQuerys.push(sqlCommand);
                relationList[x].isDone = true;
                checkCompleted(relationList, db, dbQuerys);
            });
        }

    }
}
/**
 * This function creates an object containing the name of a model and a boolean that will be used to check if the model by the same as been processed.
 * This is used in order to avoid trying to create Foreign keys with tables that have not yet been created in the database
 * @param {List} models - List containing all the models that will be processed in the creation of the database.
 */
function generateCheckIsDone(models) {
    var modelList = [];
    for (var i = 0; i < models.length; i++) {
        modelList.push({ name: models[i].name, isDone: false });
    }
    return modelList;
}
/**
 * This function is used to get the position of a model that as been processed.
 * @param {String} models - List of all models.
 * @param {String} name - String representing the model that we want to check the position.
 * 
 */
function getModelPosition(models, name) {
    for (var i = 0; i < models.length; i++) {
        if (models[i].name == name) {
            return i;
        }
    }
}
/**
 * This function is used in order to only allow the program do advance to the next state if all object contained in the array have been processed.
 * It's a required function in order to ensure that all the models have been processed before going to the next phase to avoid create foreign key constraints
 * with tables that don't actually existe in the database.
 * @param {List} modelList - List of objects containing information if they have been processed or not.
 */
function checkIfAllTrue(modelList) {
    var arrayAux = [];
    for (var i = 0; i < modelList.length; i++) {
        arrayAux.push(modelList[i].isDone);
    }
    return arrayAux.every(function (value) { if (value) { return true } return false });
}
/**
 * This function is used to help in the creation of the table, checking what type the current element should be in the table.
 * @param {String} propertie - Object property indicating what type the element should be.
 */
function checkType(propertie) {
    switch (propertie) {
        case "number":
            return " INTEGER";
        case "integer":
            return " INTEGER";
        default:
            return " TEXT";
    }
}
/**
 * This function is used to help in the creation of the table, checking if the element in question is required in the creation of the element
 * that will populate this row.
 * @param {String} element - Object property indicating if the element in question is required when inserting information on the table
 * @param {List} requiredList - List containing all the required properties for the curretn table
 * 
 */
function checkRequiered(element, requiredList) {
    if (requiredList.indexOf(element) != -1) {
        return " NOT NULL";
    }
    return "";
}
/**
 * This function is used to help in the creation of the table, checking if the element that will be on the table should be unique or not.
 * @param {boolean} element - Object property that represents if the row should be unique or not.
 */
function isUnique(element) {
    if (element == true) {
        return " UNIQUE";
    }
    return "";
}


module.exports.GenerateDataBase = generate;