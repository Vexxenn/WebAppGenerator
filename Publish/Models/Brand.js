function Brand (name,acronym) 
{
    this.name=name;this.acronym=acronym;
    Object.defineProperty(this,'Brand_id',{enumerable: false, writable: true, configurable: true});

}
var database = require("../Database/sqlite.js")("../Publish/Database/labs.db");
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
        if(BrandSchema.references){
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
            
            var currentId = this.Brand_id;
            database.run("DELETE FROM " + tablerOrder + " WHERE Brand_id = ?", [this.Brand_id], function(){
                if(checkboxValues){
                    if(checkboxValues.length == 1)
                    checkboxValues = [checkboxValues];
                    for(let i = 0; i < checkboxValues.length; i++){
                        if(tablerOrder.split("_")[0] == "Brand"){
                            database.run("INSERT INTO " + tablerOrder + " VALUES (?,?)", [currentId, checkboxValues[i]]);
                        }else{
                            database.run("INSERT INTO " + tablerOrder + " VALUES (?,?)", [checkboxValues[i], currentId]);
                        }   
                    } 
                }  
            });      
        }
        database.run("UPDATE Brands SET name = ?, acronym = ? WHERE Brand_id = ?", [this.name, this.acronym,this.Brand_id], callback);
    } else {
        database.run("INSERT INTO Brands (name,acronym) VALUES (?, ?)", [this.name, this.acronym,this.Brand_id], function(){
            if(checkboxValues && checkboxValues.length != 0){
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
                    database.get("SELECT Brand_id FROM Brands ORDER BY Brand_id DESC LIMIT 1", [], Brand, function(id){
                        if(tablerOrder.split("_")[0] == "Brand"){
                            database.run("INSERT INTO " + tablerOrder + " VALUES (?,?)", [id["Brand_id"], checkboxValues[i]], callback);
                        }else{
                            database.run("INSERT INTO " + tablerOrder + " VALUES (?,?)", [checkboxValues[i], id["Brand_id"]], callback);
                        }
                    })
                };
            }
        }); 
    }
}
Brand.top = function (property,order,limit,callback) {
    var dbprop = Object.keys(Brand.mappingDBtoObject).find(key => Brand.mappingDBtoObject[key] == property);
    database.where(`SELECT * FROM Brands ORDER BY ${dbprop} ${order} LIMIT ?`, [limit], Brand, callback);
}


Brand.delete = function (id, callback) {
    if(BrandSchema.references){
        database.run("DELETE FROM Brands WHERE Brand_id = ?", [id], function(){    
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
            database.run("DELETE FROM " + tablerOrder + " WHERE Brand_id = ?", [id], callback);
        });
    }else{
        database.run("DELETE FROM Brands WHERE Brand_id = ?", [id], callback); 
    }
}

Brand.mappingDBtoObject = {
    name:'name', acronym:'acronym',Brand_id:'Brand_id'
}

module.exports = Brand;