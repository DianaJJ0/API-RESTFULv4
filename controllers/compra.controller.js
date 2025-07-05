const Cliente = require('../models/clientes.model.js');
const Producto = require('../models/productos.model.js');

const realizarCompra = async (req, res) => {
    try {
        const usuarioId = req.usuario._id; // Obtenido del middleware 'protegerRuta'
        const productoId = req.params.productoId;

        // 1. Verificar que el producto existe
        const producto = await Producto.findById(productoId);
        if (!producto) {
            return res.status(404).send("Producto no encontrado.");
        }

        // 2. Buscar si el usuario ya tiene un perfil de cliente
        let cliente = await Cliente.findOne({ usuario: usuarioId });

        // 3. --- analiza al usuario y si compra se vuelve cliente---
        if (!cliente) {
            console.log(`CONVIRTIENDO: El usuario ${usuarioId} ahora es un cliente.`);
            // Si no es cliente, se crea su perfil.
            // Por ahora, creamos el perfil con datos básicos. Más adelante se pueden pedir en un formulario.
            cliente = new Cliente({
                usuario: usuarioId,
                documento: '0000000000', // Dato temporal
                telefono: 'N/A',
                direccion: 'N/A'
            });
        }

        // 4. Añadir el producto al historial de compras del cliente
        cliente.historialCompras.push({ producto: productoId });
        await cliente.save();

        // 5. Redirigir a una página de éxito o al perfil del cliente
        console.log(`COMPRA EXITOSA: Usuario ${usuarioId} compró producto ${productoId}`);
        res.redirect('/perfil'); // Crearemos esta ruta más adelante

    } catch (error) {
        console.error("Error al realizar la compra:", error);
        res.status(500).send("Hubo un error al procesar tu compra.");
    }
};

// Controlador para mostrar el perfil del usuario/cliente
const verPerfil = async (req, res) => {
    try {
        // Buscamos el perfil de cliente asociado al usuario logueado
        const cliente = await Cliente.findOne({ usuario: req.usuario._id }).populate('historialCompras.producto');

        res.render('pages/perfil', {
            title: 'Mi Perfil',
            usuario: req.usuario, // Datos del modelo Usuario
            cliente: cliente      // Datos del modelo Cliente (puede ser null si nunca ha comprado)
        });

    } catch (error) {
        console.error("Error al cargar el perfil:", error);
        res.status(500).send("Error al cargar tu perfil.");
    }
};

module.exports = {
    realizarCompra,
    verPerfil
};