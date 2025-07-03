const express = require('express');
const router = express.Router();

// Importamos la función del controlador de productos que renderiza la vista principal
// que muestra el catálogo de productos
const { vistaPrincipal } = require('../controllers/productos.controller.js');

// Ruta para la página principal (el catálogo)
router.get('/', vistaPrincipal);

module.exports = router;