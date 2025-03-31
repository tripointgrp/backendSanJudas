// MODELOS USADOS (ya definidos en MongoDB)
// Pedidos (pedido semanal)
// PedidoPorDia (pedido individual por fecha)
// DetallePedido (ingredientes por día y por grado)

const express = require("express");
const router = express.Router();

const { Pedidos } = require("../models/pedidos.model");
const { Grado } = require("../models/grado.model");
const { PedidoPorDia } = require("../models/pedidoPorDia.model");
const { DetallePedido } = require("../models/detalles_pedido.model");

// CREATE
router.post("/crear-pedido-semanal", async (req, res) => {
  try {
    const { id_escuela, fecha_inicio, fecha_fin, id_usuario, total, dias } = req.body;

    const pedido = new Pedidos({
      id_escuela,
      fecha_inicio,
      fecha_fin,
      id_usuario,
      total,
    });
    await pedido.save();

    for (const dia of dias) {
      const pedidoDia = new PedidoPorDia({
        id_pedido: pedido._id,
        fecha: dia.fecha,
      });
      await pedidoDia.save();

      for (const detalle of dia.detalles) {
        const detallePedido = new DetallePedido({
          id_pedido_dia: pedidoDia._id,
          id_grado: detalle.id_grado,
          id_producto: detalle.id_producto,
          cantidad: detalle.cantidad,
          unidad_medida: detalle.unidad_medida,
        });
        await detallePedido.save();
      }
    }

    res.status(201).json({ message: "Pedido semanal creado con éxito" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ (obtener todos los detalles por semana)
router.get("/pedido/:id", async (req, res) => {
  try {
    const pedido = await Pedidos.findById(req.params.id);
    const dias = await PedidoPorDia.find({ id_pedido: pedido._id });

    const resultado = [];
    for (const dia of dias) {
      const detalles = await DetallePedido.find({ id_pedido_dia: dia._id });
      resultado.push({
        fecha: dia.fecha,
        detalles,
      });
    }

    res.json({ pedido, dias: resultado });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE pedido (cambia detalles de un día)
router.put("/pedido-dia/:id", async (req, res) => {
  try {
    const { fecha, detalles } = req.body;
    await PedidoPorDia.findByIdAndUpdate(req.params.id, { fecha });
    await DetallePedido.deleteMany({ id_pedido_dia: req.params.id });

    for (const detalle of detalles) {
      const detallePedido = new DetallePedido({
        id_pedido_dia: req.params.id,
        id_grado: detalle.id_grado,
        id_producto: detalle.id_producto,
        cantidad: detalle.cantidad,
        unidad_medida: detalle.unidad_medida,
      });
      await detallePedido.save();
    }

    res.json({ message: "Pedido diario actualizado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/todos", async (req, res) => {
    try {
      const pedidos = await Pedidos.find()
        .sort({ fecha_inicio: -1 })
        .populate("id_escuela")
        .populate("id_usuario");
  
      res.json(pedidos);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.get("/todos-completo", async (req, res) => {
    try {
      const pedidos = await Pedidos.find()
        .sort({ fecha_inicio: -1 })
        .populate("id_escuela")
        .populate("id_usuario");
  
      const pedidosConDiasYDetalles = await Promise.all(
        pedidos.map(async (pedido) => {
          const dias = await PedidoPorDia.find({ id_pedido: pedido._id });
  
          const diasConDetalles = await Promise.all(
            dias.map(async (dia) => {
              const detalles = await DetallePedido.find({ id_pedido_dia: dia._id })
                .populate({
                  path: 'id_grado',
                  populate: {
                    path: 'id_grado',
                    model: 'Grado'
                  }
                })              
                .populate("id_producto")
                .populate("unidad_medida");
  
              return {
                ...dia.toObject(),
                detalles,
              };
            })
          );
  
          return {
            ...pedido.toObject(),
            dias: diasConDetalles,
          };
        })
      );

      // Esto debería traer el grado completo
const test = await DetallePedido.findOne().populate('id_grado');
console.log(test.id_grado); // debería mostrar el objeto, no null

  
      res.json(pedidosConDiasYDetalles);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  
  

// DELETE (elimina pedido completo con todos los días y detalles)
router.delete("/pedido/:id", async (req, res) => {
  try {
    const dias = await PedidoPorDia.find({ id_pedido: req.params.id });

    for (const dia of dias) {
      await DetallePedido.deleteMany({ id_pedido_dia: dia._id });
      await PedidoPorDia.findByIdAndDelete(dia._id);
    }

    await Pedidos.findByIdAndDelete(req.params.id);

    res.json({ message: "Pedido eliminado correctamente" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
