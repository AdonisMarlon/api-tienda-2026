import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { conmysql } from '../db.js';


// Función para el Login
export const login = async (req, res) => {
    try {
        const { usuario, password } = req.body;

        //Buscar si el usuario existe en tu tabla 'usuarios'
        const [result] = await conmysql.query('SELECT * FROM usuarios WHERE usr_usuario = ?', [usuario]);

        if (result.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const user = result[0];

        //Comparar la contraseña que escriben con la encriptada en la BD
        const passwordValida = await bcrypt.compare(password, user.usr_clave);

        if (!passwordValida) {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        //Crear el token de seguridad
        const token = jwt.sign(
            { id: user.usr_id, usuario: user.usr_usuario }, 
            process.env.JWT_SECRET, 
            { expiresIn: '2h' }
        );

        return res.json({ 
            mensaje: 'Login exitoso', 
            token: token,
            nombre: user.usr_nombre 
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error en el servidor al hacer login' });
    }
};

// Función para registrar un usuario de prueba (y encriptar su clave)
export const registrarUsuario = async (req, res) => {
    try {
        const { usuario, password, nombre, telefono, correo } = req.body;
        
        // Encriptar la contraseña
        const salt = await bcrypt.genSalt(10);
        const passwordEncriptada = await bcrypt.hash(password, salt);

        // Guardar en la base de datos
        const [result] = await conmysql.query(
            'INSERT INTO usuarios (usr_usuario, usr_clave, usr_nombre, usr_telefono, usr_correo) VALUES (?, ?, ?, ?, ?)',
            [usuario, passwordEncriptada, nombre, telefono, correo]
        );

        res.status(201).json({ 
            mensaje: 'Usuario registrado con éxito', 
            usr_id: result.insertId 
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al registrar el usuario' });
    }
};


// GUARDAR TOKEN FCM DEL USUARIO
export const guardarTokenFCM = async (req, res) => {
    try {
    const { fcmToken } = req.body;
    const userId = req.user.id; // Desde el token JWT (verificarToken)

    if (!fcmToken) {
        return res.status(400).json({ error: 'Token FCM es requerido' });
    }

    // Guardar en la base de datos
    const [result] = await conmysql.query(
        'UPDATE usuarios SET fcm_token = ? WHERE usr_id = ?',
        [fcmToken, userId]
    );

    if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ 
        message: 'Token FCM guardado correctamente',
        usr_id: userId
    });

    } catch (error) {
        console.error('Error al guardar token FCM:', error);
        res.status(500).json({ error: 'Error al guardar token' });
    }
};