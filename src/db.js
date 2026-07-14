import { createPool } from "mysql2/promise";
import { BD_HOST, BD_USER, BD_PASSWORD, BD_DATABASE, BD_PORT } from './config.js'

export const conmysql = createPool({
    host: BD_HOST,
    user: BD_USER,
    password: BD_PASSWORD,
    database: BD_DATABASE,
    port: BD_PORT,
    waitForConnections: true,
    connectionLimit: 3,  
    queueLimit: 0
})