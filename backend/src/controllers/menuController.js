const db = require("../config/db");

// GET /api/menu  — platos activos del menú activo de la sede
async function getMenu(req, res) {
  const id_sede = req.usuario.id_sede;
  try {
    let sql = `SELECT pl.id_plato, pl.nombre, pl.descripcion, pl.precio, pl.disponible,
                     m.nombre AS menu_nombre, m.id_menu
              FROM platos pl
              JOIN menus m ON m.id_menu = pl.id_menu
              WHERE m.activo = 1 AND pl.disponible = 1`;
    const params = [];

    if (id_sede) {
      sql += ` AND m.id_sede = ?`;
      params.push(id_sede);
    }

    sql += ` ORDER BY m.nombre, pl.nombre`;
    const [rows] = await db.query(sql, params);
    return res.json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error al obtener menú" });
  }
}

// GET /api/menu/:id/receta  — receta de un plato (solo cocineros)
async function getReceta(req, res) {
  const { id } = req.params;
  try {
    const [[receta]] = await db.query(
      `SELECT r.id_receta, r.modo_preparacion, r.tiempo_minutos,
              p.nombre AS plato_nombre
       FROM recetas r
       JOIN platos p ON p.id_plato = r.id_plato
       WHERE r.id_plato = ?`,
      [id]
    );
    if (!receta) return res.status(404).json({ error: "Receta no encontrada" });

    const [ingredientes] = await db.query(
      `SELECT ri.id_producto, ri.cantidad_requerida, pi2.nombre AS ingrediente,
              pi2.unidad_medida, pi2.cantidad_actual AS stock_actual
       FROM receta_ingredientes ri
       JOIN productos_inventario pi2 ON pi2.id_producto = ri.id_producto
       WHERE ri.id_receta = ?`,
      [receta.id_receta]
    );

    return res.json({ ...receta, ingredientes });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error al obtener receta" });
  }
}

module.exports = { getMenu, getReceta };
