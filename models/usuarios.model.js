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
        // Nota: El hash de la contraseña siempre tendrá una longitud fija (60 caracteres para bcrypt),
    },
    rol: {
        type: String,
        required: true,
        enum: ['user', 'admin'], // El rol solo puede ser uno de estos dos valores.
        default: 'user' // Por defecto, todos los nuevos usuarios son 'user'.
    }
}, {
    timestamps: true,
    versionKey: false
});

// El nombre del modelo debe ser singular y en mayúscula ('Usuario').
// Mongoose creará automáticamente la colección en la base de datos con el nombre en plural y minúsculas ('usuarios').
const Usuario = mongoose.model('Usuario', schemaUsuario);

module.exports = Usuario;