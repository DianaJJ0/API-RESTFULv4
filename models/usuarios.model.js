const mongoose = require('mongoose');

const schemaUsuario = new mongoose.Schema({
    documento: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: [7, "El documento debe tener al menos 7 caracteres."],
        maxlength: [10, "El documento debe tener como máximo 10 caracteres."]
    },
    nombreCompleto: {
        type: String,
        required: [true, 'El nombre completo es obligatorio.'],
        trim: true,
        maxlength: 150
    },
    fechaNacimiento: {
        type: Date,
        required: [true, 'La fecha de nacimiento es obligatoria.']
    },
    correo: {
        type: String,
        required: [true, 'El correo electrónico es obligatorio.'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Por favor, introduce un correo electrónico válido.'
        ]
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria.'],
        minlength: [8, 'La contraseña debe tener al menos 8 caracteres.']
    },
    rol: {
        type: String,
        required: true,
        enum: ['cliente', 'empleado', 'admin'], // cliente: compra productos, empleado: maneja tienda, admin: acceso total
        default: 'cliente'
    },
    // Campos adicionales para clientes (opcionales para empleados/admin)
    telefono: {
        type: String,
        trim: true,
        default: ''
    },
    direccion: {
        type: String,
        trim: true,
        default: ''
    }
}, {
    timestamps: true,
    versionKey: false
});

const Usuario = mongoose.model('Usuario', schemaUsuario);

module.exports = Usuario;