import { Router } from 'express';
import { login, registrarUsuario } from '../controladores/authCtrl.js'; 

const router = Router();

// Ruta pública para hacer login
router.post('/login', login);
// Ruta para crear un usuario de prueba con clave encriptada
router.post('/registro', registrarUsuario);

export default router;