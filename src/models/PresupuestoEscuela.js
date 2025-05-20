const mongoose = require("mongoose");
const { Schema } = mongoose;

const presupuestoEscuelaSchema = new Schema(
  {
    id_escuela: { type: Schema.Types.ObjectId, ref: "Escuela", required: true },
    anio: { type: Number, required: true },
    mes: { type: Number, required: true }, // 1-12
    monto: { type: Number, required: true }, // monto total disponible
  },
  { versionKey: false }
);

const PresupuestoEscuela = mongoose.model("PresupuestoEscuela", presupuestoEscuelaSchema);

module.exports = { PresupuestoEscuela };
