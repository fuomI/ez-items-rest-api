// Configuration to allow the use of .env file
require('dotenv').config();

// Load modules
const express = require('express');
const mongoose = require('mongoose');

// App uses express
const app = express();

// Connect to database
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true});
const db = mongoose.connection;

// Check for errors
db.on('error', (error) => console.error(error));

// If successful connection
db.once('open', () => console.log('Connected to database'));

// Set server to accept json
app.use(express.json());

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

// Create model using the schema
mongoose.model('item', itemSchema);

// Routes

// Get all items - /api/getall
app.get('/api/getall', (req, res) => {
    res.send('Hello World');
});

// Get one item with id - /api/:id
// Create new item - /api/add
// Update item (patch) - /api/update/:id
// Delete item with id - /api/delete/:id

// Start server
app.listen(3000, () => console.log('Server running'));
