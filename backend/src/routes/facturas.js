const router = require("express").Router();
const { getFacturas, getMisFacturas, crearFactura } = require("../controllers/facturasController");
const { verificarToken, soloRoles } = require("../middleware/auth");

router.use(verificarToken);

router.get("/mis-facturas", soloRoles("mesero"), getMisFacturas);
router.get("/",    soloRoles("admin_punto","admin_general","super_admin"), getFacturas);
router.post("/",   soloRoles("admin_punto","admin_general","super_admin"), crearFactura);

module.exports = router;
