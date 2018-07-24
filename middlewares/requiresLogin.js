import express from 'express'

const requiresLogin = (req, res, next) => {
    if (req.session && req.session.userId) {
        return next();
    } else {
        let err = new Error('You must be logged in to view this page.');
        err.status = 401;
        return next(err);
    }
}

module.exports = requiresLogin;