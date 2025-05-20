const express = require("express");
const router = express.Router();
const { Escuela } = require("../models/escuelas.model.js");
const { EscuelaGrados } = require("../models/escuelas_grados.model.js");
const { PresupuestoEscuela } = require("../models/PresupuestoEscuela.js");

router.post("/crear", async (req, res) => {
  try {
    const { nombre, nit, razon_social } = req.body;

    const escuelaNueva = new Escuela({
      nombre: nombre,
      nit: nit,
      razon_social: razon_social,
    });

    const escuelaRes = await escuelaNueva.save();

    res.status(201).json(escuelaRes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/actualizar/:id", async (req, res) => {
  try {
    const { nombre, nit, razon_social } = req.body;

    const escuelaActualizado = await Escuela.findByIdAndUpdate(
      req.params.id,
      {
        nombre: nombre,
        nit: nit,
        razon_social: razon_social,
      },
      { new: true }
    );
    res.status(200).json(escuelaActualizado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/obtener", async (req, res) => {
  try {
    const escuelas = await Escuela.find();

    const escuelasConDatos = await Promise.all(
      escuelas.map(async (escuela) => {
        const cantidadGrados = await EscuelaGrados.countDocuments({ id_escuela: escuela._id });
        const cantidadPresupuestos = await PresupuestoEscuela.countDocuments({ id_escuela: escuela._id });

        return {
          ...escuela.toObject(),
          cantidadGrados,
          cantidadPresupuestos
        };
      })
    );

    res.status(200).json(escuelasConDatos);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
router.delete("/eliminar/:id", async (req, res) => {
  try {
    await Escuela.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Escuela eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
