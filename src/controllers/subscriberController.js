const Subscriber = require("../models/subscriber.model");

const subscribeEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

   
    const existingSubscriber = await Subscriber.findOne({ email });

    if (existingSubscriber) {
      return res.status(400).json({ 
        success: false, 
        message: "This email is already subscribed!" 
      });
    }

    // ২. নতুন সাবস্ক্রাইবার তৈরি করা
    const newSubscriber = await Subscriber.create({ email });

    res.status(201).json({
      success: true,
      message: "Successfully subscribed to newsletter!",
      data: newSubscriber
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const getAllSubscribers = async (req, res) => {
  try {
    const subscribers = await Subscriber.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: subscribers.length,
      data: subscribers
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { subscribeEmail, getAllSubscribers };