import { Router } from 'express';
import {postInsertarPedido, getPedidos, getPedidoxId} from '../controladores/pedidosCtrl.js'

import { verificarToken } from '../middlewares/auth.js';

const router = Router()

router.get('/pedidos', verificarToken, getPedidos);
router.get('/pedidos/:id', verificarToken, getPedidoxId);
router.post('/pedidos', verificarToken, postInsertarPedido);



export default router