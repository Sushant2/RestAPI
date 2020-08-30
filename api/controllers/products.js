const Product = require("../models/product");
const mongoose = require("mongoose");

exports.products_get_all = (req, res, next) => {
  // res.status(200).json({
  //   message: "Handling GET requests to /products",
  // });
  Product.find()
    .select("name price _id productImage")
    .exec()
    .then((docs) => {
      // console.log(docs);
      const response = {
        count: docs.length,
        products: docs.map((doc) => {
          return {
            name: doc.name,
            price: doc.price,
            _id: doc._id,
            productImage: doc.productImage,
            request: {
              type: "GET",
              url: "http://localhost:3000/products/" + doc._id,
            },
          };
        }),
      };
      return res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.products_create_product = (req, res, next) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path,
  });

  // we're using promise after save()
  product
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Created product successfully",
        createProduct: {
          name: result.name,
          price: result.price,
          _id: result._id,
          productImage: result.productImage,
          request: {
            type: "GET",
            url: "http://localhost:3000/products/" + result._id,
          },
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.products_get_id = (req, res, next) => {
  const id = req.params.productId;
  // if (id === "special") {
  //   res.status(200).json({
  //     message: "You discovered the special ID",
  //     id: id,
  //   });
  // } else {
  //   res.status(200).json({
  //     message: "You passed an ID",
  //   });
  // }

  Product.findById(id)
    .select("name price _id productImage")
    .exec()
    .then((doc) => {
      console.log("From databse", doc);
      if (doc) {
        return res.status(200).json({
          product: doc,
          require: {
            type: "GET",
            description: "Get all products",
            url: "http://localhost:3000/products",
          },
        });
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided Id" });
      }
      res.status(200).json(doc);
    })
    .catch((err) => {
      console.log(err);
      const status = err.status || 500;
      res.status(status).json({
        //500 = something failed while fatching the data
        error: err,
      });
    });
};

exports.products_update = (req, res, next) => {
  // res.status(200).json({
  //   message: "Updated product!",
  // });
  const id = req.params.productId;
  // this below code is for => we can send different types of patch requests such as only name, only price or both to update
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  //
  Product.update({ _id: id }, { $set: updateOps })
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: "Product updated",
        request: {
          type: "GET",
          url: "http://localhost:3000/products/" + id,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.products_delete = (req, res, next) => {
  // res.status(200).json({
  //   message: "Deleted product!",
  // });
  const id = req.params.productId;
  Product.remove({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json({
        result,
        message: "Successfully deleted the provided Id product!!!",
        request: {
          type: "POST",
          url: "http://localhost:3000/" + id,
          body: { name: "String", price: "Number" },
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};
