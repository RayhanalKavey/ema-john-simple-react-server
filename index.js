const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5005;

// Middleware
app.use(cors());
app.use(express.json());

//FROM mongodb connect
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.hufticd.mongodb.net/?retryWrites=true&w=majority`;
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
      // workinG pagination starT
      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);
      // console.log(page, size);
      // workinG pagination enD

      const query = {};
      const cursor = productCollection.find(query);
      // workinG pagination
      const products = await cursor
        .skip(page * size)
        .limit(size)
        .toArray();
      const count = await productCollection.estimatedDocumentCount();
      res.send({ count, products });
    });

    app.post("/productsByIds", async (req, res) => {
      const ids = req.body;
      const objectIds = ids.map((id) => ObjectId(id)); //je product gula drkr segula ber kore new array banano.
      const query = { _id: { $in: objectIds } };
      const cursor = productCollection.find(query);
      const products = await cursor.toArray();
      res.send(products);
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
