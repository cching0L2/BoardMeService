import mongoose from 'mongoose'

let PetSchema = new mongoose.Schema({
    name: {type: String, required: true},
    type: {
        type: String,
        enum: ['dog', 'cat', 'others'],
        required: true
    },
    status: {
        isIdle: {type: Boolean, default: false},
        // TODO: change this to a ref to business model later
        location: {type: String, default: null},
    },
    breed: {type: String, trim: true},
    owner: {type: String, ref: 'User', required: true},
    birthday: {type: Number},
    createdAt: {type: Date, default: Date.now}
});

const Pet = mongoose.model('Pet', PetSchema);
module.exports = Pet;