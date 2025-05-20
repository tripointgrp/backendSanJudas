const express = require("express");
const router = express.Router();
const { PresupuestoEscuela } = require("../models/PresupuestoEscuela");
const { PresupuestoGrado } = require("../models/PresupuestoGrado");
const { EscuelaGrados } = require("../models/escuelas_grados.model");
const mongoose = require("mongoose");
const meses = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];
// POST - Crear presupuestos por grado
router.post("/crear", async (req, res) => {
  try {
    let {
      id_presupuesto_escuela,
      id_escuela_grado,
      monto
    } = req.body;

    monto = Number(monto);

    if (!id_presupuesto_escuela || !id_escuela_grado || !monto) {
      return res.status(400).json({ error: "Faltan datos obligatorios." });
    }

    const presupuestoEscuela = await PresupuestoEscuela.findById(id_presupuesto_escuela);
    if (!presupuestoEscuela) {
      return res.status(400).json({ error: "Presupuesto general de escuela no encontrado." });
    }

    const { anio, mes } = presupuestoEscuela;

    const escuelaGrado = await EscuelaGrados.findById(id_escuela_grado);
    if (!escuelaGrado) {
      return res.status(400).json({ error: "Escuela-grado no encontrado." });
    }

    if (escuelaGrado.id_escuela.toString() !== presupuestoEscuela.id_escuela.toString()) {
      return res.status(400).json({
        error: "El grado no pertenece a la misma escuela del presupuesto general."
      });
    }

    const yaExiste = await PresupuestoGrado.findOne({
      id_presupuesto_escuela,
      id_escuela_grado
    });

    if (yaExiste) {
      return res.status(400).json({
        error: "Este grado ya tiene un presupuesto asignado para este presupuesto general."
      });
    }

    const sumaExistente = await PresupuestoGrado.aggregate([
      { $match: { id_presupuesto_escuela: new mongoose.Types.ObjectId(id_presupuesto_escuela) } },
      { $group: { _id: null, total: { $sum: "$monto" } } }
    ]);

    const totalActual = sumaExistente.length > 0 ? sumaExistente[0].total : 0;
    const nuevoTotal = totalActual + monto;

    if (nuevoTotal > presupuestoEscuela.monto) {
      return res.status(400).json({
        error: `El monto excede el presupuesto general. Ya hay asignados ${totalActual}, estás intentando asignar ${monto}, lo cual suma ${nuevoTotal} de un total disponible de ${presupuestoEscuela.monto}.`
      });
    }

    const nuevoPresupuesto = new PresupuestoGrado({
      id_presupuesto_escuela,
      id_escuela_grado,
      anio,
      mes,
      monto
    });

    const guardado = await nuevoPresupuesto.save();

    res.status(201).json({
      message: "Presupuesto por grado creado correctamente.",
      data: guardado
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



// GET - Obtener presupuestos por grado según presupuesto escuela
router.get("/por-presupuesto/:id_presupuesto_escuela", async (req, res) => {
  try {
    const { id_presupuesto_escuela } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id_presupuesto_escuela)) {
      return res.status(400).json({ error: "ID de presupuesto inválido." });
    }

    const presupuestos = await PresupuestoGrado.find({ id_presupuesto_escuela })
      .populate({
        path: "id_escuela_grado",
        populate: {
          path: "id_grado",
          select: "nombre"
        }
      });

    const meses = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    const datos = presupuestos.map(p => ({
      _id: p._id,
      id_escuela_grado: p.id_escuela_grado?._id,
      nombre_grado: p.id_escuela_grado?.id_grado?.nombre || "No encontrado",
      anio: p.anio,
      mes: p.mes,
      mes_label: meses[p.mes - 1] || "Mes inválido",
      monto: p.monto
    }));

    res.status(200).json({ presupuestos_por_grado: datos });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/eliminar/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Validar que sea un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "ID no válido." });
    }

    const eliminado = await PresupuestoGrado.findByIdAndDelete(id);

    if (!eliminado) {
      return res.status(404).json({ error: "Presupuesto por grado no encontrado." });
    }

    res.status(200).json({
      message: "Presupuesto por grado eliminado correctamente.",
      data: eliminado
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;
