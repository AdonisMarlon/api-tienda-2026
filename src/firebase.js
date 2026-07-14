import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function initFirebase() {
    try {
        // 1. Intentar leer el archivo de credenciales
        const serviceAccountPath = path.join(__dirname, '../service-account-key.json');
        if (fs.existsSync(serviceAccountPath)) {
            const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
            if (!admin.apps || admin.apps.length === 0) {
                admin.initializeApp({
                    credential: admin.credential.cert(serviceAccount)
                });
            }
            console.log('✅ Firebase inicializado desde archivo');
            return admin;
        }

        // 2. Intentar desde variable de entorno (Render)
        if (process.env.FIREBASE_SERVICE_ACCOUNT) {
            const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
            if (!admin.apps || admin.apps.length === 0) {
                admin.initializeApp({
                    credential: admin.credential.cert(serviceAccount)
                });
            }
            console.log('✅ Firebase inicializado desde variable de entorno');
            return admin;
        }

        console.warn('⚠️ No hay credenciales de Firebase');
        return null;
    } catch (error) {
        console.error('❌ Error al inicializar Firebase:', error.message);
        return null;
    }
}

const firebaseAdmin = initFirebase();
export default firebaseAdmin;