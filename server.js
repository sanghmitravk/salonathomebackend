const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config({ path: "./config.env" });
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use(require("./routes/record"));
// get driver connection
const dbo = require("./db/conn");

console.log("entering in listen");
app.listen(port, () => {
  console.log("entered in listen");
  // perform a database connection when server starts
  dbo.connectToServer(function (err) {
    console.log("connecting to server");

    if (err) console.error(err);
  });
  console.log(`Server is running on port: ${port}`);
});
