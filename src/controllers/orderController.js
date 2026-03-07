const Order = require("../models/order.model");

// Create New Order
const createOrder = async (req, res) => {
  try {
    const orderData = req.body;

    // Database-e save kora
    const newOrder = new Order(orderData);
    const savedOrder = await newOrder.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully!",
      order: savedOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Order placement failed",
      error: error.message,
    });
  }
};

// Get All Orders (Admin use er jonno)
// const getAllOrders = async (req, res) => {
//   try {
//     const orders = await Order.find().sort({ createdAt: -1 });
//     res.status(200).json(orders);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };



// Get All Orders (With Pagination and Search)
const getAllOrders = async (req, res) => {
  try {
    // 1. Pagination Parameters
    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) || 10; 
    const skip = (page - 1) * limit;

    // 2. Search Logic (FirstName, Email, or Phone)
    const searchQuery = req.query.search || "";
    const query = searchQuery
      ? {
          $or: [
            { firstName: { $regex: searchQuery, $options: "i" } },
            { email: { $regex: searchQuery, $options: "i" } },
            { phone: { $regex: searchQuery, $options: "i" } },
          ],
        }
      : {};

    // 3. Database Query
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // 4. Total Count (Frontend-e pagination buttons bananor jonno)
    const totalOrders = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      orders,
      pagination: {
        totalOrders,
        currentPage: page,
        totalPages: Math.ceil(totalOrders / limit),
        hasNextPage: page * limit < totalOrders,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
};
