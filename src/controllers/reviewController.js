
const Review = require("../models/review.model");
const Product = require("../models/product.model");

const createReview = async (req, res) => {
  try {
    const { rating, comment, productId } = req.body;

    // Validation
    if (!rating || !comment || !productId) {
      return res.status(400).json({
        success: false,
        message: "Please provide rating, comment and productId",
      });
    }

    const userId = req.user._id;

    const alreadyReviewed = await Review.findOne({
      product: productId,
      user: userId,
    });
    if (alreadyReviewed) {
      return res
        .status(400)
        .json({ success: false, message: "Product already reviewed" });
    }

    const review = await Review.create({
      product: productId,
      user: userId,
      rating: Number(rating),
      comment,
    });

    await updateProductRating(productId);

    res.status(201).json({ success: true, data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate("user", "name")
      .sort("-createdAt");
    res
      .status(200)
      .json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

async function updateProductRating(productId) {
  const reviews = await Review.find({ product: productId });
  const avgRating =
    reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
  await Product.findByIdAndUpdate(productId, {
    averageRating: avgRating.toFixed(1),
    numOfReviews: reviews.length,
  });
}

module.exports = { createReview, getProductReviews };
