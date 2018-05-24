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

router.post('/Sale', function(req, res){
    mapping(req.body, Sale).save();
});

router.get('/Sale', function(req,res){
    Sale.all(function(rows){
        res.json(rows);
    });
});

router.get('/Sale/:id', function(req, res){
    Sale.get(req.params.id, function(rows){
        res.json(rows);
    });
});

router.put('/Sale/:id', function(req, res){
    var obj = mapping(req.body, Sale);
    obj.Sale_id = req.params.id;
    obj.save(function(err){
        res.json({
            success: !err
        });
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

router.post('/Type', function(req, res){
    mapping(req.body, Type).save();
});

router.get('/Type', function(req,res){
    Type.all(function(rows){
        res.json(rows);
    });
});

router.get('/Type/:id', function(req, res){
    Type.get(req.params.id, function(rows){
        res.json(rows);
    });
});

router.put('/Type/:id', function(req, res){
    var obj = mapping(req.body, Type);
    obj.Type_id = req.params.id;
    obj.save(function(err){
        res.json({
            success: !err
        });
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

router.post('/Brand', function(req, res){
    mapping(req.body, Brand).save();
});

router.get('/Brand', function(req,res){
    Brand.all(function(rows){
        res.json(rows);
    });
});

router.get('/Brand/:id', function(req, res){
    Brand.get(req.params.id, function(rows){
        res.json(rows);
    });
});

router.put('/Brand/:id', function(req, res){
    var obj = mapping(req.body, Brand);
    obj.Brand_id = req.params.id;
    obj.save(function(err){
        res.json({
            success: !err
        });
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

router.post('/Product', function(req, res){
    mapping(req.body, Product).save();
});

router.get('/Product', function(req,res){
    Product.all(function(rows){
        res.json(rows);
    });
});

router.get('/Product/:id', function(req, res){
    Product.get(req.params.id, function(rows){
        res.json(rows);
    });
});

router.put('/Product/:id', function(req, res){
    var obj = mapping(req.body, Product);
    obj.Product_id = req.params.id;
    obj.save(function(err){
        res.json({
            success: !err
        });
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