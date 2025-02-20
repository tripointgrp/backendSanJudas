const mongoose = require("mongoose");
const { Schema } = mongoose;

const unidadmedidaSchema = new Schema(
  {
    nombre: { type: String, required: true },
  },
  { versionKey: false }
);

const UnidadMedida = mongoose.model("Unidad_Medida", unidadmedidaSchema);

module.exports = { UnidadMedida };
