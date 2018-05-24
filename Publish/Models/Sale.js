function Sale (identificatioNumber,issueDate,issueLocation) 
{
    this.identificatioNumber=identificatioNumber;this.issueDate=issueDate;this.issueLocation=issueLocation;
    Object.defineProperty(this,'Sale_id',{enumerable: false, writable: true, configurable: true});

}
var database = require("../Database/sqlite.js")("../Publish/Models/labs.db");

Sale.all = function (callback) {
    database.all("SELECT * FROM Sales", Sale, callback);
}

Sale.get = function (id, callback) {
    database.get("SELECT * FROM Sales WHERE Sale_id = ?", [id], Sale, callback);
}

Sale.prototype.save = function (callback) {
    if(this.Sale_id) {
        database.run("UPDATE Sales SET identificatioNumber = ?, issueDate = ?, issueLocation = ? WHERE Sale_id = " + this.Sale_id, [this.identificatioNumber, this.issueDate, this.issueLocation], callback);
    } else { 
        database.run("INSERT INTO Sales (identificatioNumber,issueDate,issueLocation) VALUES (?, ?, ?)", [this.identificatioNumber, this.issueDate, this.issueLocation], callback);
    }
}

Sale.delete = function (id, callback) {
    database.run("DELETE FROM Sales WHERE Sale_id = ?", [id], callback);
}

Sale.mappingDBtoObject = {
    identificatioNumber:'identificatioNumber', issueDate:'issueDate', issueLocation:'issueLocation',Sale_id:'Sale_id'
}

module.exports = Sale;