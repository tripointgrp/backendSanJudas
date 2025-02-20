const mongoose = require("mongoose");
const { Schema } = mongoose;

const reportersSchema = new Schema(
  {
    tipo_reporte: {
      type: String,
      enum: ["Diario", "Quincena", "Mensual"],
      required: true,
    },
    id_pedido: {
      type: Schema.Types.ObjectId,
      ref: "Pedidos",
      required: true,
    },
    fecha_generado: { type: Date, required: true },
    id_usuario: {
      type: Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
  },
  { versionKey: false }
);

const Reportes = mongoose.model("Reportes", reportersSchema);

module.exports = { Reportes };
