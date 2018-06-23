module.exports = {
    "title": "Product",
    "description": "A product to be sold on a online store",
    "type": "object",
    "properties": {
        "barCode": {
            "description": "The barCode of the product",
            "type": "string",
            "maxlength": 12,
            "unique": true,
            "displayName": "Bar Code"
        },
        "name": {
            "description": "Name of the product",
            "type": "string",
            "displayName": "Name"
        },
        "price": {
            "description":"Price of the product",
            "type":"number",
            "min":0,
            "displayName": "Price"
        },
        "description":{
            "description":"Product description",
            "type":"string",
            "displayName": "Description"
        }
    },
    "required": ["barCode", "name", "price"],
    "references": [{
        "model": "Type",
        "relation": "1-M",
        "label": "name"
    },
    {
        "model": "Brand",
        "relation": "1-M",
        "label": "name"
    },
    {
        "model": "Sale",
        "relation": "M-M",
        "label": "identificationNumber"
    }]
}