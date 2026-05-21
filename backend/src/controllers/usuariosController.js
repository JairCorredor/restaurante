const bcrypt = require("bcryptjs");
const db     = require("../config/db");

// GET /api/usuarios  — solo para admins, filtra por sede
async function getUsuarios(req, res) {
  const id_sede = req.usuario.id_sede;
  const esSuperAdmin = req.usuario.rol === "super_admin";

  try {
    const [rows] = await db.query(
      `SELECT u.id_usuario, u.nombres, u.apellidos, u.correo,
              u.activo, u.creado_en,
              r.nombre AS rol,
              s.nombre AS sede
       FROM usuarios u
       JOIN roles r ON r.id_rol = u.id_rol
       LEFT JOIN sedes s ON s.id_sede = u.id_sede
       WHERE (? OR u.id_sede = ?)
       ORDER BY u.nombres`,
      [esSuperAdmin, id_sede]
    );
    return res.json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error al obtener usuarios" });
  }
}

// POST /api/usuarios  — crear usuario
async function crearUsuario(req, res) {
  const { nombres, apellidos, correo, contrasena, id_rol, id_sede } = req.body;

  if (!nombres || !apellidos || !correo || !contrasena || !id_rol) {
    return res.status(400).json({ error: "Faltan campos requeridos" });
  }

  try {
    const hash = await bcrypt.hash(contrasena, 12);

    const [result] = await db.query(
      `INSERT INTO usuarios (nombres, apellidos, correo, contrasena, id_rol, id_sede)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nombres, apellidos, correo, hash, id_rol, id_sede || null]
    );
    return res.status(201).json({ id_usuario: result.insertId });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "El correo ya está registrado" });
    }
    console.error(err);
    return res.status(500).json({ error: "Error al crear usuario" });
  }
}

// PUT /api/usuarios/:id/activo  — activar / desactivar
async function toggleActivo(req, res) {
  const { id } = req.params;
  const { activo } = req.body;
  try {
    await db.query("UPDATE usuarios SET activo = ? WHERE id_usuario = ?", [activo, id]);
    return res.json({ mensaje: `Usuario ${activo ? "activado" : "desactivado"}` });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error al actualizar usuario" });
  }
}

module.exports = { getUsuarios, crearUsuario, toggleActivo };
