var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var User = require('../model/user');

var requiresLogin = require('../middlewares/requiresLogin');

router.get('/', function(req, res, next) {
    return res.status(200).json("working");
});

// POST /register
router.post('/register', function(req, res, next) {
    if (req.body.password !== req.body.passwordConf) {
        var err = new Error("Passwords do not match");
        err.status = 400;
        return next(err);
    }

    if (req.body.email &&
      req.body.username &&
      req.body.password &&
      req.body.passwordConf) {
      var userData = {
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        passwordConf: req.body.passwordConf,
      }

      // Check if an existing user exists 
      User.find().or([{ username: req.body.username }, { email: req.body.email }]).exec(function(err, existingUser) {
        if (existingUser && existingUser.length > 0) {
          var err = new Error("User already exists");
          err.status = 400;
          return next(err);
        }

        // Create user
        User.create(userData, function (err, user) {
          if (err) {
              return next(err)
          } else {
              return res.status(200).json("user created");
              return res.redirect('/user');
          }
        });
      });
    } else {
      var err = new Error("All fields required");
      err.status = 400;
      return next(err);
    }
});

// POST /login
router.post('/login', function(req, res, next) {
  if (req.body.email &&
    req.body.password) {
    User.authenticate(req.body.email, req.body.password, function(err, loggedInUser) {
      if (err) {
        return next(err);
      } else {
        req.session.userId =  loggedInUser.id;
        return res.status(200).json("Login successful");
      }
    })
  } else {
    var err = new Error("All fields required");
    err.status = 400;
    return next(err);
  }
});

// GET /logout
router.get('/logout', function(req, res, next) {
    if (req.session) {
        // Delete user session
        req.session.destroy(function(err) {
            if (err) {
                return next(err);
            } else {
                return res.redirect('/');
            }
        });
    }
});

module.exports = router;