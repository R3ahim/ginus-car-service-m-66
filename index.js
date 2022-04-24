const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { response } = require('express');

const port = process.env.PORT || 5000;
require('dotenv').config();

// middlewerare
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wv37g.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const serviceCollection = client.db('geniusCar').collection('service')

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
        })

    }
    finally {

    }
}

run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Hello from my personal Smarty Pant!! with auto restart')
});



app.listen(port, () => {
    console.log('Listening to port', port)
})