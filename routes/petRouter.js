var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var requiresLogin = require('../middlewares/requiresLogin');

router.get('/status', function(req, res, next) {
    return res.status(200).json("working");
});

module.exports = router;