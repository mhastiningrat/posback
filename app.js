const express = require('express');
const dotenv = require("dotenv");
const cors = require("cors");
const dns = require('node:dns');
const os = require('node:os');
const bodyParser = require("body-parser")
let PORT = process.env.APP_PORT || 9999
dotenv.config();

const app = express();


const {routes} = require("./src/router");
const { healthCheck } = require('./config/db_config');

app.use(express.json())

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors(
  {
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  }
))
async function checkConnection(){
    healthCheck()
} 

checkConnection();

for(let router of routes){
    app.use("/apipos/v1",router)
}

const options = { family: 4 };

dns.lookup(os.hostname(), options, (err, addr) => {
  if (err) {
    console.error(err);
  } else {
    console.log(`=== HOST ${addr}  PORT ${PORT}`)
    console.log("----------------------------------");
  }
});

app.listen(PORT,()=>{
    console.log("======= SERVER API RUNNING =======");
})