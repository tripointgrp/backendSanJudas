const mongoose = require("mongoose");
const { Schema } = mongoose;

const presupuestoRealPorDiaSchema = new Schema({
  id_presupuesto: { type: Schema.Types.ObjectId, ref: "PresupuestoReal", required: true },
  fecha: { type: String, required: true }, // ← ahora es texto
  total_dia: { type: Number, default: 0 }, // total del día
});

const PresupuestoRealPorDia = mongoose.model("PresupuestoRealPorDia", presupuestoRealPorDiaSchema);
module.exports = { PresupuestoRealPorDia };
