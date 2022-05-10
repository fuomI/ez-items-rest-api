// Configuration to allow the use of .env file
require('dotenv').config();

// Load modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// App uses express
const app = express();

// Handle cors
app.use(cors());

// Connect to database
mongoose.connect(process.env.DATABASE_URI, { useNewUrlParser: true});
const db = mongoose.connection;

// Check for errors
db.on('error', (error) => console.error(error));

// If successful connection
db.once('open', () => console.log('Connected to database'));

// Set server to accept json
app.use(express.json());

// ** Schema & model **

// Create a Schema for items
const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: false
    },
    picture: {
        type: String,
        required: false
    }
});

// Create  Item model using the schema
const Item = mongoose.model('Item', itemSchema);

// ** Routes **

// Get all items - /api/getall
app.get('/api/getall', async (req, res) => {
    try {
        const items = await Item.find();
        res.send(items);
    } catch (err){
        // Error on server side
        res.status(500).json( { message: err.message});
    }
});

// Create new item - /api/add
app.post('/api/add', async (req,res) => {
    // Create new Item object
    const item = new Item ({
        name: req.body.name,
        price: req.body.price,
        picture: req.body.picture
    });

    try {
        // Create variable new item, which is the item saved to the database
        const newItem = await item.save();
        // Successfully created object
        res.status(201).json(newItem);
    } catch (err){
        // User input faulty error
        res.status(400).json({ message: err.message});
    }
});

// Get one item with id - /api/:id
app.get('/api/:id', getItem, (req, res) => {
    // midleware getItem gives the res.item
    res.send(res.item);
});

// Update item (patch) - /api/update/:id
app.patch ('/api/update/:id', getItem, async (req, res) => {
    // If users inputs not null, update fields for wich inputs were given
    // Middleware gives the res.item to this route as well
    if (req.body.name != null) {
        res.item.name = req.body.name;
    }
    if (req.body.price != null) {
        res.item.price = req.body.price;
    }
    if (req.body.picture != null) {
        res.item.picture = req.body.picture;
    }
    try {
        const updatedItem = await res.item.save();
        res.json(updatedItem);
    } catch (err) {
        // User faulty inputs error
        res.status(400).json({ message: err.message });
    }
});

// Delete item with id - /api/delete/:id
app.delete('/api/delete/:id', getItem, async (req, res) => {
    try {
        // res.item because middleware has done the searching for this route
        await res.item.remove();
        // Inform user that the deletion was completed
        res.json({ message: 'Deleted item: ' + res.item.name });
    } catch (err) {
        // Server error
        res.status(500).json({ message: err.message });
    }
});

// ** Middleware to get item **
async function getItem (req, res, next) {
    let item;
    try {
        item = await Item.findById(req.params.id);
        // If item is null the item can't be found
        if (item == null) {
            // Status 404 - cannot find
            return res.status(404).json({ message: 'Cannot find item'});
        }
    } catch (err) {
        // Error on server side
        return res.status(500).json({ message: err.message });
    }

    // Routes can use the res.item, which is the item that middleware found
    res.item = item;
    // Middleware ran succesfully so continue to request
    next();
};

// ** Start server **
app.listen(3001, () => console.log('Server running'));
