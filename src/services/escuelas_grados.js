const express = require("express");
const router = express.Router();
const { EscuelaGrados } = require("../models/escuelas_grados.model.js");

router.post("/crear", async (req, res) => {
  try {
    const { id_escuela, id_grado } = req.body;

    const escuelagradoNuevo = new EscuelaGrados({
      id_escuela: id_escuela,
      id_grado: id_grado,
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

router.delete("/eliminar/:id", async (req, res) => {
  try {
    await EscuelaGrados.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ message: "Escuela por grado eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
