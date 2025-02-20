const mongoose = require("mongoose");
const { Schema } = mongoose;

const escuelagradosSchema = new Schema(
  {
    id_escuela: { type: Schema.Types.ObjectId, ref: "Escuela", required: true },
    id_grado: {
      type: Schema.Types.ObjectId,
      ref: "Grado",
      required: true,
    },
  },
  { versionKey: false }
);

const EscuelaGrados = mongoose.model("Escuela_Grados", escuelagradosSchema);

module.exports = { EscuelaGrados };
