const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// ??MIDDLEWARE

app.use(cors());
app.use(express.json());

//pass:      n41G4mrB2cgKDylX
//user:      craft      



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rw7ggrk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    const itemCollection =client.db('itemDB').collection('items')



app.post('/item',async(req,res)=>{
  const newItem =req.body;
  console.log(newItem);
  const result =await itemCollection.insertOne(newItem);
  res.send(result)
})

app.get('/item',async(req,res)=>{
  const cursor = itemCollection.find();
  const result = await cursor.toArray();
  res.send(result);
})

app.get('/mylist/:email',async(req,res)=>{
console.log(req.params.email);
const result = await itemCollection.find({email:req.params.email}).toArray();
res.send(result)
})

app.get('/singleItem/:id',async(req,res)=>{
  const result = await itemCollection.findOne({_id: new ObjectId (req.params.id),})
  console.log(result)
  res.send(result)
})

app.put('/updateItem/:id',async(req,res) => {
  console.log(req.params.id)
  const query = {_id:new ObjectId(req.params.id) };
  const data ={
    $set:{
       image: req.body.image,
       item_name: req.body.item_name,
       subcategory_name: req.body.subcategory_name, 
       short_description: req.body.short_description,
       price: req.body.price,
       rating: req.body.rating ,
       processing_time: req.body.processing_time,
       stock_status: req.body.stock_status,
       customization: req.body.customization,
      // const user_email = form.user_email.value
       user_name: req.body.user_name
    }
  }
  const result =await itemCollection.updateOne(query,data);
  console.log(result);
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





app.get('/', (req,res )=>{
    res.send('CRAFT Store server is running')
})

app.listen(port,()=>{
    console.log(`store server is running on port:${port}`)
})