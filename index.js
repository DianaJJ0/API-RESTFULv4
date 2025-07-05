// --- Importaciones de Módulos ---
const express = require("express");
const path = require("path"); // Módulo para manejar rutas de archivos
const morgan = require('morgan');
require("dotenv").config();

// --- Importaciones Locales ---
const { dbConnection } = require('./config/database');
const productosRouter = require('./routers/productos.routes.js');
const clientesRouter = require('./routers/clientes.routes.js');
const usuariosRouter = require('./routers/usuarios.routes.js');
const viewsRouter = require('./routers/views.routes.js');

// --- Inicialización de la Aplicación ---
const app = express();

// --- Conexión a la Base de Datos ---
dbConnection();

// --- Middlewares ---

// Para parsear datos de formularios y JSON
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Logger de peticiones HTTP en la consola
app.use(morgan('dev'));

// Le dice a Express que la carpeta 'public' en la raíz del proyecto es de acceso público.
app.use(express.static(path.join(__dirname, 'public')));

// --- Configuración del Motor de Plantillas (EJS) ---
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// --- Definición de Rutas ---
app.use("/v2/api/productos", productosRouter); // Rutas de la API de productos
app.use("/v2/api/clientes", clientesRouter);   // Rutas de la API de clientes
app.use("/v2/api/usuarios", usuariosRouter);   // Rutas de la API de usuarios
app.use("/", viewsRouter);                     // Rutas para las vistas (páginas web)

// --- Iniciar el Servidor ---
const PORT = process.env.PORT || 9090;
app.listen(PORT, () => {
  console.log(`Servidor en línea en el puerto ${PORT}`);
});