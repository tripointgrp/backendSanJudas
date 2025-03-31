const mongoose = require("mongoose");
const { Schema } = mongoose;

const pedidosSchema = new Schema({
  id_escuela: { type: Schema.Types.ObjectId, ref: "Escuela", required: true },
  fecha_inicio: { type: Date, required: true }, // lunes
  fecha_fin: { type: Date, required: true }, // viernes
  total: { type: Number },
  id_usuario: { type: Schema.Types.ObjectId, ref: "Usuario", required: true },
});


const Pedidos = mongoose.model("Pedidos", pedidosSchema);

module.exports = { Pedidos };
