var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require("../models/user.js");

// Register 
router.get('/register', function (req, res) {
	res.render('register');
});
// Login
router.get('/login', function (req, res) {
	res.render('login');
});

// Register POST
router.post('/register', function (req, res) {
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
	if (errors) {
		res.render('register', {
			errors: errors
		});

	} else {
		var newUser = new User({
			name: name,
			email: email,
			username: username,
			password: password
		});

		User.createUser(newUser, (err, user) => {
			if (err) throw err;
			console.log(err);
		});

		req.flash("success_msg", "You are registered and can now login.");
		res.redirect('/users/login');
	}

});

passport.use(new LocalStrategy(
	function (username, password, done) {
		User.getUserByUsername(username, function (err, user) {
			if (err) throw err;
			if (!user) {
				return done(null, false, { message: 'Unknown User' });
			}
			User.comparePassword(password, user.password, function (err, isMatch) {
				if (err) throw err;
				if (isMatch) {
					return done(null, user);
				} else {
					return done(null, flase, { message: 'Invalid password' });
				}

			});


		});
	}
));

passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.getUserById(id, function (err, user) {
		done(err, user);
	});
});

router.post('/login',
	passport.authenticate('local', { successRedirect: '/', failureRedirect: '/users/login', failureFlash: true }),
	function (req, res) {
		res.redirect('/');
	});

router.get('/logout', function (req, res, next) {
	req.logout();
	req.flash("success_msg", "Successfully logged out from session.");
	res.redirect("/");
});


module.exports = router;
