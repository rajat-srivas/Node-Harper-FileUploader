const express = require('express');

require('dotenv').config();
const userRouter = require('./routes/userRoute');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    next();
})
app.use('/api/v1/users/', userRouter);


app.listen(3000, () => {
    console.log(`⚡️[server]: Listing on port 3000`);
});


