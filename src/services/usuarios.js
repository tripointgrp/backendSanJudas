const express = require("express");
const router = express.Router();
const { Usuario } = require("../models/usuarios.model.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const SECRET_KEY = process.env.JWT_SECRET || "mi_secreto_super_seguro";


router.post("/crear", async (req, res) => {
  try {
    const { correo, clave, nombre, contacto, tipo_usuario } = req.body;

    // Generar un salt y encriptar la clave
    const saltRounds = 10;
    const claveHasheada = await bcrypt.hash(clave, saltRounds);

    // Crear el usuario con la clave encriptada
    const usuarioNuevo = new Usuario({
      correo: correo,
      clave: claveHasheada,
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

router.post("/login", async (req, res) => {
  try {
    const { correo, clave } = req.body;

    // Buscar al usuario en la base de datos
    const usuario = await Usuario.findOne({ correo });

    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Comparar la clave ingresada con la almacenada en la BD
    const claveValida = await bcrypt.compare(clave, usuario.clave);

    if (!claveValida) {
      return res.status(401).json({ error: "Clave incorrecta" });
    }

    // Generar token JWT
    const token = jwt.sign(
      { id: usuario._id, correo: usuario.correo, tipo_usuario: usuario.tipo_usuario },
      SECRET_KEY,
      { expiresIn: "2h" } // El token expira en 2 horas
    );

    // Enviar respuesta con token
    res.status(200).json({
      message: "Login exitoso",
      token,
      usuario: {
        id: usuario._id,
        correo: usuario.correo,
        nombre: usuario.nombre,
        tipo_usuario: usuario.tipo_usuario,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
