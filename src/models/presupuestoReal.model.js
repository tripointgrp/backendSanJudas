const mongoose = require("mongoose");
const { Schema } = mongoose;

const presupuestoRealSchema = new Schema({
  id_escuela: { type: Schema.Types.ObjectId, ref: "Escuela", required: true },
  fecha_inicio: { type: Date, required: true },
  fecha_fin: { type: Date, required: true },
  total: { type: Number, default: 0 }, // total gastado en la semana
  id_usuario: { type: Schema.Types.ObjectId, ref: "Usuario", required: true },
  observaciones: { type: String }, // opcional
});

const PresupuestoReal = mongoose.model("PresupuestoReal", presupuestoRealSchema);
module.exports = { PresupuestoReal };
