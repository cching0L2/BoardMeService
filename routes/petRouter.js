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
    // Get all pets for current logged in user
    const ownerId = req.session.userId
    Pet.find({owner: ownerId}, (err, pets) => {
        if (err) {
            return next(err)
        } else {
            console.log(pets)
            return res.status(200).json(pets)
        }
    })
})

router.post('/', requiresLogin, (req, res, next) => {
    const petData = req.body.sanitize()
    petData.owner = req.session.userId

    Pet.create(petData,  (err, pet) => {
        if (err) {
            return next(err)
        } else {
            return res.status(200).json("pet created");
        }
    })
})

module.exports = router
