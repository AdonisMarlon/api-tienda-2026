import admin from '../firebase.js';

/**
 * Envía una notificación push a un dispositivo
 */
export const enviarNotificacion = async (fcmToken, title, body) => {
    if (!fcmToken) {
        console.log(' No hay token FCM para enviar notificación');
        return null;
    }

    const message = {
        notification: {
        title: title,
        body: body,
        },
        token: fcmToken,
        android: {
        notification: {
            sound: 'default',
            priority: 'high',
        },
        priority: 'high'
        }
    };

    try {
        const response = await admin.messaging().send(message);
        console.log('✅ Notificación enviada exitosamente:', response);
        return response;
    } catch (error) {
        console.error(' Error al enviar notificación:', error);
        throw error;
    }
};

/**
 * Envía notificación de nuevo pedido al administrador
 */
export const notificarNuevoPedido = async (pedidoId, nombreCliente, adminToken) => {
    const title = '🛒 Nuevo Pedido';
    const body = `Pedido #${pedidoId} creado por ${nombreCliente}`;
    return await enviarNotificacion(adminToken, title, body);
};