const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('index')
});

// router.get('/*', (req, res) => {
//     return res.render('main/404test');
// })


module.exports = router;
