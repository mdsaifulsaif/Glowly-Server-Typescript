// const express = require('express');
// const router = express.Router();
// const reviewController = require('../controllers/reviewController');
// const { protect } = require('../middlewares/authMiddleware'); 

// router.post('/add', protect, reviewController.createReview);

// router.get('/review/:productId', reviewController.getProductReviews);

// module.exports = router;


const express = require("express");
const router = express.Router();
const { createReview, getProductReviews } = require("../controllers/reviewController");
const { protect } = require("../middlewares/authMiddleware");

// URL হবে: /api/review/add
router.post("/review/add", protect, createReview);
router.get("/review/:productId", getProductReviews);

module.exports = router;