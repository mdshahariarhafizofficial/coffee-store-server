const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors')
const port = process.env.PORT || 3000;

// Middle Ware
app.use(cors());
app.use(express.json());

// Mongo Db Setup

const uri = `mongodb+srv://${process.env.COFFEE_USER}:${process.env.COFFEE_KEY}@cluster0.fkarqx9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const database = client.db("coffeeDB");
    const coffeeCollection = database.collection("coffees");

    // -------------- CRUD Operation --------------

    // Post
    app.post('/coffees', async(req, res) => {
      const newCoffee = req.body;
      console.log("New Added Coffee :", newCoffee);
      const result = await coffeeCollection.insertOne(newCoffee);
      res.send(result)
    })

    // Get
    app.get('/coffees', async (req, res)=>{
      // const cursor = coffeeCollection.find();      
      // const result = await cursor.toArray();
      // res.send(result)
      const result = await coffeeCollection.find().toArray();
      res.send(result)
    })

    // Get one
    app.get('/coffees/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.findOne(query);
      res.send(result)
    } )

    // Delete
    app.delete("/coffees/:id", async (req, res) => {
      const id = req.params.id;  
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.deleteOne(query);
      res.send(result)
    } )




    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.listen( port, () => {
    console.log(`App is run on port: ${port}`);
} )