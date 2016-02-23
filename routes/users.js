var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/test-page', function(req, res) {
  var name = req.body.name,
      color = req.body.color;
  // ...
});


module.exports = router;
