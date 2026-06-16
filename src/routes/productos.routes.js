import { Router } from 'express';
import { getProductos, createProducto, putProducto, deleteProducto } from '../controladores/productosCtrl.js';
import { verificarToken } from '../middlewares/auth.js';

const router = Router();

// Rutas protegidas con tu middleware
router.get('/productos', verificarToken, getProductos);
router.post('/productos', verificarToken, createProducto);
router.put('/productos/:id', verificarToken, putProducto);
router.delete('/productos/:id', verificarToken, deleteProducto);

export default router;