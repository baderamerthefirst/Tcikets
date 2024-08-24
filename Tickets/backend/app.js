const express = require('express');
const fileUpload = require('express-fileupload');
const cors =require('cors');

const { oracledb, dbConfig } = require('./db/dbConfig'); // Import the configuration
oracledb.autoCommit = true; // Set any other configurations if needed

const app = express();
app.use(fileUpload());

// app.set("views", "views");
// app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(
  cors({
    origin: true,
    // origin: ["http://172.17.17.54:3000","http://localhost:3000","http://192.168.1.241:3000"],
    methods: ["GET", "POST","DELETE"],
    credentials: true,
    exposedHeaders: ['Content-Disposition']

  })
);

app.use("/",require("./routes/login"));
// app.use("/",require("./routes/register"));

// app.use("/home", require("./routes/home"));

app.use("/requests", require("./routes/requests")); 
app.use("/fileRequests", require("./routes/fileRequests")); 
app.use("/details", require("./routes/details"));  

app.use("/contacts", require("./routes/contacts"));  
app.use("/download", require("./routes/download")); 
app.use("/tests", require("./routes/tests.js")); 









// // Logout endpoint
// app.get("/logout", (req, res) => {
//   // req.session.destroy();
//   console.log("logout")
//   res.redirect("/");
// });

// This catch-all route should be placed at the end
app.use((req, res) => {
  res.status(404).send('Not Found');
});

app.listen(5000, () => {
  console.log("running on port 5000");
});

