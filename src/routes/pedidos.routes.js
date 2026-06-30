import { Router } from 'express';
import {postInsertarPedido} from '../controladores/pedidosCtrl.js'

import { verificarToken } from '../middlewares/auth.js';

const router = Router()

router.post('/pedidos', verificarToken, postInsertarPedido);

export default router