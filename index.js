const express = require("express");
const app = express();
const dbConnection = require("./config/database");

require("dotenv").config();

dbConnection();
app.use(express.json());

app.use("/api/auth", require("./routers/auth.router"));

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`App running running on port ${PORT}`);
});
