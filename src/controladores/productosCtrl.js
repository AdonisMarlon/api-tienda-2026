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
        
        const [result] = await conmysql.query(
            'INSERT INTO productos (prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo) VALUES (?, ?, ?, ?, 1)',
            [prod_codigo, prod_nombre, prod_stock, prod_precio]
        );
        
        res.status(201).json({ prod_id: result.insertId, message: 'Producto creado con éxito' });
    } catch (error) {
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
        
        const [result] = await conmysql.query(
            'UPDATE productos SET prod_codigo = ?, prod_nombre = ?, prod_stock = ?, prod_precio = ? WHERE prod_id = ?',
            [prod_codigo, prod_nombre, prod_stock, prod_precio, id]
        );
        
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
        
        // Cambiamos el estado a 0 (inactivo) en lugar de hacer un DELETE
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