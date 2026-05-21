const db = require("../config/db");

async function getSedes(req, res) {
  try {
    const [rows] = await db.query(
      `SELECT id_sede, nombre, ciudad, pais, direccion, telefono
       FROM sedes
       ORDER BY nombre`
    );
    return res.json(rows);
  } catch (err) {
    console.error("Error al obtener sedes:", err);
    return res.status(500).json({ error: "Error al obtener sedes" });
  }
}

module.exports = { getSedes };
