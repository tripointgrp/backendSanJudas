const mongoose = require("mongoose");
const { Schema } = mongoose;

const escuelaSchema = new Schema(
  {
    nombre: { type: String, required: true },
    nit: { type: String, required: true },
    razon_social: { type: String, required: true },
  },
  { versionKey: false }
);

const Escuela = mongoose.model("Escuela", escuelaSchema);

module.exports = { Escuela };
