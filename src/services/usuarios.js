const express = require("express");
const router = express.Router();
const { Usuario } = require("../models/usuarios.model.js");

router.post("/crear", async (req, res) => {
  try {
    const { correo, clave, nombre, contacto, tipo_usuario } = req.body;

    const usuarioNuevo = new Usuario({
      correo: correo,
      clave: clave,
      nombre: nombre,
      contacto: contacto,
      tipo_usuario: tipo_usuario,
    });

    const usuarioRes = await usuarioNuevo.save();

    res.status(201).json(usuarioRes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/actualizar/:id", async (req, res) => {
  try {
    const { correo, clave, nombre, contacto, tipo_usuario } = req.body;

    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      req.params.id,
      {
        correo: correo,
        clave: clave,
        nombre: nombre,
        contacto: contacto,
        tipo_usuario: tipo_usuario,
      },
      { new: true }
    );
    res.status(200).json(usuarioActualizado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/obtener", async (req, res) => {
  try {
    const obtenerUsuario = await Usuario.find(req.params.id);
    res.status(201).json(obtenerUsuario);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/eliminar/:id", async (req, res) => {
  try {
    await Usuario.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
