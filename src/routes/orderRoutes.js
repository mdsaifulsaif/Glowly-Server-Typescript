const express = require('express');
const router = express.Router();
const orderControllers = require("../controllers/orderController");
const { protect } = require('../middlewares/authMiddleware');
const { isAdmin } = require('../middlewares/adminMiddleware');

router.post('/order-create',  orderControllers.createOrder);
router.get('/all-orders',   orderControllers.getAllOrders);

module.exports = router;