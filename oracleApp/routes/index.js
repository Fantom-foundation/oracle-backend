var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.write('oracle works');
  //res.end();

  res.render('index.html');
});

module.exports = router;
