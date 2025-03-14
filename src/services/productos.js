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
    const obtenerProductos = await Productos.find()
      .populate("id_categoria", "nombre") // Obtiene solo el nombre de la categoría
      .populate("id_unidad_medida", "nombre"); // Obtiene solo el nombre de la unidad de medida

    res.status(200).json(obtenerProductos);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/obtener/:id", async (req, res) => {
  try {
    const obtenerProducto = await Productos.findById(req.params.id);
    if (!obtenerProducto) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.status(200).json(obtenerProducto);
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
