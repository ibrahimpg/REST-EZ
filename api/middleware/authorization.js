const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "secretKey");
    req.tokenData = decoded;
    next();
  } catch(err) {
    return res.json({ message: err }); //remember that if your documentation promises a "message" response, it has
    //to be included even if middleware failed, if "catch" comes into play, etc. run thru various failures to make sure
    //that a "message" object always comes back
  }
};