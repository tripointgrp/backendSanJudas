const express = require("express");
const router = express.Router();
const { EscuelaGrados } = require("../models/escuelas_grados.model.js");
const { Grado } = require("../models/grado.model.js");
const mongoose = require("mongoose");

router.post("/crear", async (req, res) => {
  try {
    const { id_escuela, id_grado } = req.body;

    // Validar si ya existe ese grado en esa escuela
    const yaExiste = await EscuelaGrados.findOne({
      id_escuela,
      id_grado,
    });

    if (yaExiste) {
      return res.status(409).json({
        error: "Este grado ya está asignado a la escuela.",
      });
    }

    // Si no existe, lo creamos
    const escuelagradoNuevo = new EscuelaGrados({
      id_escuela,
      id_grado,
    });

    const escuelagradoRes = await escuelagradoNuevo.save();

    res.status(201).json(escuelagradoRes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


router.put("/actualizar/:id", async (req, res) => {
  try {
    const { id_pedido, id_producto, cantidad, total } = req.body;

    const escuelagradoActualizado = await EscuelaGrados.findByIdAndUpdate(
      req.params.id,
      {
        id_pedido: id_pedido,
        id_producto: id_producto,
        cantidad: cantidad,
        total: total,
      },
      { new: true }
    );
    res.status(200).json(escuelagradoActualizado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/obtener", async (req, res) => {
  try {
    const obtenerEscuelagrado = await EscuelaGrados.find(req.params.id);
    res.status(201).json(obtenerEscuelagrado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/grados-por-escuela/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const gradosDeEscuela = await EscuelaGrados.find({ id_escuela: id })
      .populate("id_grado", "nombre"); // Esto trae el nombre y el _id por defecto

    // Devolver el id y nombre de cada grado
    const grados = gradosDeEscuela.map((eg) => ({
      id: eg._id,
      nombre: eg.id_grado.nombre,
    }));

    res.status(200).json({ grados });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


router.delete("/eliminar/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "ID no válido" });
    }

    const eliminado = await EscuelaGrados.findByIdAndDelete(id);

    if (!eliminado) {
      return res.status(404).json({ error: "No se encontró el registro" });
    }

    res.status(200).json({ message: "Escuela por grado eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
