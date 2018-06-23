var express = require('express');
var router = express.Router();

var Product = require('../Models/Product.js');
var ProductSchema = require('../Models/Product-schema.js');

router.get('/',function(req,res) {

    Product.top("price", "DESC", 3, function (rows) {
        console.log(rows)
        res.render('welcome', {
            rows: rows.map(obj => {
                return {
                    properties: Object.keys(obj).map(key => {
                        return {
                            name: key,
                            value: obj[key]
                        }
                    })
                }
            }),
            columns: Object.keys(new Product()).map(key => {
                return {
                    name: ProductSchema.properties[key].displayName
                };
            }),
            welcome: "Bem vindos ao site de DBM"
        });
    });
});

module.exports = router;