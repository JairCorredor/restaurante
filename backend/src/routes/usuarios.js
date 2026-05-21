const router = require("express").Router();
const { getUsuarios, crearUsuario, toggleActivo } = require("../controllers/usuariosController");
const { verificarToken, soloRoles } = require("../middleware/auth");

router.use(verificarToken);
router.use(soloRoles("admin_general","admin_punto","super_admin"));

router.get("/",              getUsuarios);
router.post("/",             crearUsuario);
router.put("/:id/activo",    toggleActivo);

module.exports = router;
