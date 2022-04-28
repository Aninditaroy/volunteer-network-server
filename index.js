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
        const eventCollection = client.db("volunteerNetwork").collection("events");
        const volunteerListCollection = client.db("volunteerNetwork").collection("volunteer-list");
        
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

        // post new volunteers
        app.post('/volunteers',async(req,res)=>{
            const newVolunteerList = req.body;
            const result = await volunteerCollection.insertOne(newVolunteerList);
            res.send(result);
        })

        // get events api
          app.get('/events',async(req,res)=>{
            const query = {};
            const cursor = eventCollection.find(query);
            const events = await cursor.toArray();
            res.send(events);
        })

        // post new events
        app.post('/events',async(req,res)=>{
            const newEventList = req.body;
            const result = await eventCollection.insertOne(newEventList);
            res.send(result);
        })

        // get volunteer list api
        app.get('/volunteerlist',async(req,res)=>{
            const query = {};
            const cursor = volunteerListCollection.find(query);
            const volunteerList = await cursor.toArray();
            res.send(volunteerList);
        })
        // post new volunteer list
        app.post('/volunteerlist',async(req,res)=>{
            const newVolunteerList = req.body;
            const result = await volunteerListCollection.insertOne(newVolunteerList);
            res.send(result);
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
