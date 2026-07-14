import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function initFirebase() {
    try {
        // Verificar que admin esté definido
        console.log(' admin está definido?', !!admin);
        console.log(' admin.credential está definido?', admin && !!admin.credential);
        
        if (!admin || !admin.credential) {
            console.error(' firebase-admin no se cargó correctamente');
            return null;
        }

        // Intentar desde variable de entorno (Render)
        if (process.env.FIREBASE_SERVICE_ACCOUNT) {
            console.log('🔍 Variable FIREBASE_SERVICE_ACCOUNT encontrada');
            const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
            if (!admin.apps || admin.apps.length === 0) {
                admin.initializeApp({
                    credential: admin.credential.cert(serviceAccount)
                });
            }
            console.log(' Firebase inicializado desde variable de entorno');
            return admin;
        }

        // Intentar desde archivo (desarrollo local)
        const serviceAccountPath = path.join(__dirname, '../service-account-key.json');
        if (fs.existsSync(serviceAccountPath)) {
            console.log('🔍 Archivo service-account-key.json encontrado');
            const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
            if (!admin.apps || admin.apps.length === 0) {
                admin.initializeApp({
                    credential: admin.credential.cert(serviceAccount)
                });
            }
            console.log(' Firebase inicializado desde archivo');
            return admin;
        }

        console.warn(' No hay credenciales de Firebase');
        return null;
    } catch (error) {
        console.error(' Error al inicializar Firebase:', error.message);
        return null;
    }
}

const firebaseAdmin = initFirebase();
export default firebaseAdmin;