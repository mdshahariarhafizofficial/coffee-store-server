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
    const userCollection = database.collection('users')

    // -------------- CRUD Operation --------------

    // Post
    app.post('/coffees', async(req, res) => {
      const newCoffee = req.body;
      console.log("New Added Coffee :", newCoffee);
      const result = await coffeeCollection.insertOne(newCoffee);
      res.send(result)
    })

    // User post
    app.post('/users', async (req, res) => {
      const userInfo = req.body;
      console.log("New user : ", userInfo);
      const result = await userCollection.insertOne(userInfo);
      res.send(result);
    } )

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

    // Get user
    app.get('/users', async (req, res) => {
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })

    // Delete
    app.delete("/coffees/:id", async (req, res) => {
      const id = req.params.id;  
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.deleteOne(query);
      res.send(result)
    } )

    // Delete User 
    app.delete('/users/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result)
    })

    // Update 
    app.put('/coffees/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateCoffee = req.body;
      const updateDoc = {
        $set: updateCoffee
      };
      const result = await coffeeCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    } )

    // Update user
    app.patch('/users', async (req, res) => {
      const { email, lastSignInTime } = req.body;
      const filter = { email: email }
      const updatedDoc = {
        $set:{
          lastSignInTime: lastSignInTime
        }
      };
      const result = await userCollection.updateOne(filter, updatedDoc)
      res.send(result)
    })


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