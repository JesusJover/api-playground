const Database = require('better-sqlite3');
const config = require('../config');
const fs = require('fs');

console.log('🔄 Reseteando base de datos...');

try {
  // Eliminar archivo de base de datos si existe
  if (fs.existsSync(config.DATABASE.PATH)) {
    fs.unlinkSync(config.DATABASE.PATH);
    console.log('🗑️  Archivo de base de datos eliminado');
  }

  // Ejecutar scripts de inicialización y poblar datos
  console.log('🔧 Reinicializando base de datos...');
  require('./init-db');
  
  console.log('🌱 Poblando con datos iniciales...');
  require('./seed-db');
  
  console.log('✅ Base de datos reseteada correctamente');

} catch (error) {
  console.error('❌ Error al resetear la base de datos:', error.message);
  process.exit(1);
} 