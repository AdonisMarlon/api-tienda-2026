import { Router } from 'express';
import { getClientes, getClientesxid, postInsertarCliente , putCliente, patchCliente, deleteCliente } from '../controladores/clientesCtrl.js'

import { verificarToken } from '../middlewares/auth.js';

const router = Router()

router.get('/clientes', verificarToken, getClientes);
router.get('/clientes/:id', verificarToken, getClientesxid);

router.post('/clientes', verificarToken, postInsertarCliente);
router.put('/clientes/:id', verificarToken, putCliente);

router.patch('/clientes/:id', verificarToken, patchCliente);
router.delete('/clientes/:id', verificarToken, deleteCliente);

export default router