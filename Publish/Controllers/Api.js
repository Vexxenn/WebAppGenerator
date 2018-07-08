var express = require('express');
var router = express.Router();

function mapping(object, type) {
    var obj = new type();
    Object.keys(object).forEach(function (value) {
    if (obj.hasOwnProperty(value)) //Se o objeto possuir o atributo que se está a verificar então recebe o valor retornado da query da base de dados
        obj[value] = object[value];
    });
    return obj;
}

var Sale = require('../Models/Sale.js');
var SaleSchema = require("../Models/Sale-schema.js");

router.post('/Sale', function(req, res){
    mapping(req.body, Sale).save(req.body.SalecheckBox, res.redirect("http://localhost:8084/backoffice/Sale"));
    
});

router.get('/Sale', function(req,res){
    Sale.all(function(rows){
        if(SaleSchema.references){
            var relationProperties = ["Sale_id"];
            SaleSchema.references.forEach(function(ref){
                if(ref.relation != "M-M"){
                    relationProperties.push(ref.model + "_id");
                }
            });
            res.send(JSON.stringify(rows,Object.keys(new Sale()).concat(relationProperties)));
        }else{
            res.send(JSON.stringify(rows,Object.keys(new Sale()).concat(["Sale_id"])));
        }
    });
});

router.get('/Sale/:id', function(req, res){
    Sale.get(req.params.id, function(rows){
        if(SaleSchema.references){
            var relationProperties = ["Sale_id"];
            SaleSchema.references.forEach(function(ref){
                if(ref.relation != "M-M"){
                    relationProperties.push(ref.model + "_id");
                }
            });
            res.send(JSON.stringify(rows,Object.keys(new Sale()).concat(relationProperties)));
        }else{
            res.send(JSON.stringify(rows,Object.keys(new Sale()).concat(["Sale_id"])));
        }
        
    });
});

router.get('/Sale/:model/:id', function (req, res) {
    Sale.many(req.params.model, req.params.id, function (rows) {
        res.send(JSON.stringify(rows,Object.keys(new Sale()).concat(["Sale_id"])));
    });
});


router.put('/Sale/:id', function(req, res){
    var obj = mapping(req.body, Sale);
    obj.Sale_id = req.params.id;
    obj.save(function(err){
        res.json({
            success: !err
        });
        res.redirect("http://localhost:8084/backoffice/Sale");
    });
});

router.delete('/Sale/:id', function(req, res){
    Sale.delete(req.params.id, function(err){
        res.json({
            success : !err
        });
    });
});
var Type = require('../Models/Type.js');
var TypeSchema = require("../Models/Type-schema.js");

router.post('/Type', function(req, res){
    mapping(req.body, Type).save(req.body.TypecheckBox, res.redirect("http://localhost:8084/backoffice/Type"));
    
});

router.get('/Type', function(req,res){
    Type.all(function(rows){
        if(TypeSchema.references){
            var relationProperties = ["Type_id"];
            TypeSchema.references.forEach(function(ref){
                if(ref.relation != "M-M"){
                    relationProperties.push(ref.model + "_id");
                }
            });
            res.send(JSON.stringify(rows,Object.keys(new Type()).concat(relationProperties)));
        }else{
            res.send(JSON.stringify(rows,Object.keys(new Type()).concat(["Type_id"])));
        }
    });
});

router.get('/Type/:id', function(req, res){
    Type.get(req.params.id, function(rows){
        if(TypeSchema.references){
            var relationProperties = ["Type_id"];
            TypeSchema.references.forEach(function(ref){
                if(ref.relation != "M-M"){
                    relationProperties.push(ref.model + "_id");
                }
            });
            res.send(JSON.stringify(rows,Object.keys(new Type()).concat(relationProperties)));
        }else{
            res.send(JSON.stringify(rows,Object.keys(new Type()).concat(["Type_id"])));
        }
        
    });
});

router.get('/Type/:model/:id', function (req, res) {
    Type.many(req.params.model, req.params.id, function (rows) {
        res.send(JSON.stringify(rows,Object.keys(new Type()).concat(["Type_id"])));
    });
});


router.put('/Type/:id', function(req, res){
    var obj = mapping(req.body, Type);
    obj.Type_id = req.params.id;
    obj.save(function(err){
        res.json({
            success: !err
        });
        res.redirect("http://localhost:8084/backoffice/Type");
    });
});

