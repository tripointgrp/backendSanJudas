const cors = require("cors");
const express = require("express");
const morgan = require("morgan");
const { connectDB } = require("../db/dbclients.js");
require("dotenv").config();

const app = express();

// Configuración personalizada de CORS
const corsOptions = {
  origin: "*", // Reemplaza con el origen desde el que haces las solicitudes
  methods: ["GET", "POST", "PUT", "DELETE"], // Métodos permitidos
  allowedHeaders: ["Content-Type", "Authorization"], // Encabezados permitidos
};

app.use(cors(corsOptions)); // Aplicar las opciones personalizadas de CORS
app.use(morgan("dev"));
app.use(express.json());

connectDB();

const usuarioRoutes = require("./services/usuarios.js");
app.use("/api/usuarios", usuarioRoutes);

const categoriasRoutes = require("./services/categorias.js");
app.use("/api/categorias", categoriasRoutes);

const detallesRoutes = require("./services/detalles_pedido.js");
app.use("/api/detalles", detallesRoutes);

const escuelas_gradosRoutes = require("./services/escuelas_grados.js");
app.use("/api/escuelas_grados", escuelas_gradosRoutes);

const escuelaRoutes = require("./services/escuelas.js");
app.use("/api/escuelas", escuelaRoutes);

const gradoRoutes = require("./services/grado.js");
app.use("/api/grados", gradoRoutes);

const pedidosRoutes = require("./services/pedidos.js");
app.use("/api/pedidos", pedidosRoutes);

const presupuestos_gradosRoutes = require("./services/presupuestos_grados.js");
app.use("/api/presupuestos_grados", presupuestos_gradosRoutes);

// const presupuestosRoutes = require("./services/presupuestos.js");
// app.use("/api/presupuestos", presupuestosRoutes);

const productosRoutes = require("./services/productos.js");
app.use("/api/productos", productosRoutes);

const reportesRoutes = require("./services/reportes.js");
app.use("/api/reportes", reportesRoutes);

const unidad_medidaRoutes = require("./services/unidades_medida.js");
app.use("/api/unidades_medida", unidad_medidaRoutes);

const pedidoSemanalRoutes = require("./services/pedidoSemanal.js");
app.use("/api/pedidosSemanal", pedidoSemanalRoutes);

const presupuestosRealRoutes = require("./services/presupuestoReal.js");
app.use("/api/presupuestos-real", presupuestosRealRoutes);



const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
