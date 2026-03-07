const express = require("express");
const router = express.Router();
const { subscribeEmail, getAllSubscribers } = require("../controllers/subscriberController");

router.post("/subscribe", subscribeEmail);
router.get("/subscribers", getAllSubscribers);  

module.exports = router;