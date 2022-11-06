const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5005;

// Middleware
app.use(cors());
app.use(express.json());

//FROM mongodb connect
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.hufticd.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    //access the collection
    const productCollection = client.db("emaJohn").collection("products");
    //create api
    app.get("/products", async (req, res) => {
      const query = {};
      const cursor = productCollection.find(query);
      const products = await cursor.toArray();
      // workinG pagination
      // const products = await cursor.limit(10).toArray();//Only 10 data will pass to the client site.//generally we don't do this.
      const count = await productCollection.estimatedDocumentCount();
      res.send({ count, products });
    });
  } finally {
  }
}
run().catch((err) => console.log(err));

//FROM mongodb connect

app.get("/", (req, res) => {
  res.send("Welcome to ema-john server.");
});

app.listen(port, () => {
  console.log(`ema-john is running on PORT: ${port}`);
});
