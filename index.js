const express = require("express");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const app = express();
const port = process.env.POST || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("your server is work");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zhrby.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
//   "mongodb+srv://todo-task:SBzb6Vko8uDfBlmC@cluster0.zhrby.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    const userCollection = client.db("ToDo-Task").collection("user");
    const taskCollection = client.db("ToDo-Task").collection("task");

    app.post("/user", async (req, res) => {
      const body = req.body;
      const result = await userCollection.insertOne(body);
      res.send(result);
    });
    app.post("/task", async (req, res) => {
      const body = req.body;
      const newTask = {
        ...body,
        createdAt: new Date(),
      };
      const result = await taskCollection.insertOne(newTask);
      res.send(result);
    });
    app.get("/task/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await taskCollection.findOne(query);
      res.send(result);
    });
    app.get("/task", async (req, res) => {
      const result = await taskCollection.find().toArray();
      res.send(result);
    });
    app.delete("/task/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await taskCollection.deleteOne(query);
      res.send(result);
    });


    app.patch("/task/update/:id", async (req, res) => {
      const id = req.params.id;

      const query = { _id: new ObjectId(id) };
      const updatedData = req.body;

      const updateDoc = {
        $set: {
          name: updatedData.name,
          description: updatedData.description,
          category: updatedData.category,
          // Add any other fields you want to update here
        },
      };

      const result = await taskCollection.updateOne(query, updateDoc);
      res.send(result);
    });
    app.patch("/task/:id", async (req, res) => {
      const id = req.params.id;

      const query = { _id: new ObjectId(id) };
      const updatedData = req.body;

      const updateDoc = {
        $set: {
          // name: updatedData.name,
          // description: updatedData.description,
          category: updatedData.category,
          // Add any other fields you want to update here
        },
      };

      const result = await taskCollection.updateOne(query, updateDoc);
      res.send(result);
    });
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`the job port is ${port}`);
});
