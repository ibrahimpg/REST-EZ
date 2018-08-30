const express = require("express");
const app = express();
const mongoose = require("mongoose");

const UserRoute = require("./routes/user");

app.use(express.urlencoded({ extended: false })); // research this more
app.use(express.json());
//process.env.MLAB_URL
mongoose.connect(`mongodb://iby:iby123@ds018558.mlab.com:18558/restapi`,  { useNewUrlParser: true })
  .then(() => console.log("Connected to MongoDB database..."))
  .catch(err => console.log(err));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
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