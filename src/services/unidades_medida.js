const express = require("express");
const router = express.Router();
const { UnidadMedida } = require("../models/unidades_medida.model.js");

router.post("/crear", async (req, res) => {
  try {
    const { nombre } = req.body;

    const unidamedidaNuevo = new UnidadMedida({
      nombre: nombre,
    });

    const unidamedidaRes = await unidamedidaNuevo.save();

    res.status(201).json(unidamedidaRes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/actualizar/:id", async (req, res) => {
  try {
    const { nombre } = req.body;

    const unidadActualizado = await UnidadMedida.findByIdAndUpdate(
      req.params.id,
      {
        nombre: nombre,
      },
      { new: true }
    );
    res.status(200).json(unidadActualizado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/obtener", async (req, res) => {
  try {
    const obtenerUnidad = await UnidadMedida.find(req.params.id);
    res.status(201).json(obtenerUnidad);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/eliminar/:id", async (req, res) => {
  try {
    await UnidadMedida.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Unidad eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
