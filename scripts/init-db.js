const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const config = require('../config');

// Crear directorio data si no existe
const dataDir = path.dirname(config.DATABASE.PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Conectar a la base de datos
const db = new Database(config.DATABASE.PATH);

console.log('🔧 Inicializando base de datos...');

try {
  // Crear tabla posts
  db.exec(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT NOT NULL,
      contenido TEXT NOT NULL,
      autor TEXT NOT NULL,
      fechaCreacion DATE DEFAULT (date('now')),
      fechaActualizacion DATE DEFAULT (date('now'))
    )
  `);

  // Crear tabla comentarios
  db.exec(`
    CREATE TABLE IF NOT EXISTS comentarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      postId INTEGER NOT NULL,
      texto TEXT NOT NULL,
      autor TEXT NOT NULL,
      fechaCreacion DATE DEFAULT (date('now')),
      fechaActualizacion DATE DEFAULT (date('now')),
      FOREIGN KEY (postId) REFERENCES posts (id) ON DELETE CASCADE
    )
  `);

  // Crear índices para mejorar el rendimiento
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_posts_fechaCreacion ON posts(fechaCreacion);
    CREATE INDEX IF NOT EXISTS idx_comentarios_postId ON comentarios(postId);
    CREATE INDEX IF NOT EXISTS idx_comentarios_fechaCreacion ON comentarios(fechaCreacion);
  `);

  // Trigger para actualizar fechaActualizacion en posts
  db.exec(`
    CREATE TRIGGER IF NOT EXISTS trigger_posts_updated_at
      AFTER UPDATE ON posts
      BEGIN
        UPDATE posts SET fechaActualizacion = date('now') WHERE id = NEW.id;
      END;
  `);

  // Trigger para actualizar fechaActualizacion en comentarios
  db.exec(`
    CREATE TRIGGER IF NOT EXISTS trigger_comentarios_updated_at
      AFTER UPDATE ON comentarios
      BEGIN
        UPDATE comentarios SET fechaActualizacion = date('now') WHERE id = NEW.id;
      END;
  `);

  console.log('✅ Base de datos inicializada correctamente');
  console.log(`📁 Archivo de base de datos: ${config.DATABASE.PATH}`);

} catch (error) {
  console.error('❌ Error al inicializar la base de datos:', error.message);
  process.exit(1);
} finally {
  db.close();
} 