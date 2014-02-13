// constants
var PORT =        7676;
var PIO_ENGINE =  "ggg";
var PIO_APP_KEY =     "YEl6eKT8yitq1IUvvSwxIakSFhosRmVamsOcoGNPMOJ1lw5QvpkGu5rIybZyeQ2d";
var PIO_URL =         "http://localhost:8000";

// modules
var util =            require('util');
var pio =             require('predictionio');
var express =         require('express');
var uuid =            require('node-uuid');
//var MemoryStore =     express.session.MemoryStore;
var Datastore =       require('nedb');
var crypto =          require('crypto');





// storage
db = {};
db.users = new Datastore('db/users.db');
db.items = new Datastore('db/items.db');
db.likes = new Datastore('db/likes.db');

// You need to load each database (here we do it asynchronously)
db.users.loadDatabase();
db.items.loadDatabase();
db.likes.loadDatabase();





// predictionio init
var prediction = require('predictionio')({
    key: PIO_APP_KEY,
    baseUrl: PIO_URL,
});






// express
var app = express();

// log
app.use(express.logger('dev'));

// express+jade
app.engine('jade', require('jade').__express);
app.set('view engine', 'jade');

// express middleware
app.use(express.static(__dirname+'/public'));
app.use(express.bodyParser());
app.use(app.router);








// home
app.get("/", function(req, res){

  db.users.find({}, function(err, users){
    db.items.find({}, function(err, items){
      res.render("index", {
        users: users,
        items: items,
      });
    });
  });
});



// NEED IDSSSSSSSSSSS FOR REMOVAL
// clear
app.get("/clear", function(req, res){


  db.items.remove({}, function (err, numRemoved) {
    console.log("Removed "+numRemoved+" items");

    db.users.remove({}, function (err, numRemoved) {
      console.log("Removed "+numRemoved+" users");
      
       db.likes.remove({}, function (err, numRemoved) {
        console.log("Removed "+numRemoved+" likes");
        res.json({message: "Done."});
      });
      
    });
   

  });

});

app.get("/users/:userId/likes", function(req, res){
  var userId = req.params.userId;
  
  db.likes.find({userId: userId}, function(err, items){
    res.json(items);
  });
});


app.get("/users/add", function(req, res){
  var name = req.query.name;
  
  // add user to DB
  db.users.insert(
    {
      name: name
    }, 
    function (err, doc) {
    console.log("Saved user to store.");
    console.log(doc);
    console.log("--------------------");
    
    prediction.users.create({
      pio_uid:          doc._id,
      pio_inactive:     false,
      pio_latlng:       '0,0',
      pio_any_string:   'Test'
    }, function (err, response) {
    
      console.log("User added to predictionio:");
      console.log(err, response);
      console.log("-------------------------");
      res.json({
          message: util.format("Added user %j", doc),
      });
    });
  
  });

});

app.get("/items/add",function(req, res){

  crypto.pseudoRandomBytes(3, function(err, buf){
    var color = buf.toString('hex');
    console.log(color);
    
     // add user to DB
    db.items.insert(
      {
        color: color
      }, 
      function (err, doc) {
      console.log("Saved item to store.");
      console.log(doc);
      console.log("--------------------");
      
      prediction.items.create({
        pio_iid: doc._id,
        pio_itypes: 'Beep, Boop, Boom',
        pio_latlng: '0,0',
        pio_inactive: true,
        pio_startT: 1234567890000,
        pio_endT: 1234567890000,
        pio_price: 1,
        pio_profit: 1,
        pio_any_string: 'Test',
      }, function (err, response) {
        console.log("User added to predictionio:");
        console.log(err, response);
        console.log("-------------------------");
        res.json({
            message: util.format("Added user %j", doc),
        });
      });

    });
    
  });
  
 

});



// user likes something
app.get("/users/:userId/like/:itemId", function(req, res){

    var userId = req.params.userId;
    var itemId = req.params.itemId;
    var customOptions = {};

    db.likes.find({userId:userId, itemId:itemId}, function(err, docs){
      if(docs.length < 1){
        db.likes.insert({
          userId:userId,
          itemId:itemId,
        }, function(err, doc){
          console.log(doc);
          
          prediction.users.createAction({
              pio_engine:       PIO_ENGINE, 
              pio_uid:          userId, 
              pio_iid:          itemId,
              pio_action:       'rate',
              pio_rate:         '5',
              pio_latlng:       '0,0',
              pio_t:            Date.now(),
              pio_any_string:   'Test',
          }, function (err, response) {
              console.log("== LIKE ==");
              console.log(err, response);
              console.log("==========");
              res.json({
                  message: util.format("User %s liked item %s", userId, itemId),
              });
          });
        });
      }
    });
    
   
    
   
});

// get recommendations
app.get("/users/:userId/recommend", function(req, res){
    //get userid from session
    var userId = req.params.userId;
    
    prediction.items.recommendation({
        pio_engine:     PIO_ENGINE,
        pio_uid:        userId,
        pio_n:           4,
        pio_itypes:     'color',
        pio_latlng:     '0,0',
        pio_within:     '',
        pio_unit:       '',
        pio_attributes: '',
    }, function (err, result) {
        console.log("== RECOMMEND ==");
        console.log(err, result);
        console.log("===============");
        res.json(result);
    });
});

// listen
app.listen(PORT, function(){
  console.log('Listening on port '+PORT);
});