function Type (name,description) 
{
    this.name=name;this.description=description;
    Object.defineProperty(this,'Type_id',{enumerable: false, writable: true, configurable: true});

}
var database = require("../Database/sqlite.js")("../Publish/Models/labs.db");
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
        database.run("UPDATE Types SET name = ?, description = ? WHERE Type_id = " + this.Type_id, [this.name, this.description], callback);
    } else {
        database.run("INSERT INTO Types (name,description) VALUES (?, ?)", [this.name, this.description], function(){
            if(checkboxValues != undefined){
                if(checkboxValues.length != 0){
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
                        if(tablerOrder.split("_")[0] == "Type"){
                            database.get("SELECT Type_id FROM Types ORDER BY Type_id DESC LIMIT 1", [], Type, function(id){
                                //Retorna o id a false apesar da query funcionar propriamente (query foi testada no DB Browser)
                                if(id == undefined){
                                    database.run("INSERT INTO " + tablerOrder + " VALUES (?,?)", [1, checkboxValues[i]]);
                                }else{
                                    database.run("INSERT INTO " + tablerOrder + " VALUES (?,?)", [id["Type_id"], checkboxValues[i]]);
                                }
                            })
                        }else{
                            database.get("SELECT Type_id FROM Types ORDER BY Type_id DESC LIMIT 1", [], Type, function(id){  
                                if(id == undefined){
                                    database.run("INSERT INTO " + tablerOrder + " VALUES (?,?)", [checkboxValues[i], 1]);
                                }else{
                                    database.run("INSERT INTO " + tablerOrder + " VALUES (?,?)", [checkboxValues[i], id["Type_id"]]);
                                }
                            })
                        }   
                    }
                }
            }
        }); 
    }
}
Type.top = function (property,order,limit,callback) {
    var dbprop = Object.keys(Type.mappingDBtoObject).find(key => Type.mappingDBtoObject[key] == property);
    database.where(`SELECT * FROM Types ORDER BY ${dbprop} ${order} LIMIT ?`, [limit], Type, callback);
}


Type.delete = function (id, callback) {
    database.run("DELETE FROM Types WHERE Type_id = ?", [id], callback);
}

Type.mappingDBtoObject = {
    name:'name', description:'description',Type_id:'Type_id'
}

module.exports = Type;