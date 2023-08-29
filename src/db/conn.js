const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost:27017/inter-backend", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("database connection established");
  })
  .catch((err) => {
    console.log("There is an issue connecting to database: " + err.message);
  });
