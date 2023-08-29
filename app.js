const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
require('./src/db/conn.js');

const port = 8000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const userRouter = require("./src/router/user.router");
app.use("/user", userRouter); 

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

module.exports = app;
