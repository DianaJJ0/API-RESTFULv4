const mongoose = require('mongoose');

const schemaCliente = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario', // Referencia directa al modelo Usuario
        required: true,
        unique: true // Un usuario solo puede tener un perfil de cliente
    },
    documento: {
        type: String,
        required: [true, 'El documento es obligatorio.'],
        trim: true
    },
    telefono: {
        type: String,
        trim: true,
        default: ''
    },
    direccion: {
        type: String,
        trim: true,
        default: ''
    },
    fechaNacimiento: {
        type: Date,
    },
    historialCompras: [{ // Un array para guardar las referencias de los productos comprados
        producto: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Producto'
        },
        fechaCompra: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true,
    versionKey: false
});

const Cliente = mongoose.model('Cliente', schemaCliente);
module.exports = Cliente;