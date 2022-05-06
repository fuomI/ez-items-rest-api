// Require dotenv
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


// Start server
app.listen(3000, () => console.log('Server running'));
