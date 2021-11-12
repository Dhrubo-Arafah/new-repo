const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();
const cors = require('cors')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId

//middleware
app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wgl4i.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("lafka");
        const servicesCollection = database.collection("services");
        const ordersCollection = database.collection("orders");

        // const service = {
        //     "name": "Green Tea",
        //     "description": "Is it better to drink organic tea?Choosing organic can be a very good option.Not only is organic food linked to a reduced risk of cancer, but by choosing organic you are also doing your part in keeping the planet healthier. Health benefits of organic tea should be higher, as there will be no synthetic pesticide or herbicide residue on the leaves.",
        //     "img": "https://cdn.dribbble.com/users/1137872/screenshots/5830378/tea_packaging_design.png",
        //     "price": "299"
        // }

        // const result = await servicesCollection.insertOne(service);
        // console.log(result);

        //GET API
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })

        //get all orders
        app.get('/manage-orders', async (req, res) => {
            const cursor = ordersCollection.find({});
            const orders = await cursor.toArray();
            res.send(orders);
        })

        app.get('/my-orders/:email', async (req, res) => {
            const email = req.params.email;
            const cursor = ordersCollection.find({ email: email });
            const orders = await cursor.toArray();
            res.send(orders);
        })

        //GET SINGLE PRODUCT API
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service);
        })

        //GET SINGLE ORDER
        app.get('/placeorder/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const order = await ordersCollection.findOne(query);
            res.json(order);
        })

        //POST API
        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await servicesCollection.insertOne(service);
            res.json(result);
        });

        app.post('/placeorder', async (req, res) => {
            const order = req.body;
            const result = await ordersCollection.insertOne(order);
            res.json(result);
        })

        //update Order
        app.put('/placeorder/:id', async (req, res) => {
            const id = req.params.id;
            const updateOrder = req.body;
            const filter = { _id: ObjectId(id) };
            const update = {
                $set: {
                    status:updateOrder.status
                }
            }
            const result = await ordersCollection.updateOne(filter, update)
            res.json(result);
        })

        //update product
        app.put('/service/:id', async (req, res) => {
            const id = req.params.id;
            const updateProduct = req.body;
            const filter = { _id: ObjectId(id) };
            const update = {
                $set: {
                    value:updateOrder.value
                }
            }
            const result = await ordersCollection.updateOne(filter, update)
            res.json(result);
        })

        //Delete Order
        app.delete('/placeorder/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await ordersCollection.deleteOne(query);
            res.json(result);
        })
    } finally {
        //await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send("Running server");
})

app.listen(port, () => {
    console.log("Listening on port", port);
})