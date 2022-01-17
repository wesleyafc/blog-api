const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const multer = require('multer');
const authRoute = require('./routes/auth')
const userRoute = require('./routes/user')
const postRoute = require('./routes/post')
const categoryRoute = require('./routes/categories')
const app = express();

dotenv.config()
app.use(express.json())

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

const storage = multer.diskStorage({
    destination: (request, file, cb) => {
        cb(null, "images")
    },
    filename: (request, file, cb) => {
        cb(null, request.body.name)
    }
})

const upload = multer({ storage: storage })
app.post('/api/upload', upload.single("file"), (request, response) => {
    response.status(200).json("file has been uploaded")
})


app.use('/api/auth', authRoute)
app.use('/api/user', userRoute)
app.use('/api/post', postRoute)
app.use('/api/categories', categoryRoute)

app.listen(process.env.PORT, () => {
    console.log(`backend started on ${process.env.PORT}`);
})