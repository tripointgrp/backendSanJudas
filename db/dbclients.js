// dbclients.js
const mongoose = require("mongoose");

const uri =
  "mongodb+srv://codewavegt:qpy7zvolja7i8AiZ@redelsystem.grf09uc.mongodb.net/sanjudastadeo?retryWrites=true&w=majority";

const connectDB = async () => {
  try {
    await mongoose.connect(uri);
    console.log("Conectado a MongoDB");
  } catch (err) {
    console.error("Error al conectar a MongoDB:", err);
    process.exit(1);
  }
};

module.exports = { connectDB };
