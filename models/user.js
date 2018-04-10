const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

// user schema
var UserSchema = mongoose.Schema({
    name: {
        type: string
    },
    username:{
        type: string,
        index: true,
    },
    email: {
        type: string,

    },
    password: {
        type: string,

    }
},{
    timestamps: true
});

var User = module.exports = mongoose.model("User", UserSchema);

module.exports.createUser = function(newUser, callback){
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            newUser.password = hash;
            newUser.save(callback);
        });
    });

}