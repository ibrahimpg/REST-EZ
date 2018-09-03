const multer = require("multer");

module.exports = multer({
  storage: multer.diskStorage({
    destination: function(req, file, cb) { cb(null, './temp/'); },
    filename: function(req, file, cb) { cb(null, file.originalname); }
  }),
  limits: { fileSize: 1024 * 1024 * 1 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(new Error("Wrong file type."), false);
    }
  }
});