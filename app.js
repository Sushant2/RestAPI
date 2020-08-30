const express = require("express");
const app = express();
const morgan = require("morgan"); //HTTP request logger package for node.js
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();
const pswrd = process.env.MONGO_PW;

const productRoutes = require("./api/routes/products");
const orderRoutes = require("./api/routes/orders");
const userRoutes = require('./api/routes/user');

mongoose
  .connect(
    "mongodb+srv://sushant2020:" +
      pswrd +
      "@node-rest-shop.pby4e.mongodb.net/node-rest-shop?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
  )
  .then(() => {
    console.log("Connected to database !!");
  })
  .catch((err) => {
    console.log("Connection failed !!" + err.message);
  });

mongoose.Promise = global.Promise;

app.use(morgan("dev")); //morgan's middleware
app.use("/uploads", express.static("uploads"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Just for checking
// app.use((req, res, next)=>{
//     res.status(200).json({
//         message: 'It Works!'
//     });
// });

// CORS = cross origin resource sharing
//Midlleware for Handling CORS
//CORS errors are a security mechanism enforced by browsers
// POSTMAN is a testing tool which doesn't care about CORS, but when we're usign it in SPA or webpages then CORS error may occur!
app.use((req, res, next) => {
  //these responses will not send response, they'll adjust the other 'res' with these headers
  res.header("Access-Control-Allow-Origin", "*"); // '*' is for everyclient url, we can also restrict to some url eg. http://cool-boy.com
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  // Browser will alwsys send an Options request first when u send a post/put/patch... request
  if (req.method === "OPTIONS") {
    // We're telling the browser what he may send
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

//Routes which should handle requests
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/user", userRoutes);

// Error Handling
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404; //here we've assign(=) 404, b'cos it's not a method as res.status();
  next(error); //forward the above error request
});

//Another Middleware for Other Error Handling from the project
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    message: error.message,
  });
});

module.exports = app;
