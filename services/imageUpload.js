const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3-transform");
const sharp = require("sharp");
const { validateNewDonation } = require("../validation/donations");
const { v4: uuidv4 } = require("uuid");

const limits = { fileSize: 1024 * 1024 * 20 };

aws.config.update({
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
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
  limits: limits,
  fileFilter,
  storage: multerS3({
    acl: "public-read",
    s3,
    bucket: process.env.AWS_S3_BUCKET_NAME,
    shouldTransform: function (req, file, cb) {
      cb(null, false);
    },
    // transforms: [
    //   {
    //     id: "original",
    //     key: function (req, file, cb) {
    //       cb(null, uuidv4());
    //     },
    //     transform: function (req, file, cb) {
    //       //Perform desired transformations
    //       cb(null, sharp().jpeg());
    //     },
    //   },
    // ],
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: "TESTING_METADATA" });
    },
    key: function (req, file, cb) {
      cb(null, uuidv4());
    },
  }),
});

module.exports = upload;
