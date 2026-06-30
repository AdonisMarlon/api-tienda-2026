import { Router } from 'express';
import { getPedidos, getPedidosxid, postInsertarPedido , putPedido, patchPedido, deletePedido } from '../controladores/pedidosCtrl.js'

import { verificarToken } from '../middlewares/auth.js';

const router = Router()

router.get('/pedidos', verificarToken, getPedidos);
router.get('/pedidos/:id', verificarToken, getPedidosxid); 

router.post('/pedidos', verificarToken, postInsertarPedido);
router.put('/pedidos/:id', verificarToken, putPedido);  


export default router