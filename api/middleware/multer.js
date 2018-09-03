const multer = require("multer");

const upload = multer({
  storage: multer.diskStorage({
    destination: function(req, file, cb){
      cb(null, "./uploads/");
    },
    filename: function(req, file, cb){
      cb(null, file.filename);
    } 
  }),
  limits: {fileSize: 1024 * 1024},
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, true);
    } else {
      cb(new Error("Wrong file type"), false);
    }
  }
});

module.exports = upload;