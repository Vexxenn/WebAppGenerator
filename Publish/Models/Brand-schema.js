module.exports = {
    "title": "Brand",
    "description": "A brand used to indicate who created a product",
    "type": "object",
    "properties": {
        "name": {
            "description": "The name of the brand",
            "type": "string",
            "displayName": "Name"
        },
        "acronym":{
            "description": "Abbreviation of the original name",
            "type": "string",
            "displayName": "Acronym"
        }
    },
    "required": ["name", "acronym"]
}
    