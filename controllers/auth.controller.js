const Usuario = require('../models/usuarios.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); 

// --- Función para crear el token JWT ---
const maxAge = 3 * 24 * 60 * 60; // 3 días en segundos
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'tu_secreto_por_defecto', {
        expiresIn: maxAge
    });
};

// --- Renderizar la vista de Login ---
module.exports.login_get = (req, res) => {
    res.render('pages/login', { error: null });
}

// --- Renderizar la vista de Registro ---
module.exports.register_get = (req, res) => {
    res.render('pages/register', { error: null });
}

// ===================             FUNCIÓN DE REGISTRO            =======================

module.exports.register_post = async (req, res) => {
    // 1. Extraemos los datos del cuerpo de la petición (del formulario)
    const { nombreCompleto, correo, password } = req.body;

    try {
        // 2. Hasheamos la contraseña ANTES de crear el usuario.
        // bcrypt.hash es una operación asíncrona, por eso usamos 'await'.
        // El segundo argumento (10) es el 'salt', que añade complejidad al hash.
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Creamos el usuario en la base de datos usando el modelo.
        // Guardamos la contraseña ya hasheada, nunca la original.
        const usuario = await Usuario.create({ 
            nombreCompleto, 
            correo, 
            password: hashedPassword 
        });

        // 4. Si el usuario se crea con éxito, lo redirigimos al login
        // con un parámetro para mostrar un mensaje de éxito.
        console.log('Usuario registrado con éxito:', usuario);
        res.redirect('/login?registered=true');

    } catch (error) {
        // 5. Si algo falla (ej: email duplicado, validación del modelo, etc.)
        // capturamos el error aquí.
        console.error("Error en el registro:", error); // para depurar!

        // Enviamos el error a la vista para que el usuario sepa qué pasó.
        res.status(400).render('pages/register', { error: 'No se pudo completar el registro. Verifique sus datos.' });
    }
}


// --- Procesar el inicio de sesión ---
module.exports.login_post = async (req, res) => {
    const { correo, password } = req.body;

    try {
        const usuario = await Usuario.findOne({ correo });
        if (usuario) {
            const auth = await bcrypt.compare(password, usuario.password);
            if (auth) {
                const token = createToken(usuario._id);
                res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
                res.redirect('/catalogo');
            } else {
                res.status(400).render('pages/login', { error: 'Contraseña incorrecta.' });
            }
        } else {
            res.status(400).render('pages/login', { error: 'Este correo no está registrado.' });
        }
    } catch (error) {
        console.error("Error en login:", error);
        res.status(500).render('pages/login', { error: 'Ocurrió un error en el servidor.' });
    }
}

// --- Cerrar sesión ---
module.exports.logout_get = (req, res) => {
    // Reemplazamos la cookie con una vacía que expira inmediatamente
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
}