import express from 'express';
import cors from 'cors';
import clientesRoutes from './routes/clientes.routes.js'
import authRoutes from './routes/auth.routes.js';
import productosRoutes from './routes/productos.routes.js';
//npm install cors

const app = express();

const corsOptions={
    origin:'*',
    methods:['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials:true
}

app.use(cors(corsOptions)); //habilitar los cors
app.use(express.json());   //para que interprete los onjetos json

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