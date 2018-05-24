function Type (name,description) 
{
    this.name=name;this.description=description;
    Object.defineProperty(this,'Type_id',{enumerable: false, writable: true, configurable: true});

}
var database = require("../Database/sqlite.js")("../Publish/Models/labs.db");

Type.all = function (callback) {
    database.all("SELECT * FROM Types", Type, callback);
}

Type.get = function (id, callback) {
    database.get("SELECT * FROM Types WHERE Type_id = ?", [id], Type, callback);
}

Type.prototype.save = function (callback) {
    if(this.Type_id) {
        database.run("UPDATE Types SET name = ?, description = ? WHERE Type_id = " + this.Type_id, [this.name, this.description], callback);
    } else { 
        database.run("INSERT INTO Types (name,description) VALUES (?, ?)", [this.name, this.description], callback);
    }
}

Type.delete = function (id, callback) {
    database.run("DELETE FROM Types WHERE Type_id = ?", [id], callback);
}

Type.mappingDBtoObject = {
    name:'name', description:'description',Type_id:'Type_id'
}

module.exports = Type;