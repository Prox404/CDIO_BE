const express = require('express')
const morgan = require('morgan')
const dotenv = require('dotenv');
var cors = require('cors')
const app = express()
const route = require('./routes/')

const db = require('./config/db');

dotenv.config();
const corsOptions = {
  origin: "*",
  credentials: true, // Access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.raw());
app.use(express.text());
app.use(morgan('combined'));

db.connect();

// Routes init
route(app);

app.listen(process.env.PORT|| 5500, () => {
  console.log(`Example app listening on port ${process.env.PORT|| 5500}`)
})

app.listen(8000, function () {
  console.log('CORS-enabled web server listening on port 8000')
})