const router = require("express").Router();
const { getMenu, getReceta } = require("../controllers/menuController");
const { verificarToken, soloRoles } = require("../middleware/auth");

router.use(verificarToken);

router.get("/", getMenu);
router.get("/:id/receta", soloRoles("mesero", "cocinero", "admin_punto", "admin_general", "super_admin"), getReceta);

module.exports = router;
