const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

// user schema
var UserSchema = mongoose.Schema({
    name:{
        type: String,
    },    
    username:{
        type: String,
        index: true,
    },
    email: {
        type: String,

    },
    password: {
        type: String,

    }
},{
    timestamps: true
});

var User = module.exports = mongoose.model("User", UserSchema);

var createUser = function(newUser, callback){
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            newUser.password = hash;
            newUser.save(callback);
        });
    });

}

var getUserByUsername =  (username, callback) => {
    var query = {username : username};
    User.findOne(query, callback);

};

var comparePassword = (candidatePassword, hash, callback) => {
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
        if(err) throw err;
        callback(null, isMatch);

    });

}
var getUserById = (id, callback) => {
    User.findById(id, callback);
}

module.exports = {
    createUser,
    getUserByUsername,
    comparePassword,
    getUserById,
}