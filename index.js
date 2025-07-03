/// Importaciones de módulos
const express = require("express");
const path = require("path");
const morgan = require('morgan');
require("dotenv").config();

const { dbConnection } = require('./config/database'); // Importa la función de conexión a la BD

// Se importan los enrutadores modulares
const productosRouter = require('./routers/productos.routes.js');
const clientesRouter = require('./routers/clientes.routes.js');
const usuariosRouter = require('./routers/usuarios.routes.js');

// Inicialización de la aplicación Express
const app = express();

// Conexión a la Base de Datos
dbConnection();

// Configuración de Middlewares
app.use(express.urlencoded({ extended: false })); // Para parsear bodies de formularios
app.use(express.json()); // Para tipo JSON
app.use(express.static('assets')); // Para los archivos estáticos la carpeta 'assets'
app.use(morgan('dev')); // Para logging de las solicitudes en la consola


// Configuración del motor de plantillas (EJS)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Definición de Rutas
// Se asigna una ruta base a cada enrutador.
app.use("/v2/api/productos", productosRouter);
// Todas las rutas definidas en clientes.routes.js ahora comenzarán con /v2/api/clientes
app.use("/v2/api/clientes", clientesRouter);
app.use("/v2/api/usuarios", usuariosRouter);

// Se añade una ruta raíz para dar la bienvenida a la API
app.get("/", (req, res) => {
    res.status(200).json({ mensaje: "Bienvenido a la API RESTful v2" });
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000; // Usa el puerto del .env o el 3000 por defecto
app.listen(PORT, () => {
  console.log(`Servidor en línea en el puerto ${PORT}`);
});