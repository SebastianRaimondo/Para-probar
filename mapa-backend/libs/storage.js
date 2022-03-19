const multer = require("multer");
const path = require("path");

const diskStorage = multer.diskStorage({
  destination: path.join(__dirname, "../images"),
  filename: function (req, file, cb) {
    const uniqueSuffix =
      Date.now() + "-" + Math.round(Math.random() * 1e9) + ".jpg";
    cb(null, file.fieldname + uniqueSuffix);
  },
});

const upload = multer({ storage: diskStorage }).array("images");

module.exports = upload;

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'storage/imgs')
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//     cb(null, file.fieldname + '-' + uniqueSuffix)
//   }
// });
