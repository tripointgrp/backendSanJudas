const mongoose = require("mongoose");
const { Schema } = mongoose;

const categoriasSchema = new Schema(
  {
    nombre: { type: String, required: true },
  },
  { versionKey: false }
);

const Categorias = mongoose.model("Categorias", categoriasSchema);

module.exports = { Categorias };
