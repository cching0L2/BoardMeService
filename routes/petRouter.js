import express from 'express'
import bodyParser from 'body-parser'
import Pet from '../model/pet'
import User from '../model/user'
import requiresLogin from '../middlewares/requiresLogin'
import _ from 'underscore'

let router = express.Router();

router.get('/status', (req, res, next) => {
    return res.status(200).json("pet route working")
})

router.get('/:id', requiresLogin, (req, res, next) => {
    var id = req.params.id;
    Pet.findOne({_id: id}, (err, pet) => {
        if (err) {
            return next(err)
        }

        if (pet) {
            console.log(pet)
            return res.status(200).json(pet)
        }

        let notFoundErr = new Error('Pet Not Found');
        notFoundErr.status = 404;
        return next(notFoundErr)
    })
})

router.get('/', requiresLogin, (req, res, next) => {
    const ownerId = req.session.userId
    Pet.find({owner: ownerId}, (err, pets) => {
        if (err) {
            return next(err)
        } else {
            return res.status(200).json(pets)
        }
    })
})

router.post('/', requiresLogin, (req, res, next) => {
    let pet = new Pet(Pet.sanitize(req.body))
    pet.owner = req.session.userId

    Pet.create(pet,  (err, pet) => {
        if (err) {
            return next(err)
        } else {
            return res.status(200).json("pet created");
        }
    })
})

router.put('/', requiresLogin, (req, res, next) => {
    let updateData = Pet.sanitize(req.body)
    
    // TODO: use chained promises
    Pet.update({_id: updateData.id}, updateData, (err) => {
        if (err) {
            return next(err)
        }

        Pet.findOne({_id: updateData.id}, (err, pet) => {
            if (err) {
                return next(err)
            }
            return res.status(200).json(pet)
        })
    })
})

router.delete('/:id', requiresLogin, (req, res, next) => {
    var id = req.params.id;
    Pet.deleteOne({_id: id}, (err, pet) => {
        if (err) {
            return next(err)
        }
        return res.status(200).json("pet deleted")
    })
})

module.exports = router
