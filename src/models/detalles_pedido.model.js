const mongoose = require("mongoose");
const { Schema } = mongoose;

const detallespedidoSchema = new Schema(
  {
    id_pedido: { type: Schema.Types.ObjectId, ref: "Pedidos", required: true },
    id_producto: {
      type: Schema.Types.ObjectId,
      ref: "Productos",
      required: true,
    },
    cantidad: { type: Number, required: true },
    total: { type: Number, required: true },
  },
  { versionKey: false }
);

const DetallesPedido = mongoose.model("Detalles_Pedido", detallespedidoSchema);

module.exports = { DetallesPedido };
