const mongoose = require("mongoose");
const { Schema } = mongoose;

const usuarioSchema = new Schema(
  {
    correo: { type: String, required: true, unique: true },
    clave: { type: String, required: true },
    nombre: { type: String, required: true },
    contacto: { type: String },
    tipo_usuario: {
      type: String,
      enum: ["Administrador", "Usuario_común"],
      required: true,
    },
  },
  { versionKey: false }
);

const Usuario = mongoose.model("Usuario", usuarioSchema);

module.exports = { Usuario };
