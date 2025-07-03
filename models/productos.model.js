const mongoose = require('mongoose');

// CORRECCIÓN: Se elimina la línea "require('../config/database');"
// La conexión a la base de datos se debe gestionar una única vez en el archivo principal (index.js).
// Incluirla en cada modelo es un antipatrón que puede causar problemas.

const schemaProducto = new mongoose.Schema({
    referencia: {
        type: String,
        required: [true, 'La referencia es obligatoria.'],
        unique: true,
        trim: true // MEJORA: Elimina espacios en blanco al inicio y al final.
    },
    nombre: {
        type: String,
        required: [true, 'El nombre del producto es obligatorio.'],
        trim: true // MEJORA: Asegura que no haya espacios extra.
    },
    descripcion: {
        type: String,
        required: [true, 'La descripción es obligatoria.'],
        trim: true
    },
    precio: {
        type: Number,
        required: [true, 'El precio es obligatorio.'], // MEJORA: Es mejor que sea requerido en lugar de tener un default.
        min: [0, 'El precio no puede ser negativo.']
    },
    stock: {
        type: Number,
        required: [true, 'El stock es obligatorio.'],
        min: [0, 'El stock no puede ser negativo.']
    },
    imagen: {
        type: String,
        trim: true,
        default: 'https://via.placeholder.com/150' //  Se establece una imagen por defecto.
    },
    habilitado: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    // versionKey: false elimina el campo __v del documento.
    versionKey: false
});

const Producto = mongoose.model('Producto', schemaProducto);

module.exports = Producto;