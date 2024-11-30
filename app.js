const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const freelancerRoutes = require('./routes/freelancerRoutes')
const gigRoutes = require('./routes/gigRoutes')
const appointmentRoutes = require('./routes/appointmentRoutes')
const ratingRoutes = require('./routes/ratingRoutes')
const chatRoutes = require('./routes/chatRoutes')
const messageRoutes = require('./routes/messageRoutes')
const homeownerRoutes = require('./routes/HomeownerRoutes')
const paymentRoutes = require('./routes/paymentRoutes')

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
app.use('/api/freelancer', freelancerRoutes)
app.use('/api/service', gigRoutes)
app.use('/api/appointment', appointmentRoutes)
app.use('/api/rating', ratingRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/message', messageRoutes)
app.use('/api/homeowner', homeownerRoutes)
app.use('/api/payment', paymentRoutes)

app.get("/", (req, res) => res.send("Express Deployed"));

app.listen(PORT, '0.0.0.0',(error) => {
    if (!error)
        console.log("Server is successfully running, and App is listening on port " + PORT);
    else
        console.log("Error occurred, server can't start", error);
});

module.exports = app;
