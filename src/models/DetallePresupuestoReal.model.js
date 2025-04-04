const mongoose = require("mongoose");
const { Schema } = mongoose;

const detallePresupuestoRealSchema = new Schema({
  id_presupuesto_dia: { type: Schema.Types.ObjectId, ref: "PresupuestoRealPorDia", required: true },
  id_grado: { type: Schema.Types.ObjectId, ref: "Escuela_Grados", required: true },
  id_producto: { type: Schema.Types.ObjectId, ref: "Productos", required: true },
  cantidad_comprada: { type: Number, required: true, min: 0 },
  precio_unitario: { type: Number, required: true, min: 0 },
  unidad_medida: { type: Schema.Types.ObjectId, ref: "Unidad_Medida", required: true },
  subtotal: { type: Number, required: true, min: 0 }, // cantidad * precio
  proveedor: { type: String }, // opcional
});

const DetallePresupuestoReal = mongoose.model("DetallePresupuestoReal", detallePresupuestoRealSchema);
module.exports = { DetallePresupuestoReal };
