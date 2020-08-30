const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer"); // It is like a body parser, is able to parse form - data bodies Multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files. It is written on top of busboy for maximum efficiency.
const checkAuth = require("../middleware/checek-auth");
const productsController = require('../controllers/products');

//storage strategy
const storagestrategy = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      new Date().toISOString().replace(/:/g, "-") + "_" + file.originalname
    );
  },
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storagestrategy,
  limits: {
    fileSize: 1024 * 1024 * 5, // 5 mb
  },
  fileFilter: fileFilter,
});

// const upload = multer({ dest: "uploads/" }); //destination is 'uploads' folder, this folder isn't publicly accessible by deafult, so we have to turn it to a static folder

const Product = require("../models/product");
// Here, '/' is '/products'

router.get("/", productsController.products_get_all);

router.post("/", checkAuth, upload.single("productImage"), productsController.products_create_product);

router.get("/:productId", productsController.products_get_id);

router.patch("/:productId", checkAuth, productsController.products_update);

router.delete("/:productId", checkAuth, productsController.products_delete);

module.exports = router;
