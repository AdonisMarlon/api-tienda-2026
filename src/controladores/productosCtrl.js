import { conmysql } from '../db.js';

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

// CREAR PRODUCTO
export const createProducto = async (req, res) => {
    try {
        const { prod_codigo, prod_nombre, prod_stock, prod_precio } = req.body;
        
        // Atrapamos el nombre de la imagen si existe, sino lo dejamos como nulo
        const prod_imagen = req.file ? '/uploads/' + req.file.filename : null;
        
        const [result] = await conmysql.query(
            'INSERT INTO productos (prod_codigo, prod_nombre, prod_stock, prod_precio, prod_imagen, prod_activo) VALUES (?, ?, ?, ?, ?, 1)',
            [prod_codigo, prod_nombre, prod_stock, prod_precio, prod_imagen]
        );
        
        res.status(201).json({ prod_id: result.insertId, message: 'Producto creado con éxito' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Error en el servidor al crear producto'
        });
    }
}

// EDITAR PRODUCTO
export const putProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const { prod_codigo, prod_nombre, prod_stock, prod_precio } = req.body;
        
        // Atrapamos la nueva imagen si el usuario decide cambiarla
        const prod_imagen = req.file ? '/uploads/' + req.file.filename : null;
        
        // Preparamos la consulta dinámica
        let query = 'UPDATE productos SET prod_codigo = ?, prod_nombre = ?, prod_stock = ?, prod_precio = ?';
        let params = [prod_codigo, prod_nombre, prod_stock, prod_precio];

        // Si el usuario subió una imagen nueva, la agregamos a la actualización
        if (prod_imagen) {
            query += ', prod_imagen = ?';
            params.push(prod_imagen);
        }

        query += ' WHERE prod_id = ?';
        params.push(id);
        
        const [result] = await conmysql.query(query, params);
        
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