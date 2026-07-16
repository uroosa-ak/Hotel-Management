const express = require('express');
const dotenv=require('dotenv');
const ConnectDB = require('./config/db');
dotenv.config();
const app = express()
ConnectDB();




app.get('/', (req, res) => {
  res.send('Hello World!')
})
const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})