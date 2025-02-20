const express = require("express");
const router = express.Router();
const { Productos } = require("../models/productos.model.js");

router.post("/crear", async (req, res) => {
  try {
    const { nombre, precio_variable, marca, id_categoria, id_unidad_medida } =
      req.body;

    const productoNuevo = new Productos({
      nombre: nombre,
      precio_variable: precio_variable,
      marca: marca,
      id_categoria: id_categoria,
      id_unidad_medida: id_unidad_medida,
    });

    const productoRes = await productoNuevo.save();

    res.status(201).json(productoRes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/actualizar/:id", async (req, res) => {
  try {
    const { nombre, precio_variable, marca, id_categoria, id_unidad_medida } =
      req.body;

    const productoActualizado = await Productos.findByIdAndUpdate(
      req.params.id,
      {
        nombre: nombre,
        precio_variable: precio_variable,
        marca: marca,
        id_categoria: id_categoria,
        id_unidad_medida: id_unidad_medida,
      },
      { new: true }
    );
    res.status(200).json(productoActualizado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/obtener", async (req, res) => {
  try {
    const obtenerProducto = await Productos.find(req.params.id);
    res.status(201).json(obtenerProducto);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/eliminar/:id", async (req, res) => {
  try {
    await Productos.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
