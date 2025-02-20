const mongoose = require("mongoose");
const { Schema } = mongoose;

const presupuestosSchema = new Schema(
  {
    id_escuela: {
      type: Schema.Types.ObjectId,
      ref: "Escuela",
      required: true,
    },
    monto_total: { type: Number, required: true },
    fecha_inicio: { type: String, required: true },
    fecha_fin: { type: String, required: true },
    id_usuario: {
      type: Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
  },
  { versionKey: false }
);

const Presupuestos = mongoose.model("Presupuestos", presupuestosSchema);

module.exports = { Presupuestos };
