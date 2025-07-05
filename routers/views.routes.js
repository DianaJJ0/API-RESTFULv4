const express = require('express');
const router = express.Router();
const { vistaPrincipal } = require('../controllers/productos.controller.js');

// Ruta principal y catálogo
router.get('/', vistaPrincipal);
router.get('/catalogo', vistaPrincipal);

// Ruta para MOSTRAR el formulario de login
router.get('/login', (req, res) => {
    res.render('pages/login', {
        title: 'Iniciar sesión | TechStore',
        registered: req.query.registered // Para el mensaje "registrado con éxito"
    });
});

// Ruta para MOSTRAR el formulario de registro
router.get('/register', (req, res) => {
    res.render('pages/register', {
        title: 'Crear cuenta | TechStore',
        error: null // Pasamos un error nulo por defecto
    });
});

module.exports = router;