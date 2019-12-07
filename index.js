var express = require('express')
  , passport = require('passport')
  , cors = require('cors')
  , util = require('util')
  , LocalStrategy = require('passport-local').Strategy;




var S = require('string');


var meOn = false;
var dburl = "mongodb://localhost:27017/mynew";

const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const connection = mongoose.connect(dburl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.connection.on('connected', function () {
  console.log("Server connected")
})
mongoose.connection.on('error', err => console.log('MongoDB connection error: ${err}'));

var category = mongoose.model('cat',
  new Schema({ _id: String, categoryName: String }),
  'Categories');

var supplier = mongoose.model('sup',
  new Schema({ _id: String, supplierName: String }),
  'Supplier');

var product = mongoose.model('ItemCollection', // new item collection
  new Schema({
    _id: String, barcode: Number, itemName: String, itemDesc: String, itemQty: Number,
    itemWholesale: Number, itemRetail: Number, itemCategory: String, itemSupplier: String,
    type: String, size: Number, code: String
  }),
  'ItemCollection');

var category = mongoose.model('saveBarcode',
  new Schema({ _id: String, barcode: Number }),
  'saveBarcode ');

var salecolletion = mongoose.model('saleCollection', //salecollection daily
  new Schema({
    _id: String, date: String, time: String, soldItems: [Number],
    totalQty: Number, totalPrice: Number, totalDiscount: Number, profit: Number,
    salesman: String
  }),
  'saleCollection');

var suppBill = mongoose.model('supplierBill',  //not good should do something about it
  new Schema({
    _id: String, date: String, billNo: String, particular: String, credit: Number,
    debit: Number, balance: Number, Supplier: String
  }),
  'supplierBill');
var salesman = mongoose.model('salesman', //salesman name need some work n it
  new Schema({
    _id: String, name: String, fname: String, address: String, phone: String,
    CNIC: Number
  }),
  'salesman');
var expense = mongoose.model('expense',
  new Schema({ _id: String, date: String, dayexpense: [Number], start: Number }),
  'expense');

mongoose.model('eLedger',
  new Schema({ _id: String, date: String, time: String, expenseTitle: String, expense: Number }),
  'eLedger');
//make collection Model
//collection function to pass and search for the collection

// var db = conn.connection;

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');

// var restore = require('mongodb-restore');
// const mongoose = require('mongoose');
// var Schema = mongoose.Schema;

//***************************** */

/*const db =  mongoose.connect(dburl);*/

// const connection =  mongoose.connect('mongodb://hello:1234@ds055575.mlab.com:55575/mynew', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });  


/*var monk = require('monk');*/
/*var db = monk(dburl);
  var dburl1 = "hello:1234@ds055575.mongolab.com:55575/mynew";
  var db1 = monk(dburl1);*/

//var flash    = require('connect-flash');
/*function checkInternet(cb) {
    require('dns').lookup('google.com',function(err) {
        if (err && err.code == "ENOTFOUND") {
            cb(false);
        } else {
            cb(true);
        }
    })
}*/

// example usage:

/*
* You may think you know what the following code does.
* But you don't. Trust me.
* Fiddle with it, and you'll spend many a sleepless
* night cursing the moment you thought you'd be clever
* enough to "optimize" the code below.
* Now close this file and go play with something else.
*/

function findByUsername(username, fn) {
  var collection = db.get('loginUsers');
  collection.findOne({ username: username }, {}, function (e, docs) {
    if (docs) {
      return fn(null, docs);
    }
    else {
      return fn(null, null);
    }

  });
}
function findById(id, fn) {
  var collection = db.get('loginUsers');
  collection.findOne({ _id: id }, {}, function (e, docs) {
    if (docs) {
      return fn(null, docs);
    }
    else {
      return fn(null, null);
    }
  });
}
var app = express();
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// configure Express
app.use(cookieParser());
//app.use(express.methodOverride());
app.use(session({

  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: (40 * 60 * 60 * 1000) } // 4 hours
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(cors());
app.use(function (req, res, next) {
  req.connection = connection;
  next();
});
// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.
passport.serializeUser(function (user, done) {
  done(null, user._id);
});

passport.deserializeUser(function (id, done) {
  findById(id, function (err, user) {
    done(err, user);
  });
});
app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Headers", "Origin", "X-Requested-With", "Content-Type", "Accept")
  next();
});
app.set('port', process.env.PORT || 8100);


// Use the LocalStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a username and password), and invoke a callback
//   with a user object.  In the real world, this would query a database;
//   however, in this example we are using a baked-in set of users.
passport.use(new LocalStrategy(
  function (username, password, done) {
    // Find the user by username.  If there is no user with the given
    // username, or the password is not correct, set the user to `false` to
    // indicate failure and set a flash message.  Otherwise, return the
    // authenticated `user`.
    findByUsername(username, function (err, user) {

      if (err) { return done(err); }
      if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
      if (user.password != password) { return done(null, false, { message: 'Invalid password' }); }
      return done(null, user);
    });
  }
));


// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
//app.use(flash());
app.use('/', express.static(__dirname + '/public'));
app.use('/public/bower_components', express.static(__dirname + '/public/bower_components'));


function sendData(res, obj) {
  //console.log("finally checking object", obj);
  res.send(obj);
}



app.get('/login', function (req, res) {
  res.send({ msg: "login kr" });
});

// POST /login
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
//
//   curl -v -d "username=bob&password=secret" http://127.0.0.1:3000/login
app.post('/login',
  passport.authenticate('local', { failureRedirect: '/loginFailure' }),
  function (req, res) {


    res.send({ sucess: true });
  });
app.get('/loginFailure', function (req, res) {
  res.send({ error: true })
});

app.post('/register', function (req, res) {
  var collection = db.get("loginUsers");
  var mail = req.body.email;
  var uname = req.body.username;

  collection.findOne({ email: mail }, {}, function (e, docs) {
    if (docs) {
      res.send(false);
    }
    else {
      collection.findOne({ username: uname }, {}, function (e, docs1) {
        if (docs1) {
          res.send(false);
        }
        else {
          collection.insertOne(req.body, function (err, doc) {
            if (err)
              res.send(false);
            else
              res.send(true);
          });
        }
      });
    }
  });
});

app.post('/addCategory', function (req, res) {  /** add categorey */

  // var collection = db.get('Categories');
  var cat = mongoose.model('cat');   //  call collection  of category

  var str = S(req.body.categoryName).slugify().s // save category name from webpage

  cat.findOne({ categoryName: str }, {}, function (e, docs1) { // check if supplier is alreay added
    if (docs1) {
      res.send(false);
    }
    else {
      var obj = { categoryName: str };
      cat.collection.insertOne(obj, function (err, doc) {
        if (err) {
          console.log(err)
          res.send(false); //check false to addCat() to show alert
        }
        else {
          res.send(true); //send true to addCat() to show alert
        }
      });
    }
  });
});

app.post('/getSupDetail', function (req, res) { // did changing by mistake
  // var collection = db.get('Total_Items');
  var collection = mongoose.model('ItemCollection');
  var array = [];
  collection.find({ itemSupplier: req.body.name }, function (err, docs) {
    if (docs) {
      for (i in docs) {
        array.push(docs[i]);
      }
      res.send(array);
      // array.push(docs);
    } else if (err) {
      res.send(false);
    }
  });
});

app.post('/addBill', function (req, res) {

  // var collection = db.get('supplierBill');
  var mod = mongoose.model('supplierBill');
  var idBalance = "Balance_" + req.body.Supplier;

  mod.findOne({ idBalance: idBalance }, {}, function (er, docu) {
    if (docu !== null) {
      mod.updateOne({ idBalance: idBalance }, { $inc: { balance: +req.body.balance } }, function (err, docs) {
        if (err) { console.log(err); res.send(false); }
        else {
          if (req.body.bool === 0) {
            mod.findOne({ matchId: req.body.matchId }, {}, function (e, docs) {
              var bal = docu.balance + req.body.balance;
              var billed = { date: req.body.date, billNo: req.body.billNo, particular: req.body.particular, credit: req.body.credit, debit: req.body.debit, balance: bal, Supplier: req.body.Supplier, matchId: req.body.matchId };
              mod.collection.insertOne(billed, function (err1, doc1) {
                if (doc1) res.send(true);
                else {
                  res.send(false);
                }
              });
            });
          }
          else {
            var bal = docu.balance + req.body.balance;
            var Notbilled = { date: req.body.date, billNo: req.body.billNo, particular: req.body.particular, credit: req.body.credit, debit: req.body.debit, balance: bal, Supplier: req.body.Supplier };
            mod.collection.insertOne(Notbilled, function (err1, doc1) {
              if (err1) {
                res.send(false);
              }
              else {
                res.send(true);
              }

            });
          }
        }
      });
    }
    else {
      console.log('line 361');
      var obj = { idBalance: idBalance, balance: req.body.balance };
      mod.collection.insertOne(obj, function (err1, doc1) {
        if (err1) res.send(false);
        else {
          if (req.body.bool === 0) {
            mod.findOne({ matchId: req.body.matchId }, {}, function (e, docs) {
              var billed = { date: req.body.date, billNo: req.body.billNo, particular: req.body.particular, credit: req.body.credit, debit: req.body.debit, balance: req.body.balance, Supplier: req.body.Supplier, matchId: req.body.matchId };
              mod.collection.insertOne(billed, function (err1, doc1) {
                if (err1) res.send(false);
                else {
                  res.send(true);
                }
              });
            });
          }
          else {
            var Notbilled = { date: req.body.date, billNo: req.body.billNo, particular: req.body.particular, credit: req.body.credit, debit: req.body.debit, balance: req.body.balance, Supplier: req.body.Supplier };
            mod.collection.insertOne(Notbilled, function (err1, doc1) {
              if (err1) res.send(false);
              else {
                res.send(true);
              }
            });
          }
        }
      });
    }
  });
});

app.post('/getBill', function (req, res) {

  // var collection = db.get('supplierBill');
  var collection = mongoose.model('supplierBill');
  collection.find({ Supplier: req.body.Supplier }, {}, function (e, docs) {
    if (docs) {
      res.send(docs);
    }
    else {
      res.send(false);
    }
  });
});

app.post('/addPurchaser', function (req, res) { //'/addSuplier'
  // var collection = db.get('Supplier');
  var sup = mongoose.model('sup'); //call model for Suppiler
  var str = S(req.body.supplierName).slugify().s

  sup.findOne({ supplierName: str }, {}, function (e, docs1) { // find if supplier already created
    if (docs1) {
      res.send(false);
    }
    else {
      var obj = { supplierName: str };
      sup.collection.insertOne(obj, function (err, doc) {
        if (err) {
          res.send(false); //check false to addSup() to show alert if got error
        }
        else {
          res.send(true); //check false to addSup() to show alert succes
        }
      });
    }
  });
});

app.post('/getItem', function (req, res) {

  var collection = mongoose.model('ItemCollection');
  var barcode = S(req.body.myid).chompLeft('000000000').s;
  barcode = S(barcode).toInt();

  collection.findOne({ barcode: barcode }, {}, function (e, docs) {
    if (docs) {
      res.send(docs);
    }
    else {
      res.send(false);
    }
  });
});

app.post('/addItem', function (req, res) {

  var item = mongoose.model('ItemCollection');
  item.findOne({ itemName: req.body.itemName, itemSupplier: req.body.Supplier }, {}, function (e, docs1) { // check if supplier is alreay added
    if (docs1) {
      res.send(docs1);
    } else {
      var addBarcode = mongoose.model('saveBarcode');
      addBarcode.collection.updateOne({}, { $inc: { barcode: +1 } }, { upsert: true }, function (err, doc21) {
        if (err) {
          res.send(false);
        }
        else {
          addBarcode.collection.findOne({}, function (err, count) {
            if (err) {
              res.send(false)
            } else {
              var obj = { barcode: count.barcode, itemName: req.body.itemName, itemDesc: req.body.itemDesc, itemQty: req.body.itemQty, itemWholesale: req.body.itemWholesale, itemRetail: req.body.itemRetail, itemCategory: req.body.itemCategory, itemSupplier: req.body.itemSupplier, type: req.body.type, size: req.body.size, code: req.body.code, };
              item.collection.insertOne(obj, function (err, doc) {
                if (err) {
                  res.send(false);
                }
                else {
                  var obbb = { barcode: count.barcode }
                  res.send(obbb);
                }
              });
            }
          })

        }
      });
    }
  });

});



app.post('/getCategory', function (req, res) {

  var collection = mongoose.model('cat');

  collection.find({}, function (err, doc) {
    if (err) {

      res.send(false);
    }
    else {
      res.send(doc);
    }
  });

});

app.post('/getSupplier', function (req, res) {

  // var collection = db.get('Supplier');
  var collection = mongoose.model('sup');

  collection.find({}, function (err, doc) {
    if (err) {

      res.send(false);
    }
    else {
      res.send(doc);
    }
  });

});

app.post('/getDailySlip', function (req, res) {
  var collection = mongoose.model('saleCollection')
  var date = req.body.date;
  collection.find({ date: date }, function (err, doc) {
    if (err) {
      res.send(false);
    }
    else {
      res.send(doc);
    }
  });
});

app.post('/getSoldItems', function (req, res) {
  // var collection = db.get('saleCollection');
  var collection = mongoose.model('saleCollection');
  collection.find({}, function (err, doc) {
    if (err) {

      res.send(false);
    }
    else {

      res.send(doc.reverse());
    }
  });

});

app.post('/getMonthlySlip', function (req, res) {
  // var collection = db.get('saleCollection');
  var collection = mongoose.model('saleCollection');
  var array = [];
  var bool = false;
  collection.find({}, function (err, doc) {
    if (err) {
      res.send(false);
    }
    else {
      for (var i in doc) {

        if (S(doc[i].date).contains(req.body.date) === true) {
          array.push(doc[i]);
        }
      }
      res.send(array);
    }
  });
});

app.post('/sync', function (req, res) {

  /*checkInternet(function(isConnected) {
      if (isConnected) {
         
  
          //console.log('connected');
          CopyDatabase(res);
      } else {
          //console.log('not connected');
      }
  });*/


});

app.post('/deleteSale', function (req, res) {

  var collection = mongoose.model('saleCollection');
  var mycollect = mongoose.model('ItemCollection');

  var i = 0;

  collection.findOneAndDelete({ date: req.body.date, time: req.body.time }, function (err, doc) {
    if (err) {
      res.send(false);
    }
    else {
      for (i = 0; i < req.body.soldItems.length; i++) {
        mycollect.updateOne({ barcode: req.body.soldItems[i] }, { $inc: { itemQty: +1 } }, function (errr, docs1) {
          if (errr) {
            res.send(false);
          }
        });
      }
      res.send(true);
    }
  });
});

app.post('/returnSale', function (req, res) {

  var collect = mongoose.model('saleCollection');
  var arr = [];
  var mysold = [];
  for (var i = 0; i < req.body.sold.length; i++) {
    var barcode = S(req.body.sold[i].barcode).chompLeft('000000000').s;
    barcode = S(barcode).toInt();
    mysold.push(barcode);
  }
  var obj = { date: req.body.date, time: req.body.time, soldItems: mysold, totalQty: req.body.totalQty, totalPrice: req.body.sale, totalDiscount: req.body.discount, profit: req.body.profit };
  var my = true;
  collect.collection.insertOne(obj, function (err1, doc1) {
    if (err1) res.send(false);
    else {
      for (var i = 0; i < req.body.sold.length;) {
        if (req.body.sold[i].itemQty > 0) {
          var qty = req.body.sold[i].itemQty - 1;
        }
        var barcode = S(req.body.sold[i].barcode).chompLeft('000000000').s;
        barcode = S(barcode).toInt();
        var id = barcode;

        var myobj = { itemName: req.body.sold[i].itemName, itemDesc: req.body.sold[i].itemDesc, id: id, date: req.body.date, time: req.body.time, itemRetail: req.body.sold[i].itemRetail, itemQty: '1', itemSupplier: req.body.sold[i].itemSupplier };

        i++;
        arr.push(id);
        for (var j = 0; j < arr.length; j++) {
          if (arr[j] === id && i !== 1) {
            if (qty > 0) {
              qty = qty - 1;
            }
          }
        }
        var k = i;

        upDateit2(id, qty, k - 1, req.body.sold.length, res, req.body.time, req.body.date);

      }
    }
  });
});

app.post('/sendSale', function (req, res) {

  var collect = mongoose.model('saleCollection');
  var arr = [];
  var mysold = [];
  for (var i = 0; i < req.body.sold.length; i++) {
    var barcode = S(req.body.sold[i].barcode).chompLeft('000000000').s;
    barcode = S(barcode).toInt();
    mysold.push(barcode);
  }
  var obj = { date: req.body.date, time: req.body.time, soldItems: mysold, totalQty: req.body.totalQty, totalPrice: req.body.sale, totalDiscount: req.body.discount, profit: req.body.profit, salesman: req.body.salesman };
  var my = true;
  collect.collection.insertOne(obj, function (err1, doc1) {
    if (err1) {
      res.send(false);
    }
    else {
      for (var i = 0; i < req.body.sold.length;) {
        var qty;
        if (req.body.sold[i].itemQty > 0) {
          qty = req.body.sold[i].itemQty - 1;
        } else {
          qty = req.body.sold[i].itemQty
        }

        var barcode = S(req.body.sold[i].barcode).chompLeft('000000000').s;
        barcode = S(barcode).toInt();
        var id = barcode;

        var myobj = { itemName: req.body.sold[i].itemName, itemDesc: req.body.sold[i].itemDesc, id: id, date: req.body.date, time: req.body.time, itemRetail: req.body.sold[i].itemRetail, itemQty: '1', itemSupplier: req.body.sold[i].itemSupplier, salesman: req.body.salesman };
        i++;
        arr.push(id);
        for (var j = 0; j < arr.length; j++) {
          if (arr[j] === id && i !== 1) {
            if (qty > 0) {
              qty = qty - 1;
            }
          }
        }
        var k = i;

        upDateit(id, qty, k - 1, req.body.sold.length, res, req.body.time, req.body.date);

      }
    }
  });
});

/*
* You may think you know what the following code does.
* But you don't. Trust me.
* Fiddle with it, and you'll spend many a sleepless
* night cursing the moment you thought you'd be clever
* enough to "optimize" the code below.
* Now close this file and go play with something else.
*/
function upDateit2(id, qty, i, length, res, time, date) {
  // var collectio = db.get(collect);
  var collectio = mongoose.model('ItemCollection')
  // var collection = db.get('saleCollection');
  var collection = mongoose.model('saleCollection');

  collectio.updateOne({ barcode: id }, { $inc: { itemQty: +1 } }, function (errr, docs) {
    if (errr) res.send(false);
  });

  if (i === length - 1) {
    collection.findOne({ time: time }, {}, function (e, docs1) {
      if (docs1) {
        if (docs1.date == date) {
          var ids = docs1._id;
          res.send(ids);
        }
      }
      else {
        res.send(false);
      }
    });
  }
  else {
    return 0;
  }
}

function upDateit(id, qty, i, length, res, time, date) {

  var collectio = mongoose.model('ItemCollection');

  var collection = mongoose.model('saleCollection');
  collectio.updateOne({ barcode: id }, { $inc: { itemQty: -1 } }, function (errr, docs) {
    if (docs) {
      // res.send(false);
    }
  });
  if (i === length - 1) {
    collection.findOne({ time: time }, {}, function (e, docs1) {
      if (docs1) {
        if (docs1.date == date) {
          var ids = docs1._id;
          res.send(ids);
        }
      }
      else {
        res.send(false);
      }
    });
  }
  else {
    return 0;
  }
}

app.post('/updateEntry', function (req, res) {

  // var collect = req.body.itemCategory + '_Category';
  // var collection = db.get(collect);
  var collection = mongoose.model('ItemCollection');
  collection.updateMany({ barcode: req.body.id }, { $inc: { itemQty: +req.body.itemQty } }, function (err, docs) {
    //console.log(docs);
    if (err) { res.send(false); }
    else {
      res.send(true);
    }
  });
});

app.get('/logout', function (req, res) {
  req.session.destroy();
  req.session = null;
  req.logout();
  res.send(true);

});

app.get('/isAuthenticated', function (req, res) {
  if (req.isAuthenticated())
    res.send(true);
  else
    res.send(false);
});

app.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});


