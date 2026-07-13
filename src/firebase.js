import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar la clave de servicio (está en la raíz del proyecto)
const serviceAccountPath = path.join(__dirname, '../service-account-key.json');
const serviceAccount = JSON.parse(
    fs.readFileSync(serviceAccountPath, 'utf8')
);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

export default admin;