function Brand (name,acronym) 
{
    this.name=name;this.acronym=acronym;
    Object.defineProperty(this,'Brand_id',{enumerable: false, writable: true, configurable: true});

}
var database = require("../Database/sqlite.js")("../Publish/Models/labs.db");

Brand.all = function (callback) {
    database.all("SELECT * FROM Brands", Brand, callback);
}

Brand.get = function (id, callback) {
    database.get("SELECT * FROM Brands WHERE Brand_id = ?", [id], Brand, callback);
}

Brand.prototype.save = function (callback) {
    if(this.Brand_id) {
        database.run("UPDATE Brands SET name = ?, acronym = ? WHERE Brand_id = " + this.Brand_id, [this.name, this.acronym], callback);
    } else { 
        database.run("INSERT INTO Brands (name,acronym) VALUES (?, ?)", [this.name, this.acronym], callback);
    }
}

Brand.delete = function (id, callback) {
    database.run("DELETE FROM Brands WHERE Brand_id = ?", [id], callback);
}

Brand.mappingDBtoObject = {
    name:'name', acronym:'acronym',Brand_id:'Brand_id'
}

module.exports = Brand;