app.post('/Salesman', function (req, res) {

  var sal = mongoose.model('salesman');
  sal.findOne({ name: req.body.Name, fname: req.body.Fname }, {}, function (e, docs1) { // check if supplier is alreay added
    if (docs1) {
      res.send(docs1);
    }
    else {
      var obj = { name: req.body.Name, fname: req.body.Fname, address: req.body.Address, phone: req.body.Phone, CNIC: req.body.CNIC };
      sal.collection.insertOne(obj, function (err, doc) { //insert new supplier
        if (err) {
          res.send(false); //check return to salesman() to show alert
        }
        else {
          res.send(true); //send return to addCat() to show alert
        }
      });
    }
  });
});

app.post('/getSaleman', function (req, res) {
  var collection = mongoose.model('salesman');
  collection.find({}, function (err, doc) {
    if (err) {

      res.send(false);
    }
    else {
      res.send(doc);
    }
  });
});

app.post('/getSalemanReport', function (req, res) {
  // var collection = db.get('Total_Items');
  var collection = mongoose.model('saleCollection');
  var array = [];
  var cat = [];

  collection.find({ salesman: req.body.name }, function (err, doc) {
    if (err) {
      res.send(false);
    }
    else {
      for (var i in doc) {

        if (S(doc[i].date).contains(req.body.date) === true) {
          array.push(doc[i]);
        }
      }
      res.send(array);
    }
  });
});


