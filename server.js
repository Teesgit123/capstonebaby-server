const express = require("express");
const fs = require("fs");
const signupRoute = require('./routes/signupRoute.js');
const cors = require("cors");
require("dotenv").config();

const { CORS_ORIGIN } = process.env;
const port = process.env.PORT || 3003;


const app = express();

app.use(express.json());
app.use(cors({ origin: CORS_ORIGIN }));

// app.use(express.static("public"));

app.use("/", signupRoute);




app.listen(port, () => {
  console.log(`We are listening on ${port}`);
});
