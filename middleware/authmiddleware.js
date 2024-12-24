const jwt = require('jsonwebtoken');
const User = require('../model/user');

const requireAuth = async (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, "the secret", async (err, decodedToken) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    console.log('Token has expired');
                } else {
                    console.log(err.message);
                }
                res.locals.user = null;
                return res.redirect('/signin');
            } else {
                try {
                    const user = await User.findById(decodedToken.id);
                    if (!user) {
                        res.locals.user = null;
                        return res.redirect('/signin');
                    }
                    res.locals.user = user;
                    next();
                } catch (err) {
                    console.error(err.message);
                    res.locals.user = null;
                    return res.redirect('/signin');
                }
            }
        });
    } else {
        res.locals.user = null;
        return res.redirect('/signin');
    }
};

const checkUser = async (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, "the secret", async (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.locals.user = null;
            } else {
                try {
                    const user = await User.findById(decodedToken.id);
                    res.locals.user = user || null;
                } catch (err) {
                    console.error(err.message);
                    res.locals.user = null;
                }
            }
            next();
        });
    } else {
        res.locals.user = null;
        next();
    }
};

module.exports = { requireAuth, checkUser };