app.post('/refreshStartday', function (req, res) {
  var day = mongoose.model('expense');

  day.findOne({ date: req.body.date }, function (errr, find) {
    if (find) {
      // day.updateOne({ date:req.body.date }, {start:req.body.amount}, function (errr, docs) { //update amount may be not needed
      //   if(docs){
      //     var update=true;
      //     res.send(update);
      //   }else{
      //     var update=false;
      //     res.send(update);
      //   }
      // }); // uncomment this section if update startday needs to update
      res.send(find);
    }
  });
});

app.post('/startday', function (req, res) {
  var day = mongoose.model('expense');
  day.findOne({ date: req.body.date }, function (errr, find) {
    if (find) {
      res.send(find);
    } else {
      var obj = { date: req.body.date, start: req.body.amount };
      day.collection.insertOne(obj, function (err, doc) { //insert strat day casheir money
        if (doc) {
          res.send(true);
        } else {
          res.send(false);
        }
      });
    }
  });
});

app.post('/dayExpense', function (req, res) {
  var day = mongoose.model('expense');
  day.findOne({ date: req.body.date }, function (err, doc) {
    if (doc) {
      var sub = doc.start - req.body.todayexpense;
      var todayexpense = doc.dayexpense;
      todayexpense.push(req.body.todayexpense);
      day.updateMany({ date: req.body.date }, { start: sub, dayexpense: todayexpense }, function (errr, docs) { //update amount may be not needed
        if (docs) {
          res.send(docs);
        }
      });
    } else {
      res.send(false);
    }
  });
});

