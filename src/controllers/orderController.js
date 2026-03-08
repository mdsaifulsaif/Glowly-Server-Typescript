const Order = require("../models/order.model");

// Create New Order
const createOrder = async (req, res) => {
  try {
    const orderData = req.body;

    const newOrder = new Order({
      ...orderData,
      user: req.user._id,
    });

    const savedOrder = await newOrder.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully!",
      order: savedOrder,
    });
  } catch (error) {
    console.error("Order Creation Error:", error);
    res.status(500).json({
      success: false,
      message: "Order placement failed",
      error: error.message,
    });
  }
};
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

const getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    const totalOrders = await Order.countDocuments({
      user: userId,
    });

    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      totalOrders,
      totalPages: Math.ceil(totalOrders / limit),
      currentPage: page,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const getOrderByUserId = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id; 

   
    const order = await Order.findOne({ _id: id, user: userId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found or unauthorized access",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching order details",
      error: error.message,
    });
  }
};
// Update Order Status
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

 
    const validStatuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled", "Returned"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status update" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      data: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};




const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId).populate("user", "firstName lastName email");

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// const updateOrderStatus = async (req, res) => {
//   try {
//     const { orderId } = req.params;
//     const { status } = req.body;

//     const updatedOrder = await Order.findByIdAndUpdate(
//       orderId,
//       { status },
//       { new: true, runValidators: true }
//     );

//     res.status(200).json({ success: true, message: "Status updated", data: updatedOrder });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };


module.exports = {
  createOrder,
  getAllOrders,
  getUserOrders,
  getOrderByUserId,
  updateOrderStatus,
  getOrderById
};
