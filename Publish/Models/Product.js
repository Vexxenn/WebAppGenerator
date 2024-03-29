function Product (barCode,name,price,description,Type_id,Brand_id) 
{
    this.barCode=barCode;this.name=name;this.price=price;
    Object.defineProperty(this,'description',{value:description, enumerable: false, writable: true, configurable: true});
Object.defineProperty(this,'Type_id',{enumerable: false, writable: true, configurable: true});
Object.defineProperty(this,'Brand_id',{enumerable: false, writable: true, configurable: true});
Object.defineProperty(this,'Product_id',{enumerable: false, writable: true, configurable: true});

}
var database = require("../Database/sqlite.js")("../Publish/Database/labs.db");
var ProductSchema = require("../Models/Product-schema");

Product.all = function (callback) {
    database.all("SELECT * FROM Products", Product, callback);
}

Product.get = function (id, callback) {
    database.get("SELECT * FROM Products WHERE Product_id = ?", [id], Product, callback);
}

Product.many = function(model, id, callback){
    let tablerOrder = ["Product", `${model}`];
    tablerOrder.sort();
    tablerOrder = tablerOrder.join('_');
    database.where("SELECT Products.* FROM Products INNER JOIN " + tablerOrder + " ON " + tablerOrder + ".Product_id="+
    "Products.Product_id WHERE " + tablerOrder + `.${model}`+"_id = ?", [id], Product, callback);
}

Product.prototype.save = function (checkboxValues, callback) {
    if(this.Product_id) {
        if(ProductSchema.references){
            var relationMToM = function(){
                for(let i = 0; i < ProductSchema.references.length; i++){
                    if(ProductSchema.references[i].relation == "M-M"){
                        return ProductSchema.references[i].model;
                    }
                }
            }
            var tablerOrder = ["Product", relationMToM()];
            tablerOrder.sort();
            tablerOrder = tablerOrder.join('_');
            
            var currentId = this.Product_id;
            database.run("DELETE FROM " + tablerOrder + " WHERE Product_id = ?", [this.Product_id], function(){
                if(checkboxValues){
                    if(checkboxValues.length == 1)
                    checkboxValues = [checkboxValues];
                    for(let i = 0; i < checkboxValues.length; i++){
                        if(tablerOrder.split("_")[0] == "Product"){
                            database.run("INSERT INTO " + tablerOrder + " VALUES (?,?)", [currentId, checkboxValues[i]]);
                        }else{
                            database.run("INSERT INTO " + tablerOrder + " VALUES (?,?)", [checkboxValues[i], currentId]);
                        }   
                    } 
                }  
            });      
        }
        database.run("UPDATE Products SET barCode = ?, name = ?, price = ?, description = ?, Type_id = ?, Brand_id = ? WHERE Product_id = ?", [this.barCode, this.name, this.price, this.description, this.Type_id, this.Brand_id,this.Product_id], callback);
    } else {
        database.run("INSERT INTO Products (barCode,name,price,description,Type_id,Brand_id) VALUES (?, ?, ?, ?, ?, ?)", [this.barCode, this.name, this.price, this.description, this.Type_id, this.Brand_id,this.Product_id], function(){
            if(checkboxValues && checkboxValues.length != 0){
                var relationMToM = function(){
                    for(let i = 0; i < ProductSchema.references.length; i++){
                        if(ProductSchema.references[i].relation == "M-M"){
                            return ProductSchema.references[i].model;
                        }
                    }
                }
                var tablerOrder = ["Product", relationMToM()];
                tablerOrder.sort();
                tablerOrder = tablerOrder.join('_');
                for(let i = 0; i < checkboxValues.length; i++){
                    database.get("SELECT Product_id FROM Products ORDER BY Product_id DESC LIMIT 1", [], Product, function(id){
                        if(tablerOrder.split("_")[0] == "Product"){
                            database.run("INSERT INTO " + tablerOrder + " VALUES (?,?)", [id["Product_id"], checkboxValues[i]], callback);
                        }else{
                            database.run("INSERT INTO " + tablerOrder + " VALUES (?,?)", [checkboxValues[i], id["Product_id"]], callback);
                        }
                    })
                };
            }
        }); 
    }
}
Product.top = function (property,order,limit,callback) {
    var dbprop = Object.keys(Product.mappingDBtoObject).find(key => Product.mappingDBtoObject[key] == property);
    database.where(`SELECT * FROM Products ORDER BY ${dbprop} ${order} LIMIT ?`, [limit], Product, callback);
}


Product.delete = function (id, callback) {
    if(ProductSchema.references){
        database.run("DELETE FROM Products WHERE Product_id = ?", [id], function(){    
            var relationMToM = function(){
                for(let i = 0; i < ProductSchema.references.length; i++){
                    if(ProductSchema.references[i].relation == "M-M"){
                        return ProductSchema.references[i].model;
                    }
                }
            }
            var tablerOrder = ["Product", relationMToM()];
            tablerOrder.sort();
            tablerOrder = tablerOrder.join('_');
            database.run("DELETE FROM " + tablerOrder + " WHERE Product_id = ?", [id], callback);
        });
    }else{
        database.run("DELETE FROM Products WHERE Product_id = ?", [id], callback); 
    }
}

Product.mappingDBtoObject = {
    barCode:'barCode', name:'name', price:'price', description:'description', Type_id:'Type_id', Brand_id:'Brand_id',Product_id:'Product_id'
}

module.exports = Product;