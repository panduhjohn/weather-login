
const User = require('../models/Users');
const { validationResult } = require('express-validator');
const fetch = require('node-fetch');
const passport = require('passport');
require('dotenv').config();
require('../../../lib/passport');

module.exports = {
    renderLogin: (req, res) => {
        return res.render('auth/login', { errors: req.flash('errors') });
    },

    login: passport.authenticate('local-login', {
        successRedirect: '/users/weather',
        failureRedirect: '/users/login',
        failureFlash: true
    }),

    register: (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        User.findOne({ email: req.body.email })
            .then(user => {
                if (user) {
                    // return req.flash('errors', 'User already exists');
                    return res
                        .status(400)
                        .json({ message: 'Users exists', user });
                }
                const newUser = new User();

                // const salt = bcrypt.genSaltSync(10); //salts PW
                // const hash = bcrypt.hashSync(req.body.password, salt); //Hashes PW

                newUser.name = req.body.name;
                newUser.email = req.body.email;
                newUser.password = req.body.password;

                newUser
                    .save()
                    .then(user => {
                        req.login(user, err => {
                            if (err) {
                                return res.status(400).json({
                                    confirmation: false,
                                    message: err
                                });
                            } else {
                                return res.redirect('/users/weather');
                            }
                        });
                    })
                    .catch(err => {
                        return next(err);
                    });
            })
            .catch(err => console.log(err));
    },

    getWeather: (req, res) => {
        if (req.isAuthenticated()) {
            const cityName = 'london';
            const key = process.env.WEATHER_API;
            const url = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${key}`;

            fetch(url)
                .then(res => res.json())
                // .then(data => console.log(data))
                .then(data => {
                    return res.render('main/weather', { data });
                })

                // return res.render('main/weather', { data });

                .catch(err => console.log('Error in fetch', err));
        }
        res.redirect('/users/login');
    },

    renderRegister: (req, res) => {
        return res.render('auth/register');
    },

    logout: (req, res) => {
        req.logout();
        req.session.destroy();
        return res.redirect('/');
    },


};
