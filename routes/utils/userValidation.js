const { check } = require('express-validator');

const userValidation = [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please Include valid email').isEmail(),
    check('password','Password must be at least 3 characters').isLength({min: 3})
];

module.exports = userValidation;
