const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
require("dotenv").config();
app.use(
  cors({
    origin: ["http://localhost:5173", "https://eventer-9064e.web.app"],
    credentials: true,
  })
);

app.use(express.json());

// eTuDsFiXOai7SIlj
// eventer

// mongoDB's code here

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.mmdewqm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    //      my code base here
    const dataCollection = client.db("eventerDB").collection("allServiceData");
    const bookedCollection = client.db("eventerDB").collection("allBookedData");

    // this api for adding services
    app.post("/addServices", async (req, res) => {
      const newitem = req.body;
      const result = await dataCollection.insertOne(newitem);
      res.send(result);
    });
    app.post("/addBookedService", async (req, res) => {
      const newitem = req.body;
      const result = await bookedCollection.insertOne(newitem);
      res.send(result);
    });

    // for showing all booked service data
    app.get("/allBookedServices", async (req, res) => {
      const cursor = bookedCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    // for showing all service data
    app.get("/allServices", async (req, res) => {
      const cursor = dataCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    // for showing serached  service data
    app.get("/searched/:key", async (req, res) => {
      let result = await dataCollection
        .find({
          $or: [
            {
              serviceName: { $regex: req.params.key },
            },
          ],
        })
        .toArray();

      res.send(result);
    });

    // for showing single data info. if i can't do this so im not able to show single data info
    app.get("/allServices/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };

      const result = await dataCollection.findOne(query);
      res.send(result);
    });

    // data update

    app.put("/allServices/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateServices = req.body;
      const craft = {
        $set: {
          imageUrl: updateServices.imageUrl,
          serviceName: updateServices.serviceName,
          price: updateServices.price,
          description: updateServices.description,
          serviceArea: updateServices.serviceArea,
        },
      };
      const result = await dataCollection.updateOne(filter, craft, options);
      res.send(result);
    });
    // booked data update

    app.put("/allBookedServices/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };

      const options = { upsert: true };
      const updateBookedServicesStatus = req.body;
      const craft = {
        $set: {
          servicestatus: updateBookedServicesStatus.servicestatus,
        },
      };
      const result = await bookedCollection.updateOne(filter, craft, options);
      res.send(result);
      console.log(result);
    });

    // for data delating

    app.delete("/allServices/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await dataCollection.deleteOne(query);

      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Eventer server is Here");
});
app.listen(port, (req, res) => {
  console.log(`Server is runnig on Port ${port}`);
});
