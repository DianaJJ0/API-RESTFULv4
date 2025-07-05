const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

// Importamos el modelo de usuario correcto
const Usuario = require('../models/usuarios.model.js');

// Importamos las funciones del controlador de usuarios
const {
    obtenerUsuarios,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario
} = require('../controllers/usuarios.controller.js');

// --- RUTAS DE AUTENTICACIÓN (API) ---

// POST /v2/api/usuarios/login - Autenticar usuario
router.post('/login', async (req, res) => {
    try {
        const { correo, password } = req.body;
        
        // Validación básica
        if (!correo || !password) {
            return res.status(400).json({
                success: false,
                message: 'Correo y contraseña son requeridos'
            });
        }
        
        // Buscar usuario en la base de datos
        const usuario = await Usuario.findOne({ correo: correo.toLowerCase() });
        
        if (!usuario) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }
        
        // Verificar contraseña
        const passwordValida = await bcrypt.compare(password, usuario.password);
        
        if (!passwordValida) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }
        
        // Login exitoso - redirigir según el rol
        if (usuario.rol === 'admin' || usuario.rol === 'empleado') {
            // Redirigir a panel de administración (por ahora al catálogo)
            res.redirect('/catalogo?admin=true');
        } else {
            // Cliente normal - redirigir al catálogo
            res.redirect('/catalogo');
        }
        
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
});

// POST /v2/api/usuarios/register - Registrar nuevo usuario
router.post('/register', async (req, res) => {
    try {
        console.log('=== DATOS RECIBIDOS PARA REGISTRO ===');
        console.log('Body completo:', req.body);
        
        const { correo, documento, nombreCompleto, fechaNacimiento, password, confirmPassword, rol, telefono, direccion } = req.body;
        
        // Validación básica
        if (!correo || !documento || !nombreCompleto || !fechaNacimiento || !password || !rol) {
            console.log('Error: Campos faltantes');
            return res.status(400).render('pages/register', {
                title: 'Crear cuenta | TechStore',
                error: 'Todos los campos obligatorios son requeridos'
            });
        }
        
        // Validar que las contraseñas coincidan
        if (password !== confirmPassword) {
            console.log('Error: Contraseñas no coinciden');
            return res.status(400).render('pages/register', {
                title: 'Crear cuenta | TechStore',
                error: 'Las contraseñas no coinciden'
            });
        }
        
        // Validación de contraseña
        if (password.length < 8) {
            console.log('Error: Contraseña muy corta');
            return res.status(400).render('pages/register', {
                title: 'Crear cuenta | TechStore',
                error: 'La contraseña debe tener al menos 8 caracteres'
            });
        }
        
        console.log('🔍 Verificando si existe usuario con correo:', correo);
        console.log('🔍 Verificando si existe usuario con documento:', documento);
        
        // Verificar si el usuario ya existe
        const usuarioExistente = await Usuario.findOne({ 
            $or: [
                { correo: correo.toLowerCase() },
                { documento: documento }
            ]
        });
        
        if (usuarioExistente) {
            console.log('Usuario ya existe:', usuarioExistente);
            const mensaje = usuarioExistente.correo === correo.toLowerCase() 
                ? 'Ya existe una cuenta con este correo electrónico'
                : 'Ya existe una cuenta con este documento';
            
            return res.status(409).render('pages/register', {
                title: 'Crear cuenta | TechStore',
                error: mensaje
            });
        }
        
        console.log('Usuario no existe, procediendo a crear...');
        
        // Encriptar contraseña
        const salt = await bcrypt.genSalt(10);
        const passwordEncriptada = await bcrypt.hash(password, salt);
        
        // Preparar datos del usuario
        const datosUsuario = {
            correo: correo.toLowerCase(),
            documento,
            nombreCompleto,
            fechaNacimiento,
            password: passwordEncriptada,
            rol
        };
        
        // Agregar campos opcionales si el rol es cliente
        if (rol === 'cliente') {
            if (telefono) datosUsuario.telefono = telefono;
            if (direccion) datosUsuario.direccion = direccion;
        }
        
        console.log('Datos a guardar:', { ...datosUsuario, password: '[ENCRIPTADA]' });
        
        // Crear usuario
        const nuevoUsuario = await Usuario.create(datosUsuario);
        
        console.log(' Usuario creado exitosamente:', nuevoUsuario.correo);
        
        // Redirigir al login después del registro exitoso
        res.redirect('/login?registered=true');
        
    } catch (error) {
        console.error(' Error completo en registro:', error);
        
        if (error.code === 11000) {
            console.log(' Error de duplicado detectado:', error.keyPattern);
            const campo = Object.keys(error.keyPattern)[0];
            const mensaje = campo === 'correo' 
                ? 'Ya existe una cuenta con este correo electrónico'
                : 'Ya existe una cuenta con este documento';
                
            return res.status(409).render('pages/register', {
                title: 'Crear cuenta | TechStore',
                error: mensaje
            });
        }
        
        res.status(500).render('pages/register', {
            title: 'Crear cuenta | TechStore',
            error: 'Error interno del servidor. Inténtalo de nuevo.'
        });
    }
});

// --- RUTAS CRUD DE USUARIOS ---

// GET /v2/api/usuarios/
router.get('/', obtenerUsuarios);

// POST /v2/api/usuarios/
router.post('/', crearUsuario);

// PUT /v2/api/usuarios/:email
router.put('/:email', actualizarUsuario);

// DELETE /v2/api/usuarios/:email
router.delete('/:email', eliminarUsuario);

module.exports = router;