router.delete('/Type/:id', function(req, res){
    Type.delete(req.params.id, function(err){
        res.json({
            success : !err
        });
    });
});
var Brand = require('../Models/Brand.js');
var BrandSchema = require("../Models/Brand-schema.js");

router.post('/Brand', function(req, res){
    mapping(req.body, Brand).save(req.body.BrandcheckBox, res.redirect("http://localhost:8084/backoffice/Brand"));
    
});

router.get('/Brand', function(req,res){
    Brand.all(function(rows){
        if(BrandSchema.references){
            var relationProperties = ["Brand_id"];
            BrandSchema.references.forEach(function(ref){
                if(ref.relation != "M-M"){
                    relationProperties.push(ref.model + "_id");
                }
            });
            res.send(JSON.stringify(rows,Object.keys(new Brand()).concat(relationProperties)));
        }else{
            res.send(JSON.stringify(rows,Object.keys(new Brand()).concat(["Brand_id"])));
        }
    });
});

router.get('/Brand/:id', function(req, res){
    Brand.get(req.params.id, function(rows){
        if(BrandSchema.references){
            var relationProperties = ["Brand_id"];
            BrandSchema.references.forEach(function(ref){
                if(ref.relation != "M-M"){
                    relationProperties.push(ref.model + "_id");
                }
            });
            res.send(JSON.stringify(rows,Object.keys(new Brand()).concat(relationProperties)));
        }else{
            res.send(JSON.stringify(rows,Object.keys(new Brand()).concat(["Brand_id"])));
        }
        
    });
});

router.get('/Brand/:model/:id', function (req, res) {
    Brand.many(req.params.model, req.params.id, function (rows) {
        res.send(JSON.stringify(rows,Object.keys(new Brand()).concat(["Brand_id"])));
    });
});


router.put('/Brand/:id', function(req, res){
    var obj = mapping(req.body, Brand);
    obj.Brand_id = req.params.id;
    obj.save(function(err){
        res.json({
            success: !err
        });
        res.redirect("http://localhost:8084/backoffice/Brand");
    });
});

router.delete('/Brand/:id', function(req, res){
    Brand.delete(req.params.id, function(err){
        res.json({
            success : !err
        });
    });
});
var Product = require('../Models/Product.js');
var ProductSchema = require("../Models/Product-schema.js");

router.post('/Product', function(req, res){
    mapping(req.body, Product).save(req.body.ProductcheckBox, res.redirect("http://localhost:8084/backoffice/Product"));
    
});

router.get('/Product', function(req,res){
    Product.all(function(rows){
        if(ProductSchema.references){
            var relationProperties = ["Product_id"];
            ProductSchema.references.forEach(function(ref){
                if(ref.relation != "M-M"){
                    relationProperties.push(ref.model + "_id");
                }
            });
            res.send(JSON.stringify(rows,Object.keys(new Product()).concat(relationProperties)));
        }else{
            res.send(JSON.stringify(rows,Object.keys(new Product()).concat(["Product_id"])));
        }
    });
});

router.get('/Product/:id', function(req, res){
    Product.get(req.params.id, function(rows){
        if(ProductSchema.references){
            var relationProperties = ["Product_id"];
            ProductSchema.references.forEach(function(ref){
                if(ref.relation != "M-M"){
                    relationProperties.push(ref.model + "_id");
                }
            });
            res.send(JSON.stringify(rows,Object.keys(new Product()).concat(relationProperties)));
        }else{
            res.send(JSON.stringify(rows,Object.keys(new Product()).concat(["Product_id"])));
        }
        
    });
});

router.get('/Product/:model/:id', function (req, res) {
    Product.many(req.params.model, req.params.id, function (rows) {
        res.send(JSON.stringify(rows,Object.keys(new Product()).concat(["Product_id"])));
    });
});


router.put('/Product/:id', function(req, res){
    var obj = mapping(req.body, Product);
    obj.Product_id = req.params.id;
    obj.save(function(err){
        res.json({
            success: !err
        });
        res.redirect("http://localhost:8084/backoffice/Product");
    });
});

router.delete('/Product/:id', function(req, res){
    Product.delete(req.params.id, function(err){
        res.json({
            success : !err
        });
    });
});
module.exports = router;