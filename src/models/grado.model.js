const mongoose = require("mongoose");
const { Schema } = mongoose;

const gradoSchema = new Schema(
  {
    nombre: { type: String, required: true },
  },
  { versionKey: false }
);

const Grado = mongoose.model("Grado", gradoSchema);

module.exports = { Grado };
