// Configuração central do backend.
// Em produção os valores vêm do ambiente (docker compose --env_file).
// Em desenvolvimento, caímos no módulo legado ./.env (veja env_file como modelo).
const fs = require('fs')
const path = require('path')

let legacy = { db: {} }
try {
    legacy = require('../.env')
    legacy.db = legacy.db || {}
} catch (e) {
    // Sem arquivo .env local — normal em produção.
}

const pick = (envValue, legacyValue, fallback) =>
    envValue !== undefined && envValue !== '' ? envValue : (legacyValue !== undefined ? legacyValue : fallback)

const db = {
    host: pick(process.env.DB_HOST, legacy.db.host, '127.0.0.1'),
    port: Number(pick(process.env.DB_PORT, legacy.db.port, 3306)),
    database: pick(process.env.DB_NAME, legacy.db.database, ''),
    user: pick(process.env.DB_USER, legacy.db.user, ''),
    password: pick(process.env.DB_PASS, legacy.db.password, '')
}

// SSL só entra quando DB_SSL=true; o CA fica em certs/global-bundle.pem na imagem.
if (String(process.env.DB_SSL).toLowerCase() === 'true') {
    const caPath = process.env.DB_SSL_CA || path.join(__dirname, '..', 'certs', 'global-bundle.pem')
    db.ssl = fs.existsSync(caPath) ? { ca: fs.readFileSync(caPath) } : { rejectUnauthorized: true }
}

module.exports = {
    port: Number(process.env.PORT || 4000),
    authSecret: pick(process.env.JWT_SECRET, legacy.authSecret, ''),
    db
}
