const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express')
const app = express()
var cors = require('cors')
const port = process.env.port || 5000

app.use(cors())
app.use(express.json());

const uri = "mongodb+srv://jrihan769:qPKsJ09oVUj0Ks8m@cluster0.loknebs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
    await client.connect();

    
    const userCollection = client.db("usersDB").collection("users");

    app.get('/users', async(req, res)=>{
        const cursor = userCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })
    app.get('/users/:id' , async(req, res)=>{
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const user = await userCollection.findOne(query);
      res.send(user);
    })

    

    app.post('/users', async(req, res)=>{
        const user = req.body;
        console.log('newUser', user)
        const result = await userCollection.insertOne(user);
        res.send(result);

    })

    app.put('/users/:id', async(req, res)=>{
      const id = req.params.id;
      const user = req.body;
      console.log(user)
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateUser = {
        $set: {
           name: user.name,
           email: user.email
        }
      }

      const result = await userCollection.updateOne(filter, updateUser, options);
      res.send(result);


    })

    app.delete('/users/:id', async(req, res)=>{
        const id = req.params.id;
        console.log('please dlt from database', id)
        const query = { _id: new ObjectId(id) };
        const result = await userCollection.deleteOne(query);
        res.send(result);

    })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!✅");

  } finally {
    // await client.close();
  }
}
run().catch(console.log);




app.get('/', (req, res) => {
  res.send('Hello World! bangladesh')
})



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})