const mongoose = require('mongoose');
const passportLocalMongoose = require("passport-local-mongoose");
const Soup = require('../models/Soup');

const userSchema = mongoose.Schema({
    name: String,
    lastName: String,
    address: String,
    username: String,
    password: String,
    order: [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Soup'
    }],
  });
userSchema.plugin(passportLocalMongoose);
  
module.exports = mongoose.model("User", userSchema);