var express=require("express");
var bodyParser = require('body-parser');
var fs = require('fs');
var methodOverride = require('method-override');
var mongoose = require('mongoose');

var app = express();
var port = process.env.PORT || 9999;


mongoose.connect('mongodb://liy:0000@proximus.modulusmongo.net:27017/moGixy7h');

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


// middleware handles the raw data.
// app.use(function(req, res, next){
//   console.log('data received')
//   var data = '';
//   req.on('data', function(chunk){
//     data += chunk;
//   });
//   req.on('end', function(){
//     req.rawBody = data;
//     next();
//   });
// });


// rendering
//app.set('view engine', 'jade');


/*Run the server.*/
app.listen(port,function(){
  console.log("Express server listening on port %d in %s mode", port, app.settings.env);
});



var User = mongoose.model('User', {
  name: String,
  publicKeyPem: String,
  // user private key signed array of messages
  data: String
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
    publicKeyPem: req.body.publicKeyPem,
    data: Object.create(null)
  }, function(err, user){
    if(err){
      console.log('error!!');
      console.log(error);
      res.send(err);
    }

    res.json(user);
  });
});

app.get('/api/users/:id', function(req, res){
  User.find({
    _id: req.params.id
  }, function(err, results){
    if(err){
      res.send(err);
    }

    res.json(results[0]);
  })
});

app.post('/api/clear', function(req, res){
  mongoose.connection.db.dropCollection('users', function(err, result){
    console.log(err);
    if(err){
      res.send(err);
    }

    res.send(result);
  });
});

app.put('/api/users/:id', function(req, res){
  console.log('update message');
  console.log(req.body.id);
  console.log(req.body.data);
  User.update({
    _id: req.body.id
  }, {
    data: JSON.stringify(req.body.data)
  }, function(err, user){
    if(err){
      res.send(err);
    }

    console.log(user);
    res.json(user);
  })
});

app.get('/', function(req, res){
  res.sendfile('./public/index.html');
});
