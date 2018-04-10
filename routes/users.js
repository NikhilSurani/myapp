var express = require('express');
var router = express.Router();
var user = require("../models/user.js");

// Register 
router.get('/register', function(req, res){
	res.render('register');
});
// Login
router.get('/login', function(req, res){
	res.render('login');
});

// Register POST
router.post('/register', function(req, res){
	let name = req.body.name;
	let username = req.body.username;
	let email = req.body.email;
	let password = req.body.password;
	let password2 = req.body.password2;
	let doc = req.body.doc;

	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('username', 'username is required').notEmpty();
	req.checkBody('email', 'E-mail is required').notEmpty();
	req.checkBody('email', 'E-mail is not valid').isEmail();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'password do not match').equals(req.body.password);

	var errors = req.validationErrors();
	if(errors){
		res.render('register', {
			errors: errors
		});

	}else {
		var newUser = new User({
			name: name,
			email: email,
			username: username,
			password: password
		});

		user.createUser(newUser, (err, user)=> {
			if(err) throw err; 
			console.log(err);
		});

		req.flash("success_msg", "You are registered and can now login.");		
		res.redirect('/users/login');
	}
	
});
 
module.exports = router;
