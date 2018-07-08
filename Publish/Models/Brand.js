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
        database.run("UPDATE Brands SET name = ?, acronym = ? WHERE Brand_id = ?", [this.name, this.acronym,this.Brand_id], callback);
    } else {
        database.run("INSERT INTO Brands (name,acronym) VALUES (?, ?)", [this.name, this.acronym,this.Brand_id], function(){
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
                            database.get("SELECT Brand_id FROM Brands ORDER BY Brand_id DESC LIMIT 1", [], Brand, function(id){
                                //Retorna o id a false apesar da query funcionar propriamente (query foi testada no DB Browser)
                                if(id == undefined){
                                    database.run("INSERT INTO " + tablerOrder + " VALUES (?,?)", [1, checkboxValues[i]]);
                                }else{
                                    database.run("INSERT INTO " + tablerOrder + " VALUES (?,?)", [id["Brand_id"], checkboxValues[i]]);
                                }
                            })
                        }else{
                            database.get("SELECT Brand_id FROM Brands ORDER BY Brand_id DESC LIMIT 1", [], Brand, function(id){  
                                if(id == undefined){
                                    database.run("INSERT INTO " + tablerOrder + " VALUES (?,?)", [checkboxValues[i], 1]);
                                }else{
                                    database.run("INSERT INTO " + tablerOrder + " VALUES (?,?)", [checkboxValues[i], id["Brand_id"]]);
                                }
                            })
                        }   
                    }
                }
            }
        }); 
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