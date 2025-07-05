// --- Importaciones de Módulos ---
const express = require("express");
const path = require("path"); // Módulo para manejar rutas de archivos
const morgan = require('morgan');
const cookieParser = require('cookie-parser'); // Necesario para manejar cookies de sesión
require("dotenv").config();


// --------- Importaciones Locales -----------
const { dbConnection } = require('./config/database');
const productosRouter = require('./routers/productos.routes.js');
const clientesRouter = require('./routers/clientes.routes.js');
const usuariosRouter = require('./routers/usuarios.routes.js');
const viewsRouter = require('./routers/views.routes.js');
const authRouter = require('./routers/auth.routes.js'); //  El router para la autenticación
const compraRouter = require('./routers/compra.routes.js'); //  Router para las compras
const { checkUser } = require('./middleware/auth.middleware.js');

// --- Inicialización de la Aplicación ---
const app = express();


// --- Conexión a la Base de Datos ---
dbConnection();


// ------------- Middlewares ------------------

// Para parsear datos de formularios y JSON
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Middleware para parsear cookies (esencial para leer el token JWT)
app.use(cookieParser()); 

// Logger de peticiones HTTP en la consola
app.use(morgan('dev'));

// Le dice a Express que la carpeta 'public' en la raíz del proyecto es de acceso público.
app.use(express.static(path.join(__dirname, 'public')));


// --- Configuración del Motor de Plantillas (EJS) ---
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// --- Middleware de Autenticación ---
// Este middleware se encarga de verificar si el usuario está logueado.
// Este middleware se ejecutará en TODAS las peticiones ANTES de que lleguen a las rutas.
// Su trabajo es verificar si hay un usuario logueado y hacerlo disponible para TODAS las vistas (EJS).
app.use(checkUser); 


// --------------- Definición de Rutas -------------------

// Rutas para la API (usadas por Thunder Client o un frontend)
app.use("/v2/api/productos", productosRouter);
app.use("/v2/api/clientes", clientesRouter);
app.use("/v2/api/usuarios", usuariosRouter);

// Rutas para las acciones de autenticación (login, register, logout)
app.use("/auth", authRouter);

// Rutas para las acciones de compra y perfil
app.use("/", compraRouter); // Maneja /comprar/:id y /perfil

// Rutas para las vistas (las páginas que ve el usuario en el navegador)
app.use("/", viewsRouter); // Maneja /, /catalogo, /login, /register



// ----------- Iniciar el Servidor -------------
const PORT = process.env.PORT || 9090;
app.listen(PORT, () => {
  console.log(`Servidor en línea en el puerto ${PORT}`);
});