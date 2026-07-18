const cors = require("cors");
require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const borrowRoutes = require('./routes/borrowRoutes');
// const redisClient = require('./config/redis')
const rateLimit = require('express-rate-limit');
const PORT = process.env.PORT || 5000;

const app = express();
const limiter = rateLimit({
    windowMs:15*60*1000,
    max:100,
    message:{message: "Too many requests, please try again later"}
})


connectDB();
app.use(limiter);
app.use(express.json());
app.use(cors());
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/borrow', borrowRoutes);


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});