import express from 'express'
import bodyParser from 'body-parser'
import Pet from '../model/pet'
import User from '../model/user'
import requiresLogin from '../middlewares/requiresLogin'

let router = express.Router();

router.get('/status', (req, res, next) => {
    return res.status(200).json("pet route working")
})

router.get('/', requiresLogin, (req, res, next) => {
    return res.status(200).json("get pets endpoint working")
})

router.post('/', requiresLogin, (req, res, next) => {
    if (!req.session || !req.session.userId) {
        let err = new Error("Invalid user session");
        err.status = 403;
        return next(err);
    }

    const petData = req.body
    petData.owner = req.session.userId

    Pet.create(petData,  (err, pet) => {
        if (err) {
            return next(err)
        } else {
            console.log(pet)
            return res.status(200).json("pet created");
        }
    })
})

module.exports = router
