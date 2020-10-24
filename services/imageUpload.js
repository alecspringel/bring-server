const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const keys = require("../config/keys");
const { validateNewDonation } = require("../validation/donations");

aws.config.update({
  secretAccessKey: keys.AWS_SECRET_ACCESS_KEY,
  accessKeyId: keys.AWS_ACCESS_KEY_ID,
  region: "us-west-2",
});

const s3 = new aws.S3();

const fileFilter = (req, file, cb) => {
  const { isValid, errors } = validateNewDonation(req.body);
  if (!isValid) {
    req.body.errors = errors;
    cb(new Error("Invalid first, last, or email", false));
  } else if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    req.body.errors = {
      file: "Invalid file type. Only JPEG and PNG are allowed",
    };
    cb(new Error("Invalid file type, only JPEG and PNG is allowed"), false);
  }
};

function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const upload = multer({
  fileFilter,
  storage: multerS3({
    acl: "public-read",
    s3,
    bucket: "bring-donations",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: "TESTING_METADATA" });
    },
    key: function (req, file, cb) {
      cb(null, makeid(10));
    },
  }),
});

module.exports = upload;
