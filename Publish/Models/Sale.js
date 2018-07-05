function Sale (identificationNumber,issueDate,issueLocation) 
{
    this.identificationNumber=identificationNumber;this.issueDate=issueDate;this.issueLocation=issueLocation;
    Object.defineProperty(this,'Sale_id',{enumerable: false, writable: true, configurable: true});

}
var database = require("../Database/sqlite.js")("../Publish/Models/labs.db");
var SaleSchema = require("../Models/Sale-schema");

Sale.all = function (callback) {
    database.all("SELECT * FROM Sales", Sale, callback);
}

Sale.get = function (id, callback) {
    database.get("SELECT * FROM Sales WHERE Sale_id = ?", [id], Sale, callback);
}

Sale.many = function(model, id, callback){
    let tablerOrder = ["Sale", `${model}`];
    tablerOrder.sort();
    tablerOrder = tablerOrder.join('_');
    database.where("SELECT Sales.* FROM Sales INNER JOIN " + tablerOrder + " ON " + tablerOrder + ".Sale_id="+
    "Sales.Sale_id WHERE " + tablerOrder + `.${model}`+"_id = ?", [id], Sale, callback);
}

Sale.prototype.save = function (checkboxValues, callback) {
    if(this.Sale_id) {
        database.run("UPDATE Sales SET identificationNumber = ?, issueDate = ?, issueLocation = ? WHERE Sale_id = " + this.Sale_id, [this.identificationNumber, this.issueDate, this.issueLocation], callback);
    } else {
        database.run("INSERT INTO Sales (identificationNumber,issueDate,issueLocation) VALUES (?, ?, ?)", [this.identificationNumber, this.issueDate, this.issueLocation], function(){
            if(checkboxValues != undefined){
                if(checkboxValues.length != 0){
                    var relationMToM = function(){
                        for(let i = 0; i < SaleSchema.references.length; i++){
                            if(SaleSchema.references[i].relation == "M-M"){
                                return SaleSchema.references[i].model;
                            }
                        }
                    }
                    var tablerOrder = ["Sale", relationMToM()];
                    tablerOrder.sort();
                    tablerOrder = tablerOrder.join('_');

                    for(let i = 0; i < checkboxValues.length; i++){
                        if(tablerOrder.split("_")[0] == "Sale"){
                            database.get("SELECT Sale_id FROM Sales ORDER BY Sale_id DESC LIMIT 1", [], Sale, function(id){
                                //Retorna o id a false apesar da query funcionar propriamente (query foi testada no DB Browser)
                                if(id == undefined){
                                    database.run("INSERT INTO " + tablerOrder + " VALUES (?,?)", [1, checkboxValues[i]]);
                                }else{
                                    database.run("INSERT INTO " + tablerOrder + " VALUES (?,?)", [id["Sale_id"], checkboxValues[i]]);
                                }
                            })
                        }else{
                            database.get("SELECT Sale_id FROM Sales ORDER BY Sale_id DESC LIMIT 1", [], Sale, function(id){  
                                if(id == undefined){
                                    database.run("INSERT INTO " + tablerOrder + " VALUES (?,?)", [checkboxValues[i], 1]);
                                }else{
                                    database.run("INSERT INTO " + tablerOrder + " VALUES (?,?)", [checkboxValues[i], id["Sale_id"]]);
                                }
                            })
                        }   
                    }
                }
            }
        }); 
    }
}
Sale.top = function (property,order,limit,callback) {
    var dbprop = Object.keys(Sale.mappingDBtoObject).find(key => Sale.mappingDBtoObject[key] == property);
    database.where(`SELECT * FROM Sales ORDER BY ${dbprop} ${order} LIMIT ?`, [limit], Sale, callback);
}


Sale.delete = function (id, callback) {
    database.run("DELETE FROM Sales WHERE Sale_id = ?", [id], callback);
}

Sale.mappingDBtoObject = {
    identificationNumber:'identificationNumber', issueDate:'issueDate', issueLocation:'issueLocation',Sale_id:'Sale_id'
}

module.exports = Sale;