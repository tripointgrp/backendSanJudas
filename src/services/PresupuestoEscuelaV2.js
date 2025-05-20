const express = require("express");
const router = express.Router();
const { PresupuestoEscuela } = require("../models/PresupuestoEscuela.js");
const { Escuela } = require("../models/escuelas.model.js");
const mongoose = require("mongoose");
const { PresupuestoGrado } = require("../models/PresupuestoGrado.js");
const meses = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];
router.get("/por-escuela/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "ID de escuela no válido." });
    }

    const presupuestos = await PresupuestoEscuela.find({ id_escuela: id }).sort({ anio: -1, mes: -1 });

    const presupuestosConConteo = await Promise.all(
      presupuestos.map(async (presupuesto) => {
        const cantidadGrados = await PresupuestoGrado.countDocuments({
          id_presupuesto_escuela: presupuesto._id,
        });

        return {
          _id: presupuesto._id,
          anio: presupuesto.anio,
          mes: presupuesto.mes,
          mes_label: meses[presupuesto.mes - 1], // Aquí el label
          monto: presupuesto.monto,
          cantidad_grados: cantidadGrados
        };
      })
    );

    res.status(200).json({ presupuestos: presupuestosConConteo });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// POST - Crear presupuesto general por escuela
router.post("/crear", async (req, res) => {
  try {
    const { id_escuela, anio, mes, monto } = req.body;

    // Validaciones básicas
    if (!id_escuela || !anio || !mes || !monto) {
      return res.status(400).json({ error: "Faltan datos obligatorios." });
    }

    if (!mongoose.Types.ObjectId.isValid(id_escuela)) {
      return res.status(400).json({ error: "ID de escuela no válido." });
    }

    // Verificar que exista la escuela
    const escuelaExiste = await Escuela.findById(id_escuela);
    if (!escuelaExiste) {
      return res.status(404).json({ error: "Escuela no encontrada." });
    }

    // Verificar si ya hay un presupuesto para ese mes/año/escuela
    const presupuestoExistente = await PresupuestoEscuela.findOne({
      id_escuela,
      anio,
      mes
    });

    if (presupuestoExistente) {
      return res.status(409).json({
        error: "Ya existe un presupuesto para esta escuela en ese mes y año."
      });
    }

    // Crear el presupuesto
    const nuevoPresupuesto = new PresupuestoEscuela({
      id_escuela,
      anio,
      mes,
      monto
    });

    const guardado = await nuevoPresupuesto.save();

    res.status(201).json({
      message: "Presupuesto creado correctamente.",
      data: guardado
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE - Eliminar presupuesto general por ID
router.delete("/eliminar/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Validar que sea un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "ID no válido." });
    }

    // Buscar y eliminar
    const eliminado = await PresupuestoEscuela.findByIdAndDelete(id);

    if (!eliminado) {
      return res.status(404).json({ error: "Presupuesto no encontrado." });
    }

    res.status(200).json({ message: "Presupuesto eliminado correctamente." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;
