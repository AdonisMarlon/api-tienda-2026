import { conmysql } from '../db.js';
import fs from 'fs'; // Módulo nativo de Node para leer archivos
import axios from 'axios'; // Para comunicarnos con GitHub
    
// OBTENER PRODUCTOS
export const getProductos = async (req, res) => {
    try {
        const [result] = await conmysql.query('SELECT * FROM productos');
        res.json(result);
    } catch (error) {
        return res.status(500).json({
            message: 'Error al consultar productos'
        });
    }
}

// CREAR PRODUCTO CON SUBIDA A GITHUB
export const createProducto = async (req, res) => {
    try {
        const { prod_codigo, prod_nombre, prod_stock, prod_precio } = req.body;
        let prod_imagen = null;

        // Si llegó una imagen, la subimos a GitHub
        if (req.file) {
            // 1. Leemos el archivo temporal que guardó Multer y lo convertimos a Base64
            const fileContent = fs.readFileSync(req.file.path, { encoding: 'base64' });
            
            // 2. Variables de tu repositorio
            const repoOwner = 'AdonisMarlon'; 
            const repoName = 'api-tienda-2026';
            const filePath = `uploads/${req.file.filename}`; // Se guardará en la carpeta uploads de GitHub

            // 3. URL de la API de GitHub
            const githubApiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;

            // 4. Enviamos la petición PUT a GitHub
            await axios.put(githubApiUrl, {
                message: `Nueva imagen de producto: ${req.file.filename}`,
                content: fileContent
            }, {
                headers: {
                    'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            });

            // 5. Esta es la URL pública "raw" de GitHub que la app sí podrá leer para mostrar la foto
            prod_imagen = `https://raw.githubusercontent.com/${repoOwner}/${repoName}/main/${filePath}`;
            
            // Borramos el archivo local temporal de Render para ahorrar espacio
            fs.unlinkSync(req.file.path);
        }
        
        // Guardamos en la base de datos MySQL (Clever Cloud)
        const [result] = await conmysql.query(
            'INSERT INTO productos (prod_codigo, prod_nombre, prod_stock, prod_precio, prod_imagen, prod_activo) VALUES (?, ?, ?, ?, ?, 1)',
            [prod_codigo, prod_nombre, prod_stock, prod_precio, prod_imagen]
        );
        
        res.status(201).json({ prod_id: result.insertId, message: 'Producto e imagen subidos con éxito' });
    } catch (error) {
        console.error("Error al subir:", error);
        return res.status(500).json({ message: 'Error en el servidor al crear producto' });
    }
}

// EDITAR PRODUCTO CON SUBIDA A GITHUB
export const putProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const { prod_codigo, prod_nombre, prod_stock, prod_precio } = req.body;
        let prod_imagen = null;
        
        // Si el usuario subió una imagen nueva, la procesamos igual que al crear
        if (req.file) {
            const fileContent = fs.readFileSync(req.file.path, { encoding: 'base64' });
            const repoOwner = 'AdonisMarlon'; 
            const repoName = 'api-tienda-2026';
            const filePath = `uploads/${req.file.filename}`;
            const githubApiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;

            await axios.put(githubApiUrl, {
                message: `Actualiza imagen de producto: ${req.file.filename}`,
                content: fileContent
            }, {
                headers: {
                    'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            });

            prod_imagen = `https://raw.githubusercontent.com/${repoOwner}/${repoName}/main/${filePath}`;
            fs.unlinkSync(req.file.path);
        }
        
        // Preparamos la consulta dinámica
        let query = 'UPDATE productos SET prod_codigo = ?, prod_nombre = ?, prod_stock = ?, prod_precio = ?';
        let params = [prod_codigo, prod_nombre, prod_stock, prod_precio];

        // Si el usuario subió una imagen nueva (prod_imagen ya no es null), la agregamos a la actualización
        if (prod_imagen) {
            query += ', prod_imagen = ?';
            params.push(prod_imagen);
        }

        query += ' WHERE prod_id = ?';
        params.push(id);
        
        await conmysql.query(query, params);
        
        res.json({ message: "Producto actualizado con éxito" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Error en el servidor al actualizar producto'
        });
    }
}

// ELIMINAR (DESACTIVAR) PRODUCTO
export const deleteProducto = async (req, res) => {
    try {
        const { id } = req.params;
        
        const [result] = await conmysql.query('UPDATE productos SET prod_activo = 0 WHERE prod_id = ?', [id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        res.json({ message: 'Producto eliminado con éxito', prod_id: id });
    } catch (error) {
        console.error("Error en DELETE:", error);
        return res.status(500).json({
            message: 'Error en el servidor al intentar eliminar el producto'
        });
    }
}