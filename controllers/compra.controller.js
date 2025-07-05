const Cliente = require('../models/clientes.model.js');
const Producto = require('../models/productos.model.js');
const Usuario = require('../models/usuarios.model.js'); // Importamos el modelo Usuario

// ============ FUNCIÓN PARA PROCESAR UNA COMPRA  ========================
const realizarCompra = async (req, res) => {
    try {
        // Obtenemos el ID del usuario del token (gracias al middleware) y el ID del producto de la URL
        const usuarioId = res.locals.usuario._id; 
        const productoId = req.params.id; // Asumiendo que la ruta es /comprar/:id

        // 1. Verificar que el producto existe
        const producto = await Producto.findById(productoId);
        if (!producto) {
            return res.status(404).send("Producto no encontrado.");
        }

        // 2. Buscar si el usuario ya tiene un perfil de cliente
        let cliente = await Cliente.findOne({ usuario: usuarioId });

        // 3. Si no es cliente, se crea su perfil "promocionándolo"
        if (!cliente) {
            const usuarioActual = res.locals.usuario; // Ya lo tenemos del middleware
            console.log(`CONVIRTIENDO: El usuario ${usuarioActual.nombreCompleto} ahora es un cliente.`);
            
            cliente = new Cliente({
                usuario: usuarioId,
                nombre: usuarioActual.nombreCompleto,
                email: usuarioActual.correo,
                // Puedes dejar datos por defecto o pedirlos más adelante
                documento: '0000000000', 
                telefono: 'N/A',
                direccion: 'N/A'
            });
        }
        

        // 4. Añadir el producto y el precio al historial de compras del cliente
        cliente.historialCompras.push({ 
            producto: productoId,
            precioCompra: producto.precio // Guardamos el precio en el momento de la compra
        });
        await cliente.save();

        // 5. Redirigir a la página de perfil
        console.log(`COMPRA EXITOSA: Cliente ${cliente.nombre} compró producto ${producto.nombre}`);
        res.redirect('/perfil');

    } catch (error) {
        console.error("Error al realizar la compra:", error);
        res.status(500).send("Hubo un error al procesar tu compra.");
    }
};


// ======================     FUNCIÓN PARA MOSTRAR LA PÁGINA DE PERFIL    ================
const verPerfil = async (req, res) => {
    try {
        const usuarioId = res.locals.usuario._id;

        // Buscamos el perfil de cliente asociado al usuario logueado.
        // Usamos .populate() en dos niveles para obtener los datos del producto.
        const cliente = await Cliente.findOne({ usuario: usuarioId })
            .populate({
                path: 'historialCompras',
                populate: {
                    path: 'producto',
                    model: 'Producto'
                }
            });

        // La vista 'perfil.ejs' recibirá el usuario base y el perfil de cliente (que puede ser null)
        res.render('pages/perfil', {
            usuario: res.locals.usuario, // Datos del modelo Usuario
            cliente: cliente,            // Datos del modelo Cliente (con compras populadas)
            error: null
        });

    } catch (error) {
        console.error("Error al cargar el perfil:", error);
        res.status(500).render('pages/perfil', {
            usuario: res.locals.usuario,
            cliente: null,
            error: "Hubo un error al cargar tu información."
        });
    }
};

module.exports = {
    realizarCompra,
    verPerfil
};