const mongoose = require('mongoose');
require('dotenv').config();

// Se define una función asíncrona para encapsular la lógica de conexión
const dbConnection = async () => {
    try {
        // Se construye la URI usando las variables de entorno
        const URI = `mongodb+srv://${process.env.USER_DB}:${process.env.PASS_DB}@adso2873441.e4hnh5b.mongodb.net/${process.env.BASEDATOS}`;

        // Se espera a que la conexión se establezca.
        await mongoose.connect(URI);

        console.log('Conexión exitosa a la base de datos');

    } catch (error) {
        // Si ocurre un error durante la conexión,se muestra en consola
        console.error('Error de conexión a la base de datos:', error);
        // Se lanza un nuevo error para detener la ejecución de la aplicación si la BD no conecta
        throw new Error('Error al iniciar la base de datos. Ver logs.');
    }
};

// Se exporta un objeto que contiene la función de conexión
module.exports = {dbConnection};