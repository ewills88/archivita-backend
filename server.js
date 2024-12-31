const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose'); // Import mongoose
const welcomeRoute = require('./routes/welcome');

const app = express();
const PORT = 3000;

// Middleware to handle JSON
app.use(bodyParser.json());

// MongoDB connection
const mongoURI = 'mongodb+srv://ewillsew:EmmyRoo18@cluster0.slyg4.mongodb.net/archivita?retryWrites=true&w=majority';
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

app.use('/api', welcomeRoute);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));