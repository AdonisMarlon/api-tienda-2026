import express from 'express';
import cors from 'cors';
import clientesRoutes from './routes/clientes.routes.js'
import authRoutes from './routes/auth.routes.js';
import productosRoutes from './routes/productos.routes.js';
//npm install cors

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const corsOptions={
    origin:'*',
    methods:['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials:true
}

app.use(cors(corsOptions)); //habilitar los cors
app.use(express.json());   //para que interprete los onjetos json
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));//imagenes publicas en internet

//rutas
app.use('/api/auth', authRoutes);
app.use('/api', clientesRoutes);
app.use('/api', productosRoutes);

app.use((req, res, next) => {
    res.status(404).json({
        message:'Endpoint not found'
    })
}) 

export default app;