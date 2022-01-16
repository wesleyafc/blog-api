const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = express();
dotenv.config()

mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

const db = mongoose.connection

db.once('open', () => {
    console.log('MongoDB connected');
})
db.on('error', (err) => {
    console.log(err);
});


app.listen(process.env.PORT, () => {
    console.log(`backend started on ${process.env.PORT}`);
})