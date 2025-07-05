const express = require('express');
const router = express.Router();

// Importamos las funciones del controlador de CLIENTES (no usuarios)
const {
    obtenerClientes,
    obtenerClientePorDocumento,
    crearCliente,
    actualizarCliente,
    eliminarCliente
} = require('../controllers/clientes.controller.js');

// --- Rutas para la API de Clientes ---

// GET /v2/api/clientes/
router.get('/', obtenerClientes);

// GET /v2/api/clientes/:documento
router.get('/:documento', obtenerClientePorDocumento);

// POST /v2/api/clientes/
router.post('/', crearCliente);

// PUT /v2/api/clientes/:documento
router.put('/:documento', actualizarCliente);

// DELETE /v2/api/clientes/:documento
router.delete('/:documento', eliminarCliente);

module.exports = router;