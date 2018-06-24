var express = require('express');
var router = express.Router();

router.get('/', function(req,res){
    res.render('backoffice-default',{
        models: [  {name: "Sale"},  {name: "Type"},  {name: "Brand"},  {name: "Product"}, ]
    });
})


var Sale = require('../Models/Sale.js');
var SaleSchema = require('../Models/Sale-schema.js');

router.get('/Sale',function(req,res) {
    Sale.all(function (rows) {
        res.render('list', {
            title: 'Sale',
            rows: rows.map(obj => {
                return {
                    properties: Object.keys(obj).map(key => {
                        return {
                            name: key,
                            value: obj[key]
                        }
                    }),
                    actions: [{
                        label: '',
                        link: './Sale/details/' + obj.Sale_id,
                        image: {
                            src: '/Images/read.png'
                        },
                        tooltip: 'Detalhe'
                    }, {
                        label: '',
                        link: './Sale/edit/' + obj.Sale_id,
                        image: {
                            src: '/Images/edit.png'
                        },
                        tooltip: 'Editar'
                    }, {
                        label: '',
                        link: '#',
                        image: {
                            src: '/Images/delete.png'
                        },
                        tooltip: 'Apagar',
                        events: [{
                            name: "onclick",
                            function: "apagar",
                            args: obj.Sale_id
                        }]

                    }]
                }
            }),
            columns: Object.keys(new Sale()).map(key => {
                return {
                    name: SaleSchema.properties[key].displayName
                };
            }),
            title: "Sale"
        });
    });
});

router.get('/Sale/details/:id',function(req,res) {
    Sale.get(req.params.id, function (row) {
        res.render('details', {
            properties: function(){
                var allProps = Object.getOwnPropertyNames(row);
                var validProps = [];
                allProps.forEach(function (prop){
                    if(SaleSchema.properties.hasOwnProperty(prop)){
                        validProps.push({
                            name:SaleSchema.properties[prop].displayName,
                            value: row[prop]
                        });
                    }
                });
                return validProps;
            },
            references: function(){
                var allRefs = [];
                if(SaleSchema.references){
                    SaleSchema.references.forEach(function(ref){
                        allRefs.push({
                            label: ref.label,
                            model: ""+ref.model,
                            values: ref.relation == "M-M" ? ref.model + '/' + "Sale/" + req.params.id : ref.model + "/" + row[(ref.model + "_id")]

                        });
                    });
                }
                return allRefs;
            },
            get hasReferences(){
                return this.references().lenght > 0;
            },
            title: "Sale Details"
        });
    });
});

router.get('/Sale/edit/:id',function(req,res) {
    Sale.get(req.params.id, function (row) {
        res.render('form', {
            properties: function(){
                var allProps = Object.getOwnPropertyNames(row);
                var validProps = [];
                allProps.forEach(function (prop){
                    if(SaleSchema.properties.hasOwnProperty(prop)){
                        validProps.push({
                            type: SaleSchema.properties[prop].type,
                            name: prop,
                            displayName: SaleSchema.properties[prop].displayName,
                            value: row[prop],
                            required: SaleSchema.required.includes(prop) ? "required" : "",
                            conditions: function(){
                                var conditions = "";
                                if(SaleSchema.properties[prop].type == "string"){
                                    conditions += "maxlength = \"" + SaleSchema.properties[prop].maxlength + "\" minlength = \"" + SaleSchema.properties[prop].minlength + "\"";
                                }else{
                                    conditions += "max = \"" + SaleSchema.properties[prop].max + "\" min = \"" + SaleSchema.properties[prop].min + "\"";
                                }
                                return conditions;
                            }
                        });
                    }else{
                        if(prop == "Sale_id"){
                            validProps.push({
                                type: "string",
                                name: prop,
                                displayName: prop,
                                value: row[prop],
                                required: ProductSchema.required.includes(prop) ? "required" : "",
                                isHidden: "hidden"
                            })
                            
                        }
                    }
                });
                return validProps;
            },
            references: function(){
                var allRefs = [];
                if(SaleSchema.references){
                    SaleSchema.references.forEach(function(ref){
                        allRefs.push({
                            label: ref.label,
                            model: "Sale",
                            relatedModel: ref.model,
                            html: ref.relation != "M-M" ? "<select name = " + ref.model + "_id name = " + ref.model + "_id id = label" + ref.model + "value = > </select><br/>": 
                                "<div id = label" + ref.model + "value>",
                            relation: ref.relation,
                            searchId: row.Sale_id
                        });
                    });
            }
                return allRefs;
            },
            get hasReferences(){
                    return this.references().lenght > 0;
            },

            method: "POST",
            action: "Sale/",
            title: "Edit Sale"
        });
    });
});

router.get('/Sale/create',function(req,res) {
    res.render('form', {
        properties: function(){
            var elem = new Sale();
            var allProps = Object.getOwnPropertyNames(elem);
            var validProps = [];
            allProps.forEach(function (prop){
                if(SaleSchema.properties.hasOwnProperty(prop)){
                    validProps.push({
                        type: SaleSchema.properties[prop].type,
                        name: prop,
                        displayName: SaleSchema.properties[prop].displayName,
                        required: SaleSchema.required.includes(prop) ? "required" : "",
                        conditions: function(){
                            var conditions = "";
                            if(SaleSchema.properties[prop].type == "string"){
                                conditions += "maxlength = \"" + SaleSchema.properties[prop].maxlength + "\" minlength = \"" + SaleSchema.properties[prop].minlength + "\"";
                            }else{
                                conditions += "max = \"" + SaleSchema.properties[prop].max + "\" min = \"" + SaleSchema.properties[prop].min + "\"";
                            }
                            return conditions;
                        }
                    });
                }
            });
            return validProps;
        },
        references: function(){
            var allRefs = [];
            if(SaleSchema.references){
                SaleSchema.references.forEach(function(ref){
                    allRefs.push({
                        label: ref.label,
                        model: "Sale",
                        relatedModel: ref.model,
                        html: ref.relation != "M-M" ? "<select name = " + ref.model + "_id name = " + ref.model + "_id id = label" + ref.model + "value = > </select><br/>": 
                            "<div id = label" + ref.model + "value>",
                        relation: ref.relation,
                        searchId: ""
                    });
                });
            }
            
            return allRefs;
        },
        get hasReferences(){
            return this.references().lenght > 0;
        },
        method: "POST",
        action: "Sale",
        checkBoxName: "SalecheckBox",
        title: "Create Sale"
    });
});

var Type = require('../Models/Type.js');
var TypeSchema = require('../Models/Type-schema.js');

router.get('/Type',function(req,res) {
    Type.all(function (rows) {
        res.render('list', {
            title: 'Type',
            rows: rows.map(obj => {
                return {
                    properties: Object.keys(obj).map(key => {
                        return {
                            name: key,
                            value: obj[key]
                        }
                    }),
                    actions: [{
                        label: '',
                        link: './Type/details/' + obj.Type_id,
                        image: {
                            src: '/Images/read.png'
                        },
                        tooltip: 'Detalhe'
                    }, {
                        label: '',
                        link: './Type/edit/' + obj.Type_id,
                        image: {
                            src: '/Images/edit.png'
                        },
                        tooltip: 'Editar'
                    }, {
                        label: '',
                        link: '#',
                        image: {
                            src: '/Images/delete.png'
                        },
                        tooltip: 'Apagar',
                        events: [{
                            name: "onclick",
                            function: "apagar",
                            args: obj.Type_id
                        }]

                    }]
                }
            }),
            columns: Object.keys(new Type()).map(key => {
                return {
                    name: TypeSchema.properties[key].displayName
                };
            }),
            title: "Type"
        });
    });
});

router.get('/Type/details/:id',function(req,res) {
    Type.get(req.params.id, function (row) {
        res.render('details', {
            properties: function(){
                var allProps = Object.getOwnPropertyNames(row);
                var validProps = [];
                allProps.forEach(function (prop){
                    if(TypeSchema.properties.hasOwnProperty(prop)){
                        validProps.push({
                            name:TypeSchema.properties[prop].displayName,
                            value: row[prop]
                        });
                    }
                });
                return validProps;
            },
            references: function(){
                var allRefs = [];
                if(TypeSchema.references){
                    TypeSchema.references.forEach(function(ref){
                        allRefs.push({
                            label: ref.label,
                            model: ""+ref.model,
                            values: ref.relation == "M-M" ? ref.model + '/' + "Type/" + req.params.id : ref.model + "/" + row[(ref.model + "_id")]

                        });
                    });
                }
                return allRefs;
            },
            get hasReferences(){
                return this.references().lenght > 0;
            },
            title: "Type Details"
        });
    });
});

router.get('/Type/edit/:id',function(req,res) {
    Type.get(req.params.id, function (row) {
        res.render('form', {
            properties: function(){
                var allProps = Object.getOwnPropertyNames(row);
                var validProps = [];
                allProps.forEach(function (prop){
                    if(TypeSchema.properties.hasOwnProperty(prop)){
                        validProps.push({
                            type: TypeSchema.properties[prop].type,
                            name: prop,
                            displayName: TypeSchema.properties[prop].displayName,
                            value: row[prop],
                            required: TypeSchema.required.includes(prop) ? "required" : "",
                            conditions: function(){
                                var conditions = "";
                                if(TypeSchema.properties[prop].type == "string"){
                                    conditions += "maxlength = \"" + TypeSchema.properties[prop].maxlength + "\" minlength = \"" + TypeSchema.properties[prop].minlength + "\"";
                                }else{
                                    conditions += "max = \"" + TypeSchema.properties[prop].max + "\" min = \"" + TypeSchema.properties[prop].min + "\"";
                                }
                                return conditions;
                            }
                        });
                    }else{
                        if(prop == "Type_id"){
                            validProps.push({
                                type: "string",
                                name: prop,
                                displayName: prop,
                                value: row[prop],
                                required: ProductSchema.required.includes(prop) ? "required" : "",
                                isHidden: "hidden"
                            })
                            
                        }
                    }
                });
                return validProps;
            },
            references: function(){
                var allRefs = [];
                if(TypeSchema.references){
                    TypeSchema.references.forEach(function(ref){
                        allRefs.push({
                            label: ref.label,
                            model: "Type",
                            relatedModel: ref.model,
                            html: ref.relation != "M-M" ? "<select name = " + ref.model + "_id name = " + ref.model + "_id id = label" + ref.model + "value = > </select><br/>": 
                                "<div id = label" + ref.model + "value>",
                            relation: ref.relation,
                            searchId: row.Type_id
                        });
                    });
            }
                return allRefs;
            },
            get hasReferences(){
                    return this.references().lenght > 0;
            },

            method: "POST",
            action: "Type/",
            title: "Edit Type"
        });
    });
});

router.get('/Type/create',function(req,res) {
    res.render('form', {
        properties: function(){
            var elem = new Type();
            var allProps = Object.getOwnPropertyNames(elem);
            var validProps = [];
            allProps.forEach(function (prop){
                if(TypeSchema.properties.hasOwnProperty(prop)){
                    validProps.push({
                        type: TypeSchema.properties[prop].type,
                        name: prop,
                        displayName: TypeSchema.properties[prop].displayName,
                        required: TypeSchema.required.includes(prop) ? "required" : "",
                        conditions: function(){
                            var conditions = "";
                            if(TypeSchema.properties[prop].type == "string"){
                                conditions += "maxlength = \"" + TypeSchema.properties[prop].maxlength + "\" minlength = \"" + TypeSchema.properties[prop].minlength + "\"";
                            }else{
                                conditions += "max = \"" + TypeSchema.properties[prop].max + "\" min = \"" + TypeSchema.properties[prop].min + "\"";
                            }
                            return conditions;
                        }
                    });
                }
            });
            return validProps;
        },
        references: function(){
            var allRefs = [];
            if(TypeSchema.references){
                TypeSchema.references.forEach(function(ref){
                    allRefs.push({
                        label: ref.label,
                        model: "Type",
                        relatedModel: ref.model,
                        html: ref.relation != "M-M" ? "<select name = " + ref.model + "_id name = " + ref.model + "_id id = label" + ref.model + "value = > </select><br/>": 
                            "<div id = label" + ref.model + "value>",
                        relation: ref.relation,
                        searchId: ""
                    });
                });
            }
            
            return allRefs;
        },
        get hasReferences(){
            return this.references().lenght > 0;
        },
        method: "POST",
        action: "Type",
        checkBoxName: "TypecheckBox",
        title: "Create Type"
    });
});

var Brand = require('../Models/Brand.js');
var BrandSchema = require('../Models/Brand-schema.js');

router.get('/Brand',function(req,res) {
    Brand.all(function (rows) {
        res.render('list', {
            title: 'Brand',
            rows: rows.map(obj => {
                return {
                    properties: Object.keys(obj).map(key => {
                        return {
                            name: key,
                            value: obj[key]
                        }
                    }),
                    actions: [{
                        label: '',
                        link: './Brand/details/' + obj.Brand_id,
                        image: {
                            src: '/Images/read.png'
                        },
                        tooltip: 'Detalhe'
                    }, {
                        label: '',
                        link: './Brand/edit/' + obj.Brand_id,
                        image: {
                            src: '/Images/edit.png'
                        },
                        tooltip: 'Editar'
                    }, {
                        label: '',
                        link: '#',
                        image: {
                            src: '/Images/delete.png'
                        },
                        tooltip: 'Apagar',
                        events: [{
                            name: "onclick",
                            function: "apagar",
                            args: obj.Brand_id
                        }]

                    }]
                }
            }),
            columns: Object.keys(new Brand()).map(key => {
                return {
                    name: BrandSchema.properties[key].displayName
                };
            }),
            title: "Brand"
        });
    });
});

router.get('/Brand/details/:id',function(req,res) {
    Brand.get(req.params.id, function (row) {
        res.render('details', {
            properties: function(){
                var allProps = Object.getOwnPropertyNames(row);
                var validProps = [];
                allProps.forEach(function (prop){
                    if(BrandSchema.properties.hasOwnProperty(prop)){
                        validProps.push({
                            name:BrandSchema.properties[prop].displayName,
                            value: row[prop]
                        });
                    }
                });
                return validProps;
            },
            references: function(){
                var allRefs = [];
                if(BrandSchema.references){
                    BrandSchema.references.forEach(function(ref){
                        allRefs.push({
                            label: ref.label,
                            model: ""+ref.model,
                            values: ref.relation == "M-M" ? ref.model + '/' + "Brand/" + req.params.id : ref.model + "/" + row[(ref.model + "_id")]

                        });
                    });
                }
                return allRefs;
            },
            get hasReferences(){
                return this.references().lenght > 0;
            },
            title: "Brand Details"
        });
    });
});

router.get('/Brand/edit/:id',function(req,res) {
    Brand.get(req.params.id, function (row) {
        res.render('form', {
            properties: function(){
                var allProps = Object.getOwnPropertyNames(row);
                var validProps = [];
                allProps.forEach(function (prop){
                    if(BrandSchema.properties.hasOwnProperty(prop)){
                        validProps.push({
                            type: BrandSchema.properties[prop].type,
                            name: prop,
                            displayName: BrandSchema.properties[prop].displayName,
                            value: row[prop],
                            required: BrandSchema.required.includes(prop) ? "required" : "",
                            conditions: function(){
                                var conditions = "";
                                if(BrandSchema.properties[prop].type == "string"){
                                    conditions += "maxlength = \"" + BrandSchema.properties[prop].maxlength + "\" minlength = \"" + BrandSchema.properties[prop].minlength + "\"";
                                }else{
                                    conditions += "max = \"" + BrandSchema.properties[prop].max + "\" min = \"" + BrandSchema.properties[prop].min + "\"";
                                }
                                return conditions;
                            }
                        });
                    }else{
                        if(prop == "Brand_id"){
                            validProps.push({
                                type: "string",
                                name: prop,
                                displayName: prop,
                                value: row[prop],
                                required: ProductSchema.required.includes(prop) ? "required" : "",
                                isHidden: "hidden"
                            })
                            
                        }
                    }
                });
                return validProps;
            },
            references: function(){
                var allRefs = [];
                if(BrandSchema.references){
                    BrandSchema.references.forEach(function(ref){
                        allRefs.push({
                            label: ref.label,
                            model: "Brand",
                            relatedModel: ref.model,
                            html: ref.relation != "M-M" ? "<select name = " + ref.model + "_id name = " + ref.model + "_id id = label" + ref.model + "value = > </select><br/>": 
                                "<div id = label" + ref.model + "value>",
                            relation: ref.relation,
                            searchId: row.Brand_id
                        });
                    });
            }
                return allRefs;
            },
            get hasReferences(){
                    return this.references().lenght > 0;
            },

            method: "POST",
            action: "Brand/",
            title: "Edit Brand"
        });
    });
});

router.get('/Brand/create',function(req,res) {
    res.render('form', {
        properties: function(){
            var elem = new Brand();
            var allProps = Object.getOwnPropertyNames(elem);
            var validProps = [];
            allProps.forEach(function (prop){
                if(BrandSchema.properties.hasOwnProperty(prop)){
                    validProps.push({
                        type: BrandSchema.properties[prop].type,
                        name: prop,
                        displayName: BrandSchema.properties[prop].displayName,
                        required: BrandSchema.required.includes(prop) ? "required" : "",
                        conditions: function(){
                            var conditions = "";
                            if(BrandSchema.properties[prop].type == "string"){
                                conditions += "maxlength = \"" + BrandSchema.properties[prop].maxlength + "\" minlength = \"" + BrandSchema.properties[prop].minlength + "\"";
                            }else{
                                conditions += "max = \"" + BrandSchema.properties[prop].max + "\" min = \"" + BrandSchema.properties[prop].min + "\"";
                            }
                            return conditions;
                        }
                    });
                }
            });
            return validProps;
        },
        references: function(){
            var allRefs = [];
            if(BrandSchema.references){
                BrandSchema.references.forEach(function(ref){
                    allRefs.push({
                        label: ref.label,
                        model: "Brand",
                        relatedModel: ref.model,
                        html: ref.relation != "M-M" ? "<select name = " + ref.model + "_id name = " + ref.model + "_id id = label" + ref.model + "value = > </select><br/>": 
                            "<div id = label" + ref.model + "value>",
                        relation: ref.relation,
                        searchId: ""
                    });
                });
            }
            
            return allRefs;
        },
        get hasReferences(){
            return this.references().lenght > 0;
        },
        method: "POST",
        action: "Brand",
        checkBoxName: "BrandcheckBox",
        title: "Create Brand"
    });
});

var Product = require('../Models/Product.js');
var ProductSchema = require('../Models/Product-schema.js');

router.get('/Product',function(req,res) {
    Product.all(function (rows) {
        res.render('list', {
            title: 'Product',
            rows: rows.map(obj => {
                return {
                    properties: Object.keys(obj).map(key => {
                        return {
                            name: key,
                            value: obj[key]
                        }
                    }),
                    actions: [{
                        label: '',
                        link: './Product/details/' + obj.Product_id,
                        image: {
                            src: '/Images/read.png'
                        },
                        tooltip: 'Detalhe'
                    }, {
                        label: '',
                        link: './Product/edit/' + obj.Product_id,
                        image: {
                            src: '/Images/edit.png'
                        },
                        tooltip: 'Editar'
                    }, {
                        label: '',
                        link: '#',
                        image: {
                            src: '/Images/delete.png'
                        },
                        tooltip: 'Apagar',
                        events: [{
                            name: "onclick",
                            function: "apagar",
                            args: obj.Product_id
                        }]

                    }]
                }
            }),
            columns: Object.keys(new Product()).map(key => {
                return {
                    name: ProductSchema.properties[key].displayName
                };
            }),
            title: "Product"
        });
    });
});

router.get('/Product/details/:id',function(req,res) {
    Product.get(req.params.id, function (row) {
        res.render('details', {
            properties: function(){
                var allProps = Object.getOwnPropertyNames(row);
                var validProps = [];
                allProps.forEach(function (prop){
                    if(ProductSchema.properties.hasOwnProperty(prop)){
                        validProps.push({
                            name:ProductSchema.properties[prop].displayName,
                            value: row[prop]
                        });
                    }
                });
                return validProps;
            },
            references: function(){
                var allRefs = [];
                if(ProductSchema.references){
                    ProductSchema.references.forEach(function(ref){
                        allRefs.push({
                            label: ref.label,
                            model: ""+ref.model,
                            values: ref.relation == "M-M" ? ref.model + '/' + "Product/" + req.params.id : ref.model + "/" + row[(ref.model + "_id")]

                        });
                    });
                }
                return allRefs;
            },
            get hasReferences(){
                return this.references().lenght > 0;
            },
            title: "Product Details"
        });
    });
});

router.get('/Product/edit/:id',function(req,res) {
    Product.get(req.params.id, function (row) {
        res.render('form', {
            properties: function(){
                var allProps = Object.getOwnPropertyNames(row);
                var validProps = [];
                allProps.forEach(function (prop){
                    if(ProductSchema.properties.hasOwnProperty(prop)){
                        validProps.push({
                            type: ProductSchema.properties[prop].type,
                            name: prop,
                            displayName: ProductSchema.properties[prop].displayName,
                            value: row[prop],
                            required: ProductSchema.required.includes(prop) ? "required" : "",
                            conditions: function(){
                                var conditions = "";
                                if(ProductSchema.properties[prop].type == "string"){
                                    conditions += "maxlength = \"" + ProductSchema.properties[prop].maxlength + "\" minlength = \"" + ProductSchema.properties[prop].minlength + "\"";
                                }else{
                                    conditions += "max = \"" + ProductSchema.properties[prop].max + "\" min = \"" + ProductSchema.properties[prop].min + "\"";
                                }
                                return conditions;
                            }
                        });
                    }else{
                        if(prop == "Product_id"){
                            validProps.push({
                                type: "string",
                                name: prop,
                                displayName: prop,
                                value: row[prop],
                                required: ProductSchema.required.includes(prop) ? "required" : "",
                                isHidden: "hidden"
                            })
                            
                        }
                    }
                });
                return validProps;
            },
            references: function(){
                var allRefs = [];
                if(ProductSchema.references){
                    ProductSchema.references.forEach(function(ref){
                        allRefs.push({
                            label: ref.label,
                            model: "Product",
                            relatedModel: ref.model,
                            html: ref.relation != "M-M" ? "<select name = " + ref.model + "_id name = " + ref.model + "_id id = label" + ref.model + "value = > </select><br/>": 
                                "<div id = label" + ref.model + "value>",
                            relation: ref.relation,
                            searchId: row.Product_id
                        });
                    });
            }
                return allRefs;
            },
            get hasReferences(){
                    return this.references().lenght > 0;
            },

            method: "POST",
            action: "Product/",
            title: "Edit Product"
        });
    });
});

router.get('/Product/create',function(req,res) {
    res.render('form', {
        properties: function(){
            var elem = new Product();
            var allProps = Object.getOwnPropertyNames(elem);
            var validProps = [];
            allProps.forEach(function (prop){
                if(ProductSchema.properties.hasOwnProperty(prop)){
                    validProps.push({
                        type: ProductSchema.properties[prop].type,
                        name: prop,
                        displayName: ProductSchema.properties[prop].displayName,
                        required: ProductSchema.required.includes(prop) ? "required" : "",
                        conditions: function(){
                            var conditions = "";
                            if(ProductSchema.properties[prop].type == "string"){
                                conditions += "maxlength = \"" + ProductSchema.properties[prop].maxlength + "\" minlength = \"" + ProductSchema.properties[prop].minlength + "\"";
                            }else{
                                conditions += "max = \"" + ProductSchema.properties[prop].max + "\" min = \"" + ProductSchema.properties[prop].min + "\"";
                            }
                            return conditions;
                        }
                    });
                }
            });
            return validProps;
        },
        references: function(){
            var allRefs = [];
            if(ProductSchema.references){
                ProductSchema.references.forEach(function(ref){
                    allRefs.push({
                        label: ref.label,
                        model: "Product",
                        relatedModel: ref.model,
                        html: ref.relation != "M-M" ? "<select name = " + ref.model + "_id name = " + ref.model + "_id id = label" + ref.model + "value = > </select><br/>": 
                            "<div id = label" + ref.model + "value>",
                        relation: ref.relation,
                        searchId: ""
                    });
                });
            }
            
            return allRefs;
        },
        get hasReferences(){
            return this.references().lenght > 0;
        },
        method: "POST",
        action: "Product",
        checkBoxName: "ProductcheckBox",
        title: "Create Product"
    });
});



module.exports = router;