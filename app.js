var express=require("express");
var bodyParser = require('body-parser');
var fs = require('fs');
var crypto = require('crypto');
var methodOverride = require('method-override');
var mongoose = require('mongoose');

var app = express();
var port = process.env.PORT || 8081;

var root = 'D://private/offline/';
var publicDir = root + '/public';
var keyDir = root + '/keys';


app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride());


// allow cross origin resource sharing. You might want to change the origin to "*" to allow all origins, or restricted to a specific domain: "http://localhost"
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "POST, GET, PUT, OPTIONS, DELETE");

  next();
});

mongoose.connect('mongodb://proximus.modulusmongo.net:27017/moGixy7h');

// middleware handles the raw data.
app.use(function(req, res, next){
  var data = '';
  req.on('data', function(chunk){
    data += chunk;
  });
  req.on('end', function(){
    req.rawBody = data;
    next();
  });
});


// rendering
// app.set('view engine', 'jade');


/*Run the server.*/
app.listen(9999,function(){
    console.log("Working on port 9999");
});


var User = mongoose.model('User', {
  name: String,
  publicKeyPem: String,
  passphrase: String
});


app.get('/api/users', function(req, res){
  User.find(function(err, users){
    if(err){
      res.send(err);
    }

    res.json(users);
  });
});

app.post('/api/users', function(req, res){
  User.create({
    name: req.body.name,
    publicKeyPem: req.body.publicKeyPem
  }, function(err, user){
    if(err){
      res.send(err);
    }

    User.find(function(err, users){
      if(err){
        res.end(err);
      }

      res.json(users);
    });
  });
});

app.get('/api/users/:id', function(req, res){
  User.find({
    _id: req.params.id
  }, function(err, user){
    if(err){
      res.send(err);
    }

    res.json(user);
  })
});



app.get('/', function(req, res){
  res.sendfile('./public/index.html');
});
