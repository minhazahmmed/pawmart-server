const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const { populate } = require("dotenv");
require("dotenv").config();
const port = 3000;

const app = express();
app.use(cors());
app.use(express.json());

const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.t8lhpna.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // await client.connect();

    const database = client.db("petService");
    const petServices = database.collection("services");
    const orderCollections = database.collection("orders");

    //  Post or add services in database

     app.post("/services", async (req, res) => {
      const data = req.body;
      const date = new Date();
      data.createdAt = date;
      console.log(data);

      const result = await petServices.insertOne(data);
      res.send(result);
    });

    // get services from database

     app.get("/services", async (req, res) => {
      const {category} = req.query;
      console.log(category)
      const query = {}
      if(category){
        query.category = category;
      
      }
    
      const result = await petServices.find(query).toArray();
      res.send(result);
    });

    //get one services from database with id

     app.get("/services/:id", async (req, res) => {
      const id = req.params;
      console.log(id);

      const query = { _id: new ObjectId(id) };
      const result = await petServices.findOne(query);
      res.send(result);
    });

    //my services

     app.get("/my-services", async (req, res) => {
      const { myEmail } = req.query;
      const query = { email: myEmail };
      const result = await petServices.find(query).toArray();
      res.send(result);
    });

    // Update Service

     app.put("/update/:id", async (req, res) => {
      const data = req.body;
      const { id } = req.params;
      const query = { _id: new ObjectId(id) };
      const updateServices = {
        $set: data,
      };
      const result = await petServices.updateOne(query, updateServices);
      res.send(result);
    });

// Delete Services

app.delete('/delete/:id',async(req,res)=>{
  const id = req.params;
 const query = { _id: new ObjectId(id) };
 const result = await petServices.deleteOne(query)
 res.send(result)
})


// Orders
app.post('/orders',async(req,res)=>{
  const data = req.body;
  console.log(data);
  const result = await orderCollections.insertOne(data)
  res.status(201).send(result)
  

})

// Show My Orders
app.get('/orders',async(req,res)=>{
  const result = await orderCollections.find().toArray();
  res.status(200).send(result)
})


    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // await client.close();
  }
  
}
run().catch(console.dir);


app.get("/", (req, res) => {
  res.send("Hello developers");
});

app.listen(port, () => {
  console.log(`App is listen to port: ${port}`);
});
