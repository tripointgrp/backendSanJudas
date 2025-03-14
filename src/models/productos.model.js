const mongoose = require("mongoose");
const { Schema } = mongoose;

const productosSchema = new Schema(
  {
    nombre: { type: String, required: true },
    precio_variable: { type: Number, required: true },
    marca: { type: String, required: true },
    id_categoria: { type: Schema.Types.ObjectId, ref: "Categorias", required: true }, // 🔹 Cambiado a "Categorias"
    id_unidad_medida: { type: Schema.Types.ObjectId, ref: "Unidad_Medida", required: true }, // 🔹 Mantén esto si la unidad está bien
  },
  { versionKey: false }
);

const Productos = mongoose.model("Productos", productosSchema);
module.exports = { Productos };
