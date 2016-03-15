var express = require('express');
var app             = express();
var mongoose        = require('mongoose');
var morgan          = require('morgan');
var bodyParser      = require('body-parser');
var methodOverride  = require('method-override');
module.exports = function() {

    

    // Logging and parsing.
    //// Sets static files location to public.
    app.use(express.static(__dirname + '/public'));
    //// Use node modules.
    app.use('/node_modules', express.static(__dirname + '/node_modules'));
    //// Log with Morgan.
    app.use(morgan('dev'));

    //// Parse application/json.
    app.use(bodyParser.json());
    //// Parse application/x-www-form-urlencoded.
    app.use(bodyParser.urlencoded({extended: true}));
    //// Allows bodyParser to look at raw text.
    app.use(bodyParser.text());
    //// Prase application/vdn.api+json as json.
    app.use(bodyParser.json({type: 'application/vnd.api+json'}));
    app.use(methodOverride());

    require('../app/routes/index.server.routes.js')(app);

    return app;
};

