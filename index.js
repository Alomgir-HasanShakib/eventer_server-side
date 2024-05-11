const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
require("dotenv").config();
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

app.use(express.json());

// eTuDsFiXOai7SIlj
// eventer

// mongoDB's code here


app.get("/", (req, res) => {
  res.send("Eventer server is Here");
});
app.listen(port, (req, res) => {
  console.log(`Server is runnig on Port ${port}`);
});
