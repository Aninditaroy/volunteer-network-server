const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const app = express();


// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.y0pt2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const volunteerCollection = client.db("volunteerNetwork").collection("volunteers");
        
        // volunteers api
        app.get('/volunteers',async(req,res)=>{
            const query = {};
            const cursor = volunteerCollection.find(query);
            const volunteers = await cursor.toArray();
            res.send(volunteers);
        })

        // find with id
        app.get('/volunteers/:id',async(req,res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const volunteer = await volunteerCollection.findOne(query);
            res.send(volunteer);
        })
    }
    finally {

    }
}
run().catch(console.dir);

app.get('/',(req,res)=>{
    res.send('Running volunteer network server');
})
app.listen(port, ()=>{
    console.log('Listening to port',port);
})
