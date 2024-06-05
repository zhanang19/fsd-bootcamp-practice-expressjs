const express = require("express");

const router = express.Router();

const { validateCreateOrder } = require("../middlewares/validator");
const { verifyToken } = require("../middlewares/auth");
const { index, create } = require("../controllers/order.controller");

router.get("/", verifyToken, index);
router.post("/", verifyToken, validateCreateOrder, create);

module.exports = router;
