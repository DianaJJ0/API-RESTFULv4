const mongoose = require('mongoose');

const schemaCliente = new mongoose.Schema({
    documento: {
        type: String,
        required: [true, 'El documento es obligatorio.'],
        unique: true,
        trim: true // Elimina espacios en blanco al inicio y al final (útil).
    },
    nombreCompleto: {
        type: String,
        required: [true, 'El nombre completo es obligatorio.'],
        trim: true
    },
    correo: {
        type: String,
        required: [true, 'El correo electrónico es obligatorio.'],
        unique: true,
        trim: true,
        lowercase: true, // Guarda el correo en minúsculas para consistencia.
        match: [ // Valida que el string tenga formato de email.
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Por favor, introduce un correo electrónico válido.'
        ]
    },
    telefono: {
        type: String,
        trim: true,
        default: '' //Establece un valor por defecto explícito.
    },
    direccion: {
        type: String,
        trim: true,
        default: ''
    },
    fechaNacimiento: {
        type: Date,
    }
}, {
    timestamps: true,
    versionKey: false // Elimina el campo __v del documento para simplificar la estructura.
});

const Cliente = mongoose.model('Cliente', schemaCliente);

module.exports = Cliente;