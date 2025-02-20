const mongoose = require("mongoose");
const { Schema } = mongoose;

const pedidosSchema = new Schema(
  {
    id_escuela: { type: Schema.Types.ObjectId, ref: "Escuela", required: true },
    id_grado: { type: Schema.Types.ObjectId, ref: "Grado", required: true },
    fecha_pedido: { type: Date, required: true },
    fecha_envio: { type: Date },
    total: { type: Number, required: true },
    id_usuario: { type: Schema.Types.ObjectId, ref: "Usuario", required: true },
  },
  { versionKey: false }
);

const Pedidos = mongoose.model("Pedidos", pedidosSchema);

module.exports = { Pedidos };
