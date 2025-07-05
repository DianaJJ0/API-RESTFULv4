const { Router } = require('express');
const authController = require('../controllers/auth.controller');

// Creamos una nueva instancia del router de Express
const router = Router();

// --- Definición de Rutas de Autenticación ---

// Ruta para MOSTRAR el formulario de registro (GET)
router.get('/register', authController.register_get);

// Ruta para PROCESAR el formulario de registro (POST)
// Esta era probablemente la línea 6 que causaba el error.
router.post('/register', authController.register_post);

// Ruta para MOSTRAR el formulario de login (GET)
router.get('/login', authController.login_get);

// Ruta para PROCESAR el formulario de login (POST)
router.post('/login', authController.login_post);

// Ruta para CERRAR la sesión del usuario (GET)
router.get('/logout', authController.logout_get);


// Exportamos el router para que pueda ser usado en index.js
module.exports = router;