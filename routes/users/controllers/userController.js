
const User = require('../models/Users');
const { validationResult } = require('express-validator');
const fetch = require('node-fetch');
const passport = require('passport');
require('dotenv').config();
require('../../../lib/passport');

module.exports = {
    renderIndex: (req, res, next) => {
        if (req.isAuthenticated()) {
            return res.render('main/homepage')
        }
        return res.redirect('/users/login')
    },

    renderLogin: (req, res) => {
        return res.render('auth/login', { errors: req.flash('errors') });
    },

    login: passport.authenticate('local-login', {
        successRedirect: '/users/',
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
                                return res.redirect('/users');
                            }
                        });
                    })
                    .catch(err => {
                        return next(err);
                    });
            })
            .catch(err => console.log(err));
    },

    // renderWeather: (req, res) => {
    //     if (req.isAuthenticated()) {
    //         return res.render('main/homepage')
    //     }
    //     return res.redirect('/users/login')
    // },

    getWeather: (req, res) => {
        if (req.isAuthenticated()) {
            const cityName = req.query;
            // const cityName = req.query;
            console.log('req.query', req.query);
            console.log('req.params', req.params);
            const key = process.env.WEATHER_API;
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName.cityName}&appid=${key}&units=imperial`;

           
            fetch(url)
                .then(res => res.json())
                // .then(data => console.log(data))
                .then((data) => {
                   console.log('CLG DATA', data);
                    return res.render('main/weather', { data });
                })
                .catch(err => console.log('Error in fetch', err));
        }
        // return res.redirect('/users/login'); //! this causes Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client for some reason.. 
    },

    renderRegister: (req, res) => {
        return res.render('auth/register', { errors: req.flash('errors') });
    },

    logout: (req, res) => {
        req.logout();
        req.flash('successMessage', 'you are now logged out');
        req.session.destroy();
        return res.redirect('/');
    },

    render404: (req, res) => {
        return res.render('main/404')
    }

};
