const express = require("express");
const router = express.Router();
const { Grado } = require("../models/grado.model.js");

router.post("/crear", async (req, res) => {
  try {
    const { nombre } = req.body;

    const gradoNueva = new Grado({
      nombre: nombre,
    });

    const gradoRes = await gradoNueva.save();

    res.status(201).json(gradoRes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/actualizar/:id", async (req, res) => {
  try {
    const { nombre } = req.body;

    const gradoActualizado = await Grado.findByIdAndUpdate(
      req.params.id,
      {
        nombre: nombre,
      },
      { new: true }
    );
    res.status(200).json(gradoActualizado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/obtener", async (req, res) => {
  try {
    const obtenerGrado = await Grado.find(req.params.id);
    res.status(201).json(obtenerGrado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/eliminar/:id", async (req, res) => {
  try {
    await Grado.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Grado eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
