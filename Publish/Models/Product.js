function Product (barCode,name,price,description) 
{
    this.barCode=barCode;this.name=name;this.price=price;
    Object.defineProperty(this,'description',{value:description, enumerable: false, writable: true, configurable: true});
Object.defineProperty(this,'Type_id',{enumerable: false, writable: true, configurable: true});
Object.defineProperty(this,'Brand_id',{enumerable: false, writable: true, configurable: true});
Object.defineProperty(this,'Sale_id',{enumerable: false, writable: true, configurable: true});
Object.defineProperty(this,'Product_id',{enumerable: false, writable: true, configurable: true});

}
var database = require("../Database/sqlite.js")("../Publish/Models/labs.db");

Product.all = function (callback) {
    database.all("SELECT * FROM Products", Product, callback);
}

Product.get = function (id, callback) {
    database.get("SELECT * FROM Products WHERE Product_id = ?", [id], Product, callback);
}

Product.prototype.save = function (callback) {
    if(this.Product_id) {
        database.run("UPDATE Products SET barCode = ?, name = ?, price = ?, description = ? WHERE Product_id = " + this.Product_id, [this.barCode, this.name, this.price, this.description], callback);
    } else { 
        database.run("INSERT INTO Products (barCode,name,price,description) VALUES (?, ?, ?, ?)", [this.barCode, this.name, this.price, this.description], callback);
    }
}

Product.delete = function (id, callback) {
    database.run("DELETE FROM Products WHERE Product_id = ?", [id], callback);
}

Product.mappingDBtoObject = {
    barCode:'barCode', name:'name', price:'price', description:'description',Product_id:'Product_id'
}

module.exports = Product;