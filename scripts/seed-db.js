const Database = require('better-sqlite3');
const config = require('../config');

// Conectar a la base de datos
const db = new Database(config.DATABASE.PATH);

console.log('🌱 Poblando base de datos con datos iniciales...');

try {
  // Verificar si ya hay datos
  const existingPosts = db.prepare('SELECT COUNT(*) as count FROM posts').get();
  
  if (existingPosts.count > 0) {
    console.log('⚠️  La base de datos ya contiene datos. Use npm run db:reset para limpiarla primero.');
    process.exit(0);
  }

  // Preparar statements para insertar datos
  const insertPost = db.prepare(`
    INSERT INTO posts (titulo, contenido, autor, fechaCreacion) 
    VALUES (?, ?, ?, ?)
  `);

  const insertComentario = db.prepare(`
    INSERT INTO comentarios (postId, texto, autor, fechaCreacion) 
    VALUES (?, ?, ?, ?)
  `);

  // Insertar posts de ejemplo
  const posts = [
    {
      titulo: "Mi primer post",
      contenido: "Este es el contenido de mi primer post",
      autor: "Juan Pérez",
      fechaCreacion: "2024-01-15"
    },
    {
      titulo: "Aprendiendo APIs",
      contenido: "Hoy estoy aprendiendo sobre APIs REST",
      autor: "María García",
      fechaCreacion: "2024-01-16"
    },
    {
      titulo: "Introducción a Cloudflare D1",
      contenido: "Cloudflare D1 es una base de datos SQLite sin servidor que permite escalar aplicaciones globalmente",
      autor: "Ana Rodríguez",
      fechaCreacion: "2024-01-17"
    }
  ];

  // Usar transacción para asegurar consistencia
  const insertPosts = db.transaction((posts) => {
    const postIds = [];
    for (const post of posts) {
      const result = insertPost.run(post.titulo, post.contenido, post.autor, post.fechaCreacion);
      postIds.push(result.lastInsertRowid);
      console.log(`✅ Post creado con ID: ${result.lastInsertRowid}`);
    }
    return postIds;
  });

  const postIds = insertPosts(posts);

  // Insertar comentarios de ejemplo
  const comentarios = [
    {
      postId: postIds[0],
      texto: "¡Excelente post!",
      autor: "Ana López",
      fechaCreacion: "2024-01-15"
    },
    {
      postId: postIds[0],
      texto: "Muy útil, gracias por compartir",
      autor: "Carlos Ruiz",
      fechaCreacion: "2024-01-16"
    },
    {
      postId: postIds[1],
      texto: "Yo también estoy aprendiendo APIs",
      autor: "Laura Martín",
      fechaCreacion: "2024-01-16"
    },
    {
      postId: postIds[1],
      texto: "¿Tienes algún tutorial recomendado?",
      autor: "Pedro Sánchez",
      fechaCreacion: "2024-01-17"
    },
    {
      postId: postIds[2],
      texto: "Cloudflare D1 parece muy prometedor",
      autor: "Isabel Torres",
      fechaCreacion: "2024-01-17"
    }
  ];

  const insertComentarios = db.transaction((comentarios) => {
    for (const comentario of comentarios) {
      const result = insertComentario.run(
        comentario.postId, 
        comentario.texto, 
        comentario.autor, 
        comentario.fechaCreacion
      );
      console.log(`✅ Comentario creado con ID: ${result.lastInsertRowid}`);
    }
  });

  insertComentarios(comentarios);

  // Mostrar estadísticas finales
  const totalPosts = db.prepare('SELECT COUNT(*) as count FROM posts').get();
  const totalComentarios = db.prepare('SELECT COUNT(*) as count FROM comentarios').get();

  console.log('\n📊 Base de datos poblada correctamente:');
  console.log(`📝 Posts creados: ${totalPosts.count}`);
  console.log(`💬 Comentarios creados: ${totalComentarios.count}`);

} catch (error) {
  console.error('❌ Error al poblar la base de datos:', error.message);
  process.exit(1);
} finally {
  db.close();
} 