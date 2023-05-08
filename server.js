const https = require("https");
const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

const options = {
  key: fs.readFileSync("./src/certificado/key.pem"),
  cert: fs.readFileSync("./src/certificado/cert.pem"),
};

app.use(express.static(path.join(__dirname, "build")));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

https.createServer(options, app).listen(3000, () => {
  console.log("HTTPS server started on port 3000");
});
