const express = require("express");
const router = express.Router();
const { Categorias } = require("../models/categorias.model.js");

router.post("/crear", async (req, res) => {
  try {
    const { nombre } = req.body;

    const categoriaNueva = new Categorias({
      nombre: nombre,
    });

    const categoriaRes = await categoriaNueva.save();

    res.status(201).json(categoriaRes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/actualizar/:id", async (req, res) => {
  try {
    const { nombre } = req.body;

    const categoriaActualizado = await Categorias.findByIdAndUpdate(
      req.params.id,
      { nombre: nombre },
      { new: true }
    );
    res.status(200).json(categoriaActualizado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/obtener", async (req, res) => {
  try {
    const obtenerCategoria = await Categorias.find(req.params.id);
    res.status(201).json(obtenerCategoria);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/eliminar/:id", async (req, res) => {
  try {
    await Categorias.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Categoria eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
