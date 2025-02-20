const express = require("express");
const router = express.Router();
const { DetallesPedido } = require("../models/detalles_pedido.model.js");

router.post("/crear", async (req, res) => {
  try {
    const { id_pedido, id_producto, cantidad, total } = req.body;

    const detalleNuevo = new DetallesPedido({
      id_pedido: id_pedido,
      id_producto: id_producto,
      cantidad: cantidad,
      total: total,
    });

    const detalleRes = await detalleNuevo.save();

    res.status(201).json(detalleRes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/actualizar/:id", async (req, res) => {
  try {
    const { id_pedido, id_producto, cantidad, total } = req.body;

    const detalleActualizado = await DetallesPedido.findByIdAndUpdate(
      req.params.id,
      {
        id_pedido: id_pedido,
        id_producto: id_producto,
        cantidad: cantidad,
        total: total,
      },
      { new: true }
    );
    res.status(200).json(detalleActualizado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/obtener", async (req, res) => {
  try {
    const obtenerDetalle = await DetallesPedido.find(req.params.id);
    res.status(201).json(obtenerDetalle);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/eliminar/:id", async (req, res) => {
  try {
    await DetallesPedido.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Detalle eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
