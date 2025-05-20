const mongoose = require("mongoose");
const { Schema } = mongoose;

const presupuestoGradoSchema = new Schema(
  {
    id_escuela_grado: {
      type: Schema.Types.ObjectId,
      ref: "Escuela_Grados",
      required: true
    },
    id_presupuesto_escuela: {
      type: Schema.Types.ObjectId,
      ref: "PresupuestoEscuela",
      required: true
    },
    anio: { type: Number, required: true },
    mes: { type: Number, required: true },
    monto: { type: Number, required: true }
  },
  { versionKey: false }
);

const PresupuestoGrado = mongoose.model("PresupuestoGrado", presupuestoGradoSchema);

module.exports = { PresupuestoGrado };
