const express = require('express');
const router = express.Router();


const userValidation = require('../utils/userValidation');
const userController = require('./controllers/userController')

require('../../lib/passport');

/* GET users listing. */
router.get('/login', userController.renderLogin);
router.post('/login', userController.login);

router.get('/logout', userController.logout);

router.get('/register', userController.renderRegister);
router.post('/register', userValidation, userController.register);

router.get('/weather', userController.getWeather);



module.exports = router;


// const getWeather = (url, id) => {
//     const tempConv = val => Math.round((val * 9) / 5 + 32);
// }