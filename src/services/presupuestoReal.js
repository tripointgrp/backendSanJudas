// MODELOS USADOS (ya definidos en MongoDB)
// PresupuestoReal (semana completa)
// presupuesto_real_por_dia (presupuesto por fecha)
// DetallePresupuestoReal (productos por día y grado con costo real)

const express = require("express");
const router = express.Router();

const { PresupuestoReal } = require("../models/presupuestoReal.model");
const { presupuestoRealPorDia } = require("../models/presupuesto_real_por_dia.model");
const { DetallePresupuestoReal } = require("../models/DetallePresupuestoReal.model");

// CREATE (presupuesto semanal completo)
router.post("/crear-presupuesto-semanal", async (req, res) => {
  try {
    const { id_escuela, fecha_inicio, fecha_fin, id_usuario, observaciones, dias } = req.body;

    // 1. Crear el presupuesto general
    const presupuesto = new PresupuestoReal({
      id_escuela,
      fecha_inicio,
      fecha_fin,
      id_usuario,
      observaciones,
      total: 0,
    });

    await presupuesto.save(); // 👈 esto es vital para que presupuesto._id exista

    let totalGeneral = 0;

    for (const dia of dias) {
      // 2. Crear presupuesto por día
      const presupuestoDia = new presupuestoRealPorDia({
        id_presupuesto: presupuesto._id, // 👈 ahora sí está definido
        fecha: dia.fecha,
        total_dia: 0,
      });

      await presupuestoDia.save();

      let totalDia = 0;

      for (const detalle of dia.detalles) {
        const subtotal = detalle.cantidad_comprada * detalle.precio_unitario;
        totalDia += subtotal;

        const detallePresupuesto = new DetallePresupuestoReal({
          id_presupuesto_dia: presupuestoDia._id,
          id_grado: detalle.id_grado,
          id_producto: detalle.id_producto,
          cantidad_comprada: detalle.cantidad_comprada,
          precio_unitario: detalle.precio_unitario,
          unidad_medida: detalle.unidad_medida,
          proveedor: detalle.proveedor,
          subtotal
        });

        await detallePresupuesto.save();
      }

      // 3. Actualizar total del día
      presupuestoDia.total_dia = totalDia;
      await presupuestoDia.save();

      totalGeneral += totalDia;
    }

    // 4. Actualizar total general
    presupuesto.total = totalGeneral;
    await presupuesto.save();

    res.status(201).json({ message: "Presupuesto semanal creado con éxito" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ (presupuesto completo por ID)
router.get("/presupuesto/:id", async (req, res) => {
  try {
    const presupuesto = await PresupuestoReal.findById(req.params.id)
      .populate("id_escuela")
      .populate("id_usuario");

    const dias = await presupuestoRealPorDia.find({ id_presupuesto: presupuesto._id });

    const resultado = [];
    for (const dia of dias) {
      const detalles = await DetallePresupuestoReal.find({ id_presupuesto_dia: dia._id })
        .populate({
          path: 'id_grado',
          populate: {
            path: 'id_grado',
            model: 'Grado'
          }
        })
        .populate("id_producto")
        .populate("unidad_medida");

      resultado.push({
        fecha: dia.fecha,
        total_dia: dia.total_dia,
        detalles,
      });
    }

    res.json({ presupuesto, dias: resultado });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE (editar detalles de un día específico)
router.put("/presupuesto-dia/:id", async (req, res) => {
  try {
    const { fecha, detalles } = req.body;

    await presupuesto_real_por_dia.findByIdAndUpdate(req.params.id, { fecha });
    await DetallePresupuestoReal.deleteMany({ id_presupuesto_dia: req.params.id });

    let totalDia = 0;

    for (const detalle of detalles) {
      const subtotal = detalle.cantidad_comprada * detalle.precio_unitario;
      totalDia += subtotal;

      const nuevoDetalle = new DetallePresupuestoReal({
        id_presupuesto_dia: req.params.id,
        id_grado: detalle.id_grado,
        id_producto: detalle.id_producto,
        cantidad_comprada: detalle.cantidad_comprada,
        precio_unitario: detalle.precio_unitario,
        unidad_medida: detalle.unidad_medida,
        proveedor: detalle.proveedor,
        subtotal,
      });
      await nuevoDetalle.save();
    }

    await presupuesto_real_por_dia.findByIdAndUpdate(req.params.id, { total_dia: totalDia });

    res.json({ message: "Presupuesto diario actualizado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ (todos los presupuestos, resumen)
router.get("/todos", async (req, res) => {
  try {
    const presupuestos = await PresupuestoReal.find()
      .sort({ fecha_inicio: -1 })
      .populate("id_escuela")
      .populate("id_usuario");

    res.json(presupuestos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ (todos los presupuestos con días y detalles)
router.get("/todos-completo", async (req, res) => {
  try {
    const presupuestos = await PresupuestoReal.find()
      .sort({ fecha_inicio: -1 })
      .populate("id_escuela")
      .populate("id_usuario");

    const presupuestosCompletos = await Promise.all(
      presupuestos.map(async (presupuesto) => {
        const dias = await presupuestoRealPorDia.find({ id_presupuesto: presupuesto._id });

        let totalGeneral = 0;

        const diasConDetalles = await Promise.all(
          dias.map(async (dia) => {
            const detalles = await DetallePresupuestoReal.find({ id_presupuesto_dia: dia._id })
              .populate({
                path: 'id_grado',
                populate: {
                  path: 'id_grado',
                  model: 'Grado'
                }
              })
              .populate("id_producto")
              .populate("unidad_medida");

            let totalDia = 0;

            const detallesEnriquecidos = detalles.map((detalle) => {
              const subtotal = detalle.cantidad_comprada * detalle.precio_unitario;
              totalDia += subtotal;

              return {
                ...detalle.toObject(),
                nombre_grado: detalle.id_grado?.id_grado?.nombre || "Sin grado",
                nombre_producto: detalle.id_producto?.nombre || "Sin producto",
                unidad: detalle.unidad_medida?.nombre || "Sin unidad",
                subtotal
              };
            });

            totalGeneral += totalDia;

            return {
              ...dia.toObject(),
              total_dia: totalDia,
              detalles: detallesEnriquecidos
            };
          })
        );

        return {
          ...presupuesto.toObject(),
          total_general: totalGeneral,
          dias: diasConDetalles
        };
      })
    );

    res.status(200).json(presupuestosCompletos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE (elimina presupuesto completo con días y detalles)
router.delete("/presupuesto/:id", async (req, res) => {
  try {
    const dias = await presupuestoRealPorDia.find({ id_presupuesto: req.params.id });

    for (const dia of dias) {
      await DetallePresupuestoReal.deleteMany({ id_presupuesto_dia: dia._id });
      await presupuestoRealPorDia.findByIdAndDelete(dia._id);
    }

    await PresupuestoReal.findByIdAndDelete(req.params.id);

    res.json({ message: "Presupuesto eliminado correctamente" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
