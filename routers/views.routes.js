const express = require('express');
const router = express.Router();

// Importamos la función del controlador que se encargará de la lógica
const { vistaPrincipal } = require('../controllers/productos.controller.js');

// --- RUTAS DE VISTAS PRINCIPALES ---

// Cuando un usuario visite la ruta raíz ('/'), se ejecutará la función vistaPrincipal
router.get('/', vistaPrincipal);
// También se puede acceder a la vista principal a través de '/catalogo'
router.get('/catalogo', vistaPrincipal);

// --- RUTAS DE AUTENTICACIÓN (VISTAS) ---

// Ruta para mostrar el formulario de login
router.get('/login', (req, res) => {
    res.render('pages/login', {
        title: 'Iniciar sesión | TechStore',
        registered: req.query.registered
    });
});

// Ruta para mostrar el formulario de registro
router.get('/register', (req, res) => {
    res.render('pages/register', {
        title: 'Crear cuenta | TechStore'
    });
});

module.exports = router;