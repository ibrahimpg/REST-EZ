const express = require("express");
const mongoose = require("mongoose");

const app = express();

const UserRoute = require("./api/routes/user");

app.use(express.json());
//urlencoded might be necessary for multer

//process.env.MLAB_URL
mongoose.connect(`mongodb://iby:iby123@ds018558.mlab.com:18558/restapi`, { useNewUrlParser: true })
  .then(() => console.log("Connected to MongoDB database..."))
  .catch(err => console.log(err));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); //since this is actually meant to be used by specific domains, "*" should be the actual domain you're using with this
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
    return res.status(200).json({});
  }
  next();
});

app.use("/user", UserRoute);

app.use((req, res, next) => {
  const error = new Error("Route not available.");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({ error: { message: error.message } });
});

const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`Server started on port ${port}...`));