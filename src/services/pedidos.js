const express = require("express");
const router = express.Router();
const { Pedidos } = require("../models/pedidos.model.js");

router.post("/crear", async (req, res) => {
  try {
    const { id_escuela, id_grado, fecha_pedido, total, id_usuario } = req.body;

    const pedidoNueva = new Pedidos({
      id_escuela: id_escuela,
      id_grado: id_grado,
      fecha_pedido: fecha_pedido,
      total: total,
      id_usuario: id_usuario,
    });

    const pedidoRes = await pedidoNueva.save();

    res.status(201).json(pedidoRes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/actualizar/:id", async (req, res) => {
  try {
    const { id_escuela, id_grado, fecha_pedido, total, id_usuario } = req.body;

    const pedidoActualizado = await Pedidos.findByIdAndUpdate(
      req.params.id,
      {
        id_escuela: id_escuela,
        id_grado: id_grado,
        fecha_pedido: fecha_pedido,
        total: total,
        id_usuario: id_usuario,
      },
      { new: true }
    );
    res.status(200).json(pedidoActualizado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/obtener", async (req, res) => {
  try {
    const obtenerPedido = await Pedidos.find(req.params.id);
    res.status(201).json(obtenerPedido);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/eliminar/:id", async (req, res) => {
  try {
    await Pedidos.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Pedido eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
