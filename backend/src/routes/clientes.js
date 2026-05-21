const router = require("express").Router();
const { getPerfilCliente, actualizarPerfilCliente } = require("../controllers/clientesController");
const { verificarToken, soloRoles } = require("../middleware/auth");

router.use(verificarToken);
router.use(soloRoles("cliente", "super_admin"));

router.get("/perfil",  getPerfilCliente);
router.put("/perfil",  actualizarPerfilCliente);

module.exports = router;
