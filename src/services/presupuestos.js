const express = require("express");
const router = express.Router();
const { Presupuestos } = require("../models/presupuestos.model.js");

router.post("/crear", async (req, res) => {
  try {
    const { id_escuela, monto_total, fecha_inicio, fecha_fin, id_usuario } =
      req.body;

    const presupuestoNuevo = new Presupuestos({
      id_escuela: id_escuela,
      monto_total: monto_total,
      fecha_inicio: fecha_inicio,
      fecha_fin: fecha_fin,
      id_usuario: id_usuario,
    });

    const presupuestoRes = await presupuestoNuevo.save();

    res.status(201).json(presupuestoRes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/actualizar/:id", async (req, res) => {
  try {
    const { id_escuela, monto_total, fecha_inicio, fecha_fin, id_usuario } =
      req.body;

    const presupuestoActualizado = await Presupuestos.findByIdAndUpdate(
      req.params.id,
      {
        id_escuela: id_escuela,
        monto_total: monto_total,
        fecha_inicio: fecha_inicio,
        fecha_fin: fecha_fin,
        id_usuario: id_usuario,
      },
      { new: true }
    );
    res.status(200).json(presupuestoActualizado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/obtener", async (req, res) => {
  try {
    const obtenerPresupuesto = await Presupuestos.find(req.params.id);
    res.status(201).json(obtenerPresupuesto);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/eliminar/:id", async (req, res) => {
  try {
    await Presupuestos.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Presupuesto eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
