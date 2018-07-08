function Type (name,description) 
{
    this.name=name;this.description=description;
    Object.defineProperty(this,'Type_id',{enumerable: false, writable: true, configurable: true});

}
var database = require("../Database/sqlite.js")("../Publish/Database/labs.db");
var TypeSchema = require("../Models/Type-schema");

Type.all = function (callback) {
    database.all("SELECT * FROM Types", Type, callback);
}

Type.get = function (id, callback) {
    database.get("SELECT * FROM Types WHERE Type_id = ?", [id], Type, callback);
}

Type.many = function(model, id, callback){
    let tablerOrder = ["Type", `${model}`];
    tablerOrder.sort();
    tablerOrder = tablerOrder.join('_');
    database.where("SELECT Types.* FROM Types INNER JOIN " + tablerOrder + " ON " + tablerOrder + ".Type_id="+
    "Types.Type_id WHERE " + tablerOrder + `.${model}`+"_id = ?", [id], Type, callback);
}

Type.prototype.save = function (checkboxValues, callback) {
    if(this.Type_id) {
        if(TypeSchema.references){
            var relationMToM = function(){
                for(let i = 0; i < TypeSchema.references.length; i++){
                    if(TypeSchema.references[i].relation == "M-M"){
                        return TypeSchema.references[i].model;
                    }
                }
            }
            var tablerOrder = ["Type", relationMToM()];
            tablerOrder.sort();
            tablerOrder = tablerOrder.join('_');
            
            var currentId = this.Type_id;
            database.run("DELETE FROM " + tablerOrder + " WHERE Type_id = ?", [this.Type_id], function(){
                if(checkboxValues){
                    if(checkboxValues.length == 1)
                    checkboxValues = [checkboxValues];
                    for(let i = 0; i < checkboxValues.length; i++){
                        if(tablerOrder.split("_")[0] == "Type"){
                            database.run("INSERT INTO " + tablerOrder + " VALUES (?,?)", [currentId, checkboxValues[i]]);
                        }else{
                            database.run("INSERT INTO " + tablerOrder + " VALUES (?,?)", [checkboxValues[i], currentId]);
                        }   
                    } 
                }  
            });      
        }
        database.run("UPDATE Types SET name = ?, description = ? WHERE Type_id = ?", [this.name, this.description,this.Type_id], callback);
    } else {
        database.run("INSERT INTO Types (name,description) VALUES (?, ?)", [this.name, this.description,this.Type_id], function(){
            if(checkboxValues && checkboxValues.length != 0){
                var relationMToM = function(){
                    for(let i = 0; i < TypeSchema.references.length; i++){
                        if(TypeSchema.references[i].relation == "M-M"){
                            return TypeSchema.references[i].model;
                        }
                    }
                }
                var tablerOrder = ["Type", relationMToM()];
                tablerOrder.sort();
                tablerOrder = tablerOrder.join('_');
                for(let i = 0; i < checkboxValues.length; i++){
                    database.get("SELECT Type_id FROM Types ORDER BY Type_id DESC LIMIT 1", [], Type, function(id){
                        if(tablerOrder.split("_")[0] == "Type"){
                            database.run("INSERT INTO " + tablerOrder + " VALUES (?,?)", [id["Type_id"], checkboxValues[i]], callback);
                        }else{
                            database.run("INSERT INTO " + tablerOrder + " VALUES (?,?)", [checkboxValues[i], id["Type_id"]], callback);
                        }
                    })
                };
            }
        }); 
    }
}
Type.top = function (property,order,limit,callback) {
    var dbprop = Object.keys(Type.mappingDBtoObject).find(key => Type.mappingDBtoObject[key] == property);
    database.where(`SELECT * FROM Types ORDER BY ${dbprop} ${order} LIMIT ?`, [limit], Type, callback);
}


Type.delete = function (id, callback) {
    if(TypeSchema.references){
        database.run("DELETE FROM Types WHERE Type_id = ?", [id], function(){    
            var relationMToM = function(){
                for(let i = 0; i < TypeSchema.references.length; i++){
                    if(TypeSchema.references[i].relation == "M-M"){
                        return TypeSchema.references[i].model;
                    }
                }
            }
            var tablerOrder = ["Type", relationMToM()];
            tablerOrder.sort();
            tablerOrder = tablerOrder.join('_');
            database.run("DELETE FROM " + tablerOrder + " WHERE Type_id = ?", [id], callback);
        });
    }else{
        database.run("DELETE FROM Types WHERE Type_id = ?", [id], callback); 
    }
}

Type.mappingDBtoObject = {
    name:'name', description:'description',Type_id:'Type_id'
}

module.exports = Type;