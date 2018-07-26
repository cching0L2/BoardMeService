import express from 'express'
import bodyParser from 'body-parser'
import User from '../model/user'
import requiresLogin from '../middlewares/requiresLogin'

let router = express.Router();

router.get('/', (req, res, next) => {
  return res.status(200).json("working");
});

// POST /register
router.post('/register', (req, res, next) => {
    if (req.body.password !== req .body.passwordConf) {
        let err = new Error("Passwords do not match");
        err.status = 400;
        return next(err);
    }

    if (req.body.email &&
      req.body.username &&
      req.body.password &&
      req.body.passwordConf) {
      const userData = {
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        passwordConf: req.body.passwordConf,
      }

      // Check if an existing user exists 
      User.find().or([{ username: req.body.username }, { email: req.body.email }]).exec((err, existingUser) => {
        if (existingUser && existingUser.length > 0) {
          let err = new Error("User already exists");
          err.status = 400;
          return next(err);
        }

        // Create user
        User.create(userData,  (err, user) => {
          if (err) {
              return next(err)
          } else {
              return res.status(200).json("user created");
          }
        });
      });
    } else {
      let err = new Error("All fields required");
      err.status = 400;
      return next(err);
    }
});

// POST /login
router.post('/login', (req, res, next) => {
  if (req.body.email &&
    req.body.password) {
    User.authenticate(req.body.email, req.body.password, (err, loggedInUser) => {
      if (err) {
        return next(err);
      } else {
        req.session.userId =  loggedInUser.id;
        return res.status(200).json("Login successful");
      }
    })
  } else {
    let err = new Error("All fields required");
    err.status = 400;
    return next(err);
  }
});

// GET /logout
router.get('/logout', (req, res, next) => {
    if (req.session) {
        // Delete user session
        req.session.destroy((err) => {
            if (err) {
                return next(err);
            } else {
                return res.redirect('/');
            }
        });
    }
});

module.exports = router