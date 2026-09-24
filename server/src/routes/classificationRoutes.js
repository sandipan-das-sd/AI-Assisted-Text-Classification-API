const router = require("express").Router();
const { classify } = require("../controllers/classificationController");
router.post("/classify", classify);
module.exports = router;
