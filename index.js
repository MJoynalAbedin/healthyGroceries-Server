const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vodjs.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  const productCollection = client.db("healthyGroceries").collection("products");
  const orderCollection = client.db("healthyGroceries").collection("orders");
  console.log('db connected')

  // app.post('/addProducts', (req, res) => {
  //   const products = req.body;
  //   productCollection.insertMany(products)
  //     .then(result => {
  //       console.log(result);
  //     })
  // })

  app.get('/products', (req, res) => {
    productCollection.find({})
    .toArray((err, documents) => {
      res.send(documents);
    })
  })

  app.post('/addOrder', (req, res) => {
    const order = req.body;
    console.log(order)
    orderCollection.insertOne(order)
      .then(result => {
        console.log(result.insertedCount);
      })
  })

  app.get('/orders', (req, res) => {
    // console.log(req.query.email);
    orderCollection.find({email: req.query.email})
    .toArray((err, documents) => {
      res.send(documents);
    })
  })


});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

const port = 5055;
app.listen(process.env.PORT || port)