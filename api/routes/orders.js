const express = require("express");
const router = express.Router();
// const mongoose = require("mongoose");
// const Order = require("../models/order");
// const Product = require("../models/product");
const checkAuth = require("../middleware/checek-auth");
const OrdersController = require('../controllers/orders');

router.get("/", checkAuth, OrdersController.orders_get_all);

// 201 = 'everything is successful, resource created'
router.post("/", checkAuth, OrdersController.orders_create_order);

router.get("/:orderId", checkAuth, OrdersController.orders_get_id);

router.delete("/:orderId", checkAuth, OrdersController.orders_delete);

module.exports = router;
