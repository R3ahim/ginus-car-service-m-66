const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { response } = require('express');
var jwt = require('jsonwebtoken');

const port = process.env.PORT || 5000;
require('dotenv').config();

// middlewerare
app.use(cors());
app.use(express.json());

function verifuJWT (req,res,next){
     const authHeader = req.headers.authorization;
     if(!authHeader){
         return res.status(401).send({message:'unuthorize 4004'})
     }
     const token = authHeader.split(' ')[1];
     jwt.verify(token,process.env.ACCESS_TOTEN_SECRET,(err,decoded)=>{
         if(err){
             return res.status(403).send({message:'please very fy token'})
         }
         console.log('decidetd',decoded);
         req.decoded = decoded;
         next()
     })

}

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wv37g.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const serviceCollection = client.db('geniusCar').collection('service')
       const orderCollection = client.db('geniusCar').collection('order')

    //auth
    app.put('/login',async(req,res)=>{
   const user = req.body;
   const accessToken = jwt.sign(user,process.env.ACCESS_TOTEN_SECRET,{
       expiresIn:'1d'
   });
   res.send({accessToken})
    })

   
       //  SERVICES API
        app.get('/service', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
           res.send(services)
        });
        app.get('/service/:id',async(req,res)=>{
            const id = req.params.id;
             const query = {_id: ObjectId(id) };
             const service = await serviceCollection.findOne(query);
             res.send(service)
        });
        app.post('/service',async(req,res)=>{
            const newService = req.body;
            const result = await serviceCollection.insertOne(newService);
            res.send(result)

        })
        app.delete('/service/:id',async(req,res)=>{
            const id = req.params.id;
             const query = {_id: ObjectId(id) };
             const service = await serviceCollection.deleteOne(query);
             res.send(service)
        });
    //   get order 
    app.get('/order',verifuJWT, async(req,res)=>{ 
        const decodedEmail= req.decoded.email;

        const email = req.query.email;
      if(email === decodedEmail){
        const query = {email:email};
        const cursor = orderCollection.find(query);
        const orders = await cursor.toArray();
        res.send(orders)
      }
    })
        // order collection api
        app.post('/order', async(req,res)=>{
          const order = req.body;
          const result = await orderCollection.insertOne(order)
          res.send(result)

        })

    }
    finally {

    }
}

run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Hello from my personal Smarty Pant!! with auto restart')
});

app.get('/hero',(req,res)=>{
    res.send('hi from hero updated')
})


app.listen(port, () => {
    console.log('Listening to port', port)
})