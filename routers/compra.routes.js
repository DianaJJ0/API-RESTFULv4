const express = require('express');
const router = express.Router();

const { protegerRuta } = require('../middleware/auth.middleware.js');  
const { realizarCompra, verPerfil } = require('../controllers/compra.controller.js');  

// Ruta para procesar la compra de un producto.
// ESTÁ PROTEGIDA: Solo usuarios logueados pueden acceder.
router.post('/comprar/:productoId', protegerRuta, realizarCompra);

// Ruta para ver la página de perfil del usuario.
// También protegida, claro.
router.get('/perfil', protegerRuta, verPerfil);


module.exports = router;