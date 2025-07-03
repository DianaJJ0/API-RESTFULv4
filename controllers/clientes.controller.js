const modeloCliente = require('../models/clientes.model');

/*GET - Obtener todos los clientes.*/
const obtenerClientes = async (req, res) => {
    try {
        const listaClientes = await modeloCliente.find();
        res.status(200).json(listaClientes);
    } catch (error) {
        console.error("Error al obtener clientes:", error);
        res.status(500).json({ mensaje: "Error interno del servidor al obtener los clientes." });
    }
};

/*GET - Obtener un cliente específico por su documento.*/
const obtenerClientePorDocumento = async (req, res) => {
    try {
        const cliente = await modeloCliente.findOne({ documento: req.params.documento });
        
        if (cliente) {
            res.status(200).json(cliente);
        } else {
            // CORRECCIÓN: Mensaje de error más específico.
            res.status(404).json({ mensaje: `No se encontró ningún cliente con el documento '${req.params.documento}'` });
        }
    } catch (error) {
        console.error("Error al obtener el cliente:", error);
        res.status(500).json({ mensaje: "Error interno del servidor." });
    }
};

/*POST - Crear un nuevo cliente.*/
const crearCliente = async (req, res) => {
    try {
        // Mongoose tomará automáticamente los campos del req.body que coincidan con el esquema.
        const clienteGuardado = await modeloCliente.create(req.body);
        res.status(201).json({ mensaje: "Cliente creado exitosamente", cliente: clienteGuardado });
    } catch (error) {
        console.error("Error al crear el cliente:", error);
        res.status(400).json({ mensaje: "Error al crear el cliente. Verifique los datos.", error: error.message });
    }
};

/*PUT - Actualizar la información de un cliente existente.*/
const actualizarCliente = async (req, res) => {
    try {
        // Se añade la opción { runValidators: true } para asegurar que los datos actualizados
        // cumplan con las validaciones del esquema (ej. campos requeridos, formato de email, etc.).

        const clienteActualizado = await modeloCliente.findOneAndUpdate(
            { documento: req.params.documento }, // Filtro de búsqueda
            req.body,                            // Datos a actualizar
            { new: true, runValidators: true }   // Opciones: retorna el doc nuevo y corre validaciones.
        );

        if (clienteActualizado) {
            res.status(200).json({ mensaje: "Cliente actualizado exitosamente", cliente: clienteActualizado });
        } else {
            res.status(404).json({ mensaje: `No se encontró el cliente con documento '${req.params.documento}' para actualizar.` });
        }
    } catch (error) {
        console.error("Error al actualizar el cliente:", error);
        res.status(400).json({ mensaje: "Error al actualizar el cliente.", error: error.message });
    }
};

/* DELETE - Eliminar un cliente de la base de datos.*/
const eliminarCliente = async (req, res) => {
    try {
        const clienteEliminado = await modeloCliente.findOneAndDelete({ documento: req.params.documento });

        if (clienteEliminado) {
            res.status(200).json({ mensaje: "Cliente eliminado exitosamente." });
        } else {
            res.status(404).json({ mensaje: `No se encontró el cliente con documento '${req.params.documento}' para eliminar.` });
        }
    } catch (error) {
        console.error("Error al eliminar el cliente:", error);
        res.status(500).json({ mensaje: "Error interno del servidor al eliminar el cliente." });
    }
};

module.exports = {
    obtenerClientes,
    obtenerClientePorDocumento,
    crearCliente,
    actualizarCliente,
    eliminarCliente
};