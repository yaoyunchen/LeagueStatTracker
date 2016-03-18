// Mongoose dependency for creating schemas
var mongoose = require('mongoose');

var RegionSchema = new mongoose.Schema({
  id: Number,
  name: String,
})

mongoose.model('Region', RegionSchema);

