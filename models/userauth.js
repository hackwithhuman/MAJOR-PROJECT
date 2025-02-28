const { type } = require("express/lib/response");
const { string, required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email:{
        type : String,
        required:true
    },
       
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);

// the password and user-name mangoose passport autometically define while login or signup 
// no need to define longer