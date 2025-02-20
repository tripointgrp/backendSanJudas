const express = require("express");
const router = express.Router();
const {
  PresupuestosGrados,
} = require("../models/presupuestos_grados.model.js");

router.post("/crear", async (req, res) => {
  try {
    const { id_presupuesto, id_grado, monto_por_grado } = req.body;

    const presupuestogradoNuevo = new PresupuestosGrados({
      id_presupuesto: id_presupuesto,
      id_grado: id_grado,
      monto_por_grado: monto_por_grado,
    });

    const presupuestogradoRes = await presupuestogradoNuevo.save();

    res.status(201).json(presupuestogradoRes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/actualizar/:id", async (req, res) => {
  try {
    const { id_presupuesto, id_grado, monto_por_grado } = req.body;

    const presuepuesgradoActualizado =
      await PresupuestosGrados.findByIdAndUpdate(
        req.params.id,
        {
          id_presupuesto: id_presupuesto,
          id_grado: id_grado,
          monto_por_grado: monto_por_grado,
        },
        { new: true }
      );
    res.status(200).json(presuepuesgradoActualizado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/obtener", async (req, res) => {
  try {
    const obtenerpresupuestogrado = await PresupuestosGrados.find(
      req.params.id
    );
    res.status(201).json(obtenerpresupuestogrado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/eliminar/:id", async (req, res) => {
  try {
    await PresupuestosGrados.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ message: "Presupuesto por grado eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
