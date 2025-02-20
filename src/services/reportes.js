const express = require("express");
const router = express.Router();
const { Reportes } = require("../models/reportes.model.js");

router.post("/crear", async (req, res) => {
  try {
    const { tipo_reporte, id_pedido, fecha_generado, id_usuario } = req.body;

    const productoNuevo = new Reportes({
      tipo_reporte: tipo_reporte,
      id_pedido: id_pedido,
      fecha_generado: fecha_generado,
      id_usuario: id_usuario,
    });

    const productoRes = await productoNuevo.save();

    res.status(201).json(productoRes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/actualizar/:id", async (req, res) => {
  try {
    const { tipo_reporte, id_pedido, fecha_generado, id_usuario } = req.body;

    const reporteActualizado = await Reportes.findByIdAndUpdate(
      req.params.id,
      {
        tipo_reporte: tipo_reporte,
        id_pedido: id_pedido,
        fecha_generado: fecha_generado,
        id_usuario: id_usuario,
      },
      { new: true }
    );
    res.status(200).json(reporteActualizado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/obtener", async (req, res) => {
  try {
    const obtenerReporte = await Reportes.find(req.params.id);
    res.status(201).json(obtenerReporte);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/eliminar/:id", async (req, res) => {
  try {
    await Reportes.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Reporte eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
