var express = require('Express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api',require('../Publish/Controllers/Api.js'));

var server = app.listen(8084,function () {
    console.log('Example app listening on port 8084');
});
