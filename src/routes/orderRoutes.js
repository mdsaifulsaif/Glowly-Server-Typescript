const express = require('express');
const router = express.Router();
const orderControllers = require("../controllers/orderController");
const { protect } = require('../middlewares/authMiddleware');
const { isAdmin } = require('../middlewares/adminMiddleware');
const Product = require('../models/product.model');

router.post('/order-create', protect,  orderControllers.createOrder);
router.get('/all-orders', protect,   orderControllers.getAllOrders);
router.get("/getUserOrders", protect, orderControllers.getUserOrders)
router.get("/getOrderById/:id", protect, orderControllers.getOrderById);
module.exports = router;