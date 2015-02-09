var express = require('express');
var app = express();
var parser = require('body-parser');

app.use(parser.urlencoded({extended: true}));
app.use(parser.json());

var port = process.env.PORT || 8080;

var router = express.Router();

// allow cross origin resource sharing. You might want to change the origin to "*" to allow all origins, or restricted to a specific domain: "http://localhost"
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "POST, GET, PUT, OPTIONS, DELETE");

  next();
});

// register router
app.use('/', router);

router.get('/', function(req, res){
  res.json({
    message: 'Hello World!'
  });
});

router.get('/profiles', function(req, res){
  res.json({

  });
});

// profile
router.route('/profiles/:user_id')
  // get a user profile
  .get(function(req, res){
    var userID = req.params.user_id || 1;
    res.json({
      message: 'Requesting profile: ' + userID
    });
  })
  // update a user profile
  .put(function(req, res){
    var profile = req;
    res.json({
      message: 'Profile updated: ' + req.params.user_id
    });
  })
  .delete(function(req, res){
    res.json({
      message: 'Profile deleted: ' + req.params.user_id
    });
  })

app.listen(port);
console.log('REST server started at: http://localhost:' + port);