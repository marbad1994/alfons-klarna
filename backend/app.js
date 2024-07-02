const path = require('path');
const express = require('express');
var bodyParser = require('body-parser'); 
var cors = require('cors')
const { MongoClient } = require('mongodb');
var ObjectId = require('mongodb').ObjectID;
require('dotenv').config()
var nodeBase64 = require('nodejs-base64-converter');
var jwt = require("jsonwebtoken");
const rp = require('request-promise');



function generateAccessToken(username) {
    console.log(process.env.TOKEN_SECRET)
    // expires after half and hour (1800 seconds = 30 minutes)
    return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
  }
const uri = "<mongo uri>";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
var app = express();
app.use(cors());
app.options('*', cors());

// app.use(allowCrossDomain)
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
const port = process.env.PORT || 3001

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

const APIPrefix = "/api/v1/"

app.post(APIPrefix + "login", (req, res) => {
    //res.setHeader('Access-Control-Allow-Origin', 'http://localhost/, https://greatsecret.herokuapp.com/');
    console.log(req.body)
    let username = req.body.username;
    let password = req.body.password;

    client.connect(err => {
        console.log(username)
        console.log(password)
        const coll = client.db("greatsecret").collection("admin");
        coll.count({username: username, password: password}, function(err, count) {
            if (count > 0) {
                console.log(count)
                const accessToken = generateAccessToken({ username: req.body.username });
                
                res.status(200)
                return res.json({accessToken: accessToken})
            }
            console.log(count)

            res.status(401)
            return res.json("err")
        });
        
       
        // 
    });

});

app.put(APIPrefix + "collection/:id", (req, res) => {
    //res.setHeader('Access-Control-Allow-Origin', 'http://localhost/, https://greatsecret.herokuapp.com/');
    console.log(req.body)
 
   
    client.connect(err => {
        delete req.body._id;
        const coll = client.db("greatsecret").collection("collection");
        coll.updateOne({_id: new ObjectId(req.params.id) }, { $set: {stock: req.body.stock}}, { upsert: true });
        
       
        // 
    });
    return res.json({msg: "Stock updated"})
    

});
app.post(APIPrefix + "collection", (req, res) => {
    //res.setHeader('Access-Control-Allow-Origin', 'http://localhost/, https://greatsecret.herokuapp.com/');
    let name = req.body.name
    let price = parseInt(req.body.price)
    let stock = parseInt(req.body.stock)
    let description = req.body.description.split("\n")
    let imageName = req.body.imageName
    let serial = req.body.serial

    client.connect(err => {
        const coll = client.db("greatsecret").collection("collection");
        coll.countDocuments({name: name}, function(err, count) {
            if (count < 1) {
                coll.insertOne({name: name, price: price, stock: stock, description: description, imageName: imageName, serial: serial}, function() {
                    return res.json({msg: "Product successfully added"})
                });
            } else {
                return res.json({msg: "Product already exists", error: err})
            }
        });
    });
});

app.put(APIPrefix + "collection", (req, res) => {
    //res.setHeader('Access-Control-Allow-Origin', 'http://localhost/, https://greatsecret.herokuapp.com/');
    console.log(req.body)
    let name = req.body.name
    let price = parseInt(req.body.price)
    let stock = parseInt(req.body.stock)
    let description = req.body.descriptionString.split("\n")
    let imageName = req.body.imageName
    let id = req.body._id
    let serial = req.body.serial

    client.connect(err => {
        const coll = client.db("greatsecret").collection("collection");
        coll.updateOne({_id: new ObjectId(id) }, { $set: {name: name, price: price, stock: stock, description: description, imageName: imageName, serial: serial}}, { upsert: true });      
    });

    return res.json({msg: "Product updated"})

});

app.delete(APIPrefix + "collection/:id", (req, res) => {
    //res.setHeader('Access-Control-Allow-Origin', 'http://localhost/, https://greatsecret.herokuapp.com/');
   

    client.connect(err => {
        delete req.body._id;
        const coll = client.db("greatsecret").collection("collection");
        coll.deleteOne({_id: new ObjectId(req.params.id)});      
    });

    return res.json({msg: "Product deleted"})

});

app.delete(APIPrefix + "orders/:id", (req, res) => {
    //res.setHeader('Access-Control-Allow-Origin', 'http://localhost/, https://greatsecret.herokuapp.com/');
   

    client.connect(err => {
        delete req.body._id;
        const coll = client.db("greatsecret").collection("orders");
        coll.updateOne({_id: new ObjectId(req.params.id) }, { $set: {show: false, orderStatus: "removed"}}, { upsert: true });
    });

    return res.json({msg: "Order deleted"})

});

app.put(APIPrefix + "orders/:id", (req, res) => {
    //res.setHeader('Access-Control-Allow-Origin', 'http://localhost/, https://greatsecret.herokuapp.com/');
    let show = true
    let orderStatus = "unprocessed"
    if (req.body.shipped) {
        show = false
        orderStatus = "shipped"
    }

    

    client.connect(err => {
        delete req.body._id;
        const coll = client.db("greatsecret").collection("orders");
        coll.updateOne({_id: new ObjectId(req.params.id) }, { $set: {shipped: req.body.shipped, show: show, orderStatus: orderStatus}}, { upsert: true });
    });

    return res.json({msg: "Order deleted"})

});



app.get(APIPrefix + "collection", (req, res) => {
    //res.setHeader('Access-Control-Allow-Origin', 'http://localhost/, https://greatsecret.herokuapp.com/');


    client.connect(err => {
        const coll = client.db("greatsecret").collection("collection");
        var arr = [];
        coll.find({}, function(err, docs) {
            docs.each(function(err, doc) {
                if (doc) {
                    console.log(doc)
                    arr.push(doc);


                } else {
                    return res.json(arr);
                }
            });

        });
        // 
    });

});

app.get(APIPrefix + "orders", (req, res) => {
    //res.setHeader('Access-Control-Allow-Origin', 'http://localhost/, https://greatsecret.herokuapp.com/');


    client.connect(err => {
        const coll = client.db("greatsecret").collection("orders");
        var arr = [];
        coll.find({}, function(err, docs) {
            docs.each(function(err, doc) {
                if (doc) {
                    console.log(doc)
                    arr.push(doc);


                } else {
                    return res.json(arr);
                }
            });

        });
        // 
    });

});


app.get(APIPrefix + "order-number", (req, res) => {
    //res.setHeader('Access-Control-Allow-Origin', 'http://localhost/, https://greatsecret.herokuapp.com/');


    client.connect(err => {
        const coll = client.db("greatsecret").collection("orders");
        var arr = [];
        coll.find({}, function(err, docs) {
            docs.each(function(err, doc) {
                if (doc) {
                    console.log(doc)
                    arr.push(doc);


                } else {
                    return res.json(arr.length);
                }
            });

        });
        // 
    });

});
  // K924982_6e547d5b83db

// KLARNA API-LÖSENORD
// 6EG4qOJmqp8w8PDX

app.post(APIPrefix + 'sessions', function(req, res){
    // req.setRequestHeader('Content-Type', 'application/json');
    // req.setRequestHeader('Authorization', authorizationBasic);
    // req.setRequestHeader('Accept', 'application/json');

    // res.setHeader('Access-Control-Allow-Origin', 'http://localhost/, https://greatsecret.herokuapp.com/, https://greatsecret.se/');
    var options = {
        method: 'POST',
        json: true,
        body: req.body,
        url: 'https://api.klarna.com/payments/v1/sessions',
         'auth': {
             'user': process.env.KLARNAUSER,
             'pass': process.env.PASSWORD,
            'sendImmediately': false
           }
      };
      rp(options)
      .then(function(response) {
          return res.json(response)
      })
  
    // res.send("body");
  });

  app.post(APIPrefix + 'order', function(req, res){
    // res.setHeader('Access-Control-Allow-Origin', 'http://localhost/, https://greatsecret.herokuapp.com/, https://greatsecret.se/');
    // req.setRequestHeader('Content-Type', 'application/json');
    //req.setRequestHeader('Authorization', authorizationBasic);
    // req.setRequestHeader('Accept', 'application/json');
    var options = {
        method: 'POST',
        json: true,
        body: req.body.order_lines,
        url: `https://api.klarna.com/payments/v1/authorizations/${req.body.authorization_token}/order`,
        'auth': {
            'user': process.env.KLARNAUSER,
            'pass': process.env.PASSWORD,
            'sendImmediately': false
          }
      };
      rp(options)
      .then(function(response) {
          return res.json(response)
      })
  
  });


// app.post(APIPrefix + "order", (req, res) => {
//     //res.setHeader('Access-Control-Allow-Origin', 'http://localhost/, https://greatsecret.herokuapp.com/');
//     let customer = req.body.customer
//     let order = req.body.order
//     let total = req.body.total
//     let orderNumber = req.body.orderNumber
//     const uri = "mongodb+srv://admin:admin@cluster0.woi6k.mongodb.net/greatsecret?retryWrites=true&w=majority";
//     const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
//     client.connect(err => {
//         const coll = client.db("greatsecret").collection("orders");

//         coll.insertOne({customer: customer, order: order, shipped: false, show: true, orderStatus: "unprocessed", total: total, orderNumber: orderNumber});
//     })
//     return res.json({msg: "Order successfully added"})
// });


app.use(express.static(path.join(__dirname, '../build')));
console.log(__dirname)
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

