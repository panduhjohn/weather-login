const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const User = require('../routes/users/models/Users');

// this places the mongo user id into passport sessions
passport.serializeUser((user, done) => {
    done(null, user._id);
});

//this gives us out req.user to use throughout the app
passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

//create login middleware
// local-login names the middleware
passport.use(
    'local-login',
    //usernameField defaults to name, but we named it email. these fields are expected
    new localStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        (req, email, password, done) => {
            //search for user
            User.findOne({ email: req.body.email }, (err, user) => {
                if (err) {
                    console.log('Login error: ', err);
                    //return the error and no user
                    return done(err, null);
                }
                if (!user) {
                    console.log('No user found');
                    return done(
                        null,
                        false,
                        req.flash('errors', 'No user has been found')
                    );
                }
                console.log(password);
                console.log('user', user.password);
                if (password === user.password) {
                    console.log('yes');
                } else {
                    console.log('no');
                }
                //unencrypt and compare password
                bcrypt
                    .compare(password, user.password)
                    .then(result => {
                        console.log('user...', user);
                        console.log('result', result);
                        if (!result) {
                            return done(
                                null,
                                false,
                                console.log('user not found')
                                // req.flash('errors', 'Check email or password')
                            );
                        } else {
                            return done(null, user);
                        }
                    })
                    .catch(err => {
                        throw err;
                    });
            });
        }
    )
);
