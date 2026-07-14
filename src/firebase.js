import admin from 'firebase-admin';

function initFirebase() {
    try {
        // Intentar inicializar con las credenciales por defecto
        // Esto usará automáticamente la variable GOOGLE_APPLICATION_CREDENTIALS
        // o FIREBASE_SERVICE_ACCOUNT si está configurada
        if (!admin.apps || admin.apps.length === 0) {
            admin.initializeApp({
                credential: admin.credential.applicationDefault()
            });
        }
        console.log('✅ Firebase inicializado correctamente');
        return admin;
    } catch (error) {
        console.error('❌ Error al inicializar Firebase:', error.message);
        return null;
    }
}

const firebaseAdmin = initFirebase();
export default firebaseAdmin;