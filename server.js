// // MODULES
// // -------
var express         = require('express');
var mongoose        = require('mongoose');
var morgan          = require('morgan');
var bodyParser      = require('body-parser');
var methodOverride  = require('method-override');
var app             = express();

require('dotenv').config();

// PORT
// ----
var port = process.env.PORT || 3000;

// EXPRESS CONFIGURATION
// Sets the connection to MongoDB.
// -------------------------------
//mongoose.connect("mongodb://localhost/LeagueStatTrackerApp");

// CONFIG FILES
// ------------
// var db = require('./config/db.js');

// MONGODB CONNECTION
// ------------------
// mongoose.connect(db.url);

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
//// Parse application/vdn.api+json as json.
app.use(bodyParser.json({type: 'application/vnd.api+json'}));
app.use(methodOverride());

// // ROUTES
// // ------
// require('./app/routes.js')(app);


// APP STARTUP
// Start up app at http://localhost:3000.
// --------------------------------------
app.listen(port);
console.log('App listening on port', port);

module.exports = app;
