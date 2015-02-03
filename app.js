var express=require("express");
var parser = require('body-parser');
var fs = require('fs');
var crypto = require('crypto');
var multer  = require('multer');
var DecompressZip = require('decompress-zip');
var methodOverride = require('method-override')

var app = express();
var port = process.env.PORT || 8081;

var root = 'D://private/offline/';
var publicDir = root + '/public';
var keyDir = root + '/keys';

var uploadDone=false;

app.use(express.static(__dirname + '/public'));
app.use(parser.urlencoded({extended: true}));
app.use(parser.json());
// override method when pass a _method parameter using post
app.use(methodOverride('_method'))


// allow cross origin resource sharing. You might want to change the origin to "*" to allow all origins, or restricted to a specific domain: "http://localhost"
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "POST, GET, PUT, OPTIONS, DELETE");

  next();
});

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




/*Run the server.*/
app.listen(8080,function(){
    console.log("Working on port 8080");
});



// rendering
app.set('view engine', 'jade');



////////////////////////////////////////////
// route
// test home
app.get('/', function(req, res){
  res.render('index', { pageTitle: "This is a dummy server" });
});

// For accessing the activity directly, only used by iframe
app.get('/activities', function(req, res){
  res.render('activities/index', { activities: activities });
});

////// 5 modes
// algorithm
app.get('/algorithm', function(req, res){
  res.render('algorithm');
});

// Not on the spec, it is suppose to view the content of the playlist
app.get('/playlists/:id', function(req, res){
  res.render('playlists');
});


////////////////////////////////////////////
// web services
// recording
app.get('/api/keys/:id', function(req, res){
  var id = req.params.id;

  fs.readFile(root+'/keys/'+id, function(err, data){
    if(err){
      res.status(404).send('Not found');
    }
    else{
      res.json(JSON.parse(data));
    }
  });
});

app.post('/api/keys', function(req, res){
  var content = req.rawBody;
  console.log(content);

  var id = crypto.createHash('sha1').update(content + (new Date()).valueOf().toString()).digest('hex');


  fs.writeFile(root + '/keys/' + id, content, function(err){
      if(err){
        res.status(500).send(err.toString());
      }
      else{
        res.json(id);
      }
  });
});