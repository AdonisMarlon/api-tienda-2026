import { Router } from 'express';
import { getProductos, createProducto, putProducto, deleteProducto } from '../controladores/productosCtrl.js';
import { verificarToken } from '../middlewares/auth.js';
import upload from '../middlewares/upload.js';

const router = Router();

// Rutas protegidas con tu middleware
router.get('/productos', verificarToken, getProductos);
router.post('/productos', verificarToken, upload.single('imagen'), createProducto);
router.put('/productos/:id', verificarToken, upload.single('imagen'), putProducto);
router.delete('/productos/:id', verificarToken, deleteProducto);


export default router;