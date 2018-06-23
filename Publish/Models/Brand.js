function Brand (name,acronym) 
{
    this.name=name;this.acronym=acronym;
    Object.defineProperty(this,'Brand_id',{enumerable: false, writable: true, configurable: true});

}
var database = require("../Database/sqlite.js")("../Publish/Models/labs.db");
var BrandSchema = require("../Models/Brand-schema");

Brand.all = function (callback) {
    database.all("SELECT * FROM Brands", Brand, callback);
}

Brand.get = function (id, callback) {
    database.get("SELECT * FROM Brands WHERE Brand_id = ?", [id], Brand, callback);
}

Brand.many = function(model, id, callback){
    let tablerOrder = ["Brand", `${model}`];
    tablerOrder.sort();
    tablerOrder = tablerOrder.join('_');
    database.where("SELECT Brands.* FROM Brands INNER JOIN " + tablerOrder + " ON " + tablerOrder + ".Brand_id="+
    "Brands.Brand_id WHERE " + tablerOrder + `.${model}`+"_id = ?", [id], Brand, callback);
}

Brand.prototype.save = function (checkboxValues, callback) {
    if(this.Brand_id) {
        database.run("UPDATE Brands SET name = ?, acronym = ? WHERE Brand_id = " + this.Brand_id, [this.name, this.acronym], callback);
    } else {
        database.run("INSERT INTO Brands (name,acronym) VALUES (?, ?)", [this.name, this.acronym], callback);
        if(checkboxValues != undefined){
            if(checkboxValues.length != 0){
                var relationMToM = function(){
                    for(let i = 0; i < BrandSchema.references.length; i++){
                        if(BrandSchema.references[i].relation == "M-M"){
                            return BrandSchema.references[i].model;
                        }
                    }
                }
                var tablerOrder = ["Brand", relationMToM()];
                tablerOrder.sort();
                tablerOrder = tablerOrder.join('_');

                for(let i = 0; i < checkboxValues.length; i++){
                    if(tablerOrder.split("_")[0] == "Brand"){
                        database.run("SELECT Brand_id FROM Sales ORDER BY column DESC LIMIT 1", [], function(id){
                            database.run("INSERT INTO " + tablerOrder + " VALUES (?,?)", [id, checkboxValues[i]]);
                        })
                    }else{
                        database.run("SELECT Brand_id FROM Sales ORDER BY column DESC LIMIT 1", [], function(id){
                            database.run("INSERT INTO " + tablerOrder + " VALUES (?,?)", [checkboxValues[i], id]);
                        })
                    }   
                }
            }
        }
        
    }
}
Brand.top = function (property,order,limit,callback) {
    var dbprop = Object.keys(Brand.mappingDBtoObject).find(key => Brand.mappingDBtoObject[key] == property);
    database.where(`SELECT * FROM Brands ORDER BY ${dbprop} ${order} LIMIT ?`, [limit], Brand, callback);
}


Brand.delete = function (id, callback) {
    database.run("DELETE FROM Brands WHERE Brand_id = ?", [id], callback);
}

Brand.mappingDBtoObject = {
    name:'name', acronym:'acronym',Brand_id:'Brand_id'
}

module.exports = Brand;