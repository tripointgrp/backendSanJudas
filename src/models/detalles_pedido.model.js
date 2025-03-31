const mongoose = require("mongoose");
const { Schema } = mongoose;

const detallePedidoSchema = new Schema({
  id_pedido_dia: { type: Schema.Types.ObjectId, ref: "PedidoPorDia", required: true },
  id_grado: {
    type: Schema.Types.ObjectId,
    ref: "Escuela_Grados", // ✅ esto está bien si así lo guardaste
    required: true,
  },  
  id_producto: { type: Schema.Types.ObjectId, ref: "Productos", required: true },
  cantidad: { type: Number, required: true },
  unidad_medida: { type: Schema.Types.ObjectId, ref: "Unidad_Medida", required: true }, // <- nombre correcto del modelo
});


const DetallePedido = mongoose.model("DetallePedido", detallePedidoSchema);

module.exports = { DetallePedido };
