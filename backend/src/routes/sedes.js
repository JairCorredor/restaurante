const router = require("express").Router();
const { getSedes } = require("../controllers/sedesController");

router.get("/", getSedes);

module.exports = router;