app.post('/weeklyReport', async function (req, res) {
  var collection = mongoose.model('saleCollection');
  var collect = [];
  var i;
  for (i = 0; i < req.body.array.length; i++) {
    await collection.find({ date: req.body.array[i] }).then(resp => {
      if (resp.length != 0) {
        collect = collect.concat(resp);
      }
    })

  }
  res.send(collect);

});

app.post('/expenseLedger', function (req, res) {
  var eDetail = mongoose.model('eLedger')
  var obj2 ={date:req.body.date, time:req.body.time, expenseTitle:req.body.eTitle, expense:req.body.expense}
  eDetail.collection.insertOne(obj2,function(err,doc){
    if(doc){
      res.send(true);
    }
  });
});

app.post('/dailyexpense', function (req, res){
  var eDetail = mongoose.model('eLedger');
  eDetail.find({date:req.body.date},function(err, doc){
    if(doc!=null){
      res.send(doc);
    }else{
      res.send(false);
    }
  });
});
// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/#/login");
}

/*
*function InsertInto(col1,i){
*
*console.log(col1,i);
*   var col1
*    var collection=db.get(col1);
*
*      collection.find({},function (err, doc) {
*      if(doc){
*       var collection1=db1.get(col1);
*      //console.log(col1,doc);
*      collection1.insert(doc, function (err1, doc1) {
*        return i;
*         });
*       }
*      });
*  }
*
*function CopyDatabase (res) {
* db1.driver.dropDatabase();
*
*   //console.log('Me ONLINE');
*var i=0;
*var myBoo=false;
*db.driver.collectionNames(function(err,docs){
* if(docs){
*  for(;i<docs.length;i++){
*   //console.log(docs,i);
*  InsertInto(docs[i].name,i);
* if(i===docs.length){
*  //console.log('send');
*       res.send(true);
*    }
*}
*}
*else{
*  res.send(false);
*}
*});
*}
*/
