const mongoose = require("mongoose");
const { Schema } = mongoose;

const presupuestosgradosSchema = new Schema(
  {
    id_presupuesto: {
      type: Schema.Types.ObjectId,
      ref: "Presupuestos",
      required: true,
    },
    id_grado: {
      type: Schema.Types.ObjectId,
      ref: "Grado",
      required: true,
    },
    monto_por_grado: {
      type: Number,
      required: true,
    },
  },
  { versionKey: false }
);

const PresupuestosGrados = mongoose.model(
  "Presupuestos_Grados",
  presupuestosgradosSchema
);

module.exports = { PresupuestosGrados };
