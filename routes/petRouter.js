import express from 'express'
import bodyParser from 'body-parser'
import requiresLogin from '../middlewares/requiresLogin'

let router = express.Router();

router.get('/status', (req, res, next) => {
    return res.status(200).json("working");
});

module.exports = router;