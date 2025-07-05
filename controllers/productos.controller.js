const modeloProducto = require('../models/productos.model');

// --- GET - Obtener todos los productos (API) ---
const obtenerProductos = async (req, res) => {
    try {
        const productos = await modeloProducto.find();
        res.status(200).json(productos);
    } catch (error) {
        console.error("Error al obtener los productos:", error);
        res.status(500).json({ mensaje: "Error interno del servidor al obtener los productos." });
    }
};

// --- GET - Obtener un producto por referencia (API) ---
const obtenerProducto = async (req, res) => {
    try {
        const productoEncontrado = await modeloProducto.findOne({ referencia: req.params.ref });
        if (productoEncontrado) {
            res.status(200).json(productoEncontrado);
        } else {
            res.status(404).json({ mensaje: `No se encontró ningún producto con la referencia '${req.params.ref}'` });
        }
    } catch (error) {
        console.error("Error al buscar el producto por referencia:", error);
        res.status(500).json({ mensaje: "Error interno del servidor." });
    }
};

// --- POST - Crear un nuevo producto (API) ---
const crearProducto = async (req, res) => {
    try {
        const insercion = await modeloProducto.create(req.body);
        res.status(201).json(insercion);
    } catch (error) {
        console.error('Error al crear el producto:', error);
        res.status(400).json({ mensaje: 'Datos de entrada inválidos.', error: error.message });
    }
};

// --- PUT - Actualizar un producto (API) ---
const actualizarProducto = async (req, res) => {
    try {
        const actualizado = await modeloProducto.findOneAndUpdate({ referencia: req.params.ref }, req.body, { new: true, runValidators: true });
        if (actualizado) {
            res.status(200).json({ mensaje: "Actualización exitosa", producto: actualizado });
        } else {
            res.status(404).json({ mensaje: `No se encontró el producto con referencia '${req.params.ref}' para actualizar.` });
        }
    } catch (error) {
        console.error("Error al actualizar el producto:", error);
        res.status(400).json({ mensaje: "Error al actualizar el producto.", error: error.message });
    }
};

// --- DELETE - Eliminar un producto (API) ---
const eliminarProducto = async (req, res) => {
    try {
        const eliminacion = await modeloProducto.findOneAndDelete({ referencia: req.params.ref });
        if (eliminacion) {
            res.status(200).json({ mensaje: "Producto eliminado exitosamente." });
        } else {
            res.status(404).json({ mensaje: `No se encontró el producto con referencia '${req.params.ref}' para eliminar.` });
        }
    } catch (error) {
        console.error("Error al eliminar el producto:", error);
        res.status(500).json({ mensaje: "Error interno del servidor." });
    }
};

// --- FUNCIÓN PARA RENDERIZAR LA VISTA PRINCIPAL (HTML) ---
const vistaPrincipal = async (req, res) => {
    try {
        // mostrar solo productos publicados.
        const productos = await modeloProducto.find({ publicado: true });
        
        // Le pasamos los productos encontrados a la vista 'catalogo.ejs'
        res.render('pages/catalogo', {
            productos: productos 
        });
    } catch (error) {
        console.error('Error al renderizar la vista principal:', error);
        res.status(500).send('Error interno del servidor al cargar el catálogo.');
    }
};
// Exportamos todas las funciones
module.exports = {
    vistaPrincipal,
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    eliminarProducto
};