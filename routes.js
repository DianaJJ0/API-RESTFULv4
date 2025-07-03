const express = require('express');
const router = express.Router();

// --- Importar rutas de la API ---
const usuariosRoutes = require('./routers/usuarios.routes');
const productosRoutes = require('./routers/productos.routes');
const clientesRoutes = require('./routers/clientes.routes');

// --- Importar rutas de las Vistas ---
const viewsRoutes = require('./routers/views.routes');

// --- RUTAS DE LA API (Devuelven JSON) ---
// Se agrupan bajo el prefijo /api para mayor claridad, (útil jiji) :)
router.use('/api/usuarios', usuariosRoutes);
router.use('/api/clientes', clientesRoutes);
router.use('/api/productos', productosRoutes);

// --- RUTAS DE LAS VISTAS (Devuelven HTML) ---
// sin prefijo, desde la raíz del sitio
router.use('/', viewsRoutes);

module.exports = router;