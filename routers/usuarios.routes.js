const express = require('express');
const router = express.Router();

// Importamos las funciones del controlador de usuarios
const {
    obtenerUsuarios,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario
} = require('../controllers/usuarios.controller.js');

// --- Rutas para la API de Usuarios ---

// GET /api/usuarios/
router.get('/', obtenerUsuarios);

// POST /api/usuarios/
router.post('/', crearUsuario);

// PUT /api/usuarios/:email
router.put('/:email', actualizarUsuario);

// DELETE /api/usuarios/:email
router.delete('/:email', eliminarUsuario);

module.exports = router;