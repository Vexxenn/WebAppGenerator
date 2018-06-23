module.exports = {
    "title": "Sale",
    "description": "A sale containing information about a purchase",
    "type": "object",
    "properties": {
        "identificationNumber": {
            "description": "The identification number of the sale",
            "type": "string",
            "maxlength": 12,
            "unique": true,
            "displayName": "Identification Number"
        },
        "issueDate": {
            "description": "When the sale was published",
            "type": "string",
            "displayName": "Issue Date"
        },
        "issueLocation":{
            "description": "Place where sale was published",
            "type": "string",
            "displayName": "Issue Location"
        }
    },
    "required": ["identificationNumber", "issueDate", "issueLocation"],
    "references": [
    {
        "model": "Product",
        "relation": "M-M",
        "label": "barCode"
    }]
}