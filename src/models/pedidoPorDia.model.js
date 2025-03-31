const mongoose = require("mongoose");
const { Schema } = mongoose;

const pedidoPorDiaSchema = new Schema({
  id_pedido: { type: Schema.Types.ObjectId, ref: "Pedidos", required: true },
  fecha: { type: String, required: true }, // ← ahora es texto
});

  
const PedidoPorDia = mongoose.model("PedidoPorDia", pedidoPorDiaSchema);

module.exports = { PedidoPorDia };