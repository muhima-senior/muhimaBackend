const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('../routes/userRoutes');
const cors = require('cors');
const app = express();
const PORT = 3000;
const MONGO_URI = 'mongodb+srv://muhima:Muhima2030@cluster0.dgk1r.mongodb.net/muhima'; 
app.use(cors());
app.use(express.json());
// Connect to MongoDB
mongoose.connect(MONGO_URI, {
})
.then(() => {
    console.log("Successfully connected to MongoDB");
})
.catch((error) => {
    console.error("Error connecting to MongoDB: ", error);
});

// Start server
app.use('/api/users', userRoutes);

app.listen(PORT, '0.0.0.0',(error) => {
    if (!error)
        console.log("Server is successfully running, and App is listening on port " + PORT);
    else
        console.log("Error occurred, server can't start", error);
});

module.exports = app;
