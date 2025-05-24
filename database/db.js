const Database = require('better-sqlite3');
const config = require('../config');
const path = require('path');
const fs = require('fs');

class DatabaseManager {
  constructor() {
    this.db = null;
    this.init();
  }

  init() {
    try {
      // Asegurar que el directorio existe
      const dataDir = path.dirname(config.DATABASE.PATH);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      this.db = new Database(config.DATABASE.PATH);
      this.db.pragma('journal_mode = WAL');
      console.log('🔌 Conectado a la base de datos SQLite');
    } catch (error) {
      console.error('❌ Error al conectar con la base de datos:', error.message);
      throw error;
    }
  }

  // ========== OPERACIONES PARA POSTS ==========

  getAllPosts() {
    try {
      const stmt = this.db.prepare('SELECT * FROM posts ORDER BY fechaCreacion DESC');
      return stmt.all();
    } catch (error) {
      console.error('Error al obtener posts:', error.message);
      throw error;
    }
  }

  getPostById(id) {
    try {
      const stmt = this.db.prepare('SELECT * FROM posts WHERE id = ?');
      return stmt.get(id);
    } catch (error) {
      console.error('Error al obtener post por ID:', error.message);
      throw error;
    }
  }

  createPost(titulo, contenido, autor) {
    try {
      const stmt = this.db.prepare(`
        INSERT INTO posts (titulo, contenido, autor) 
        VALUES (?, ?, ?)
      `);
      const result = stmt.run(titulo, contenido, autor);
      
      // Obtener el post recién creado
      return this.getPostById(result.lastInsertRowid);
    } catch (error) {
      console.error('Error al crear post:', error.message);
      throw error;
    }
  }

  updatePost(id, titulo, contenido, autor) {
    try {
      const stmt = this.db.prepare(`
        UPDATE posts 
        SET titulo = ?, contenido = ?, autor = ?, fechaActualizacion = date('now')
        WHERE id = ?
      `);
      const result = stmt.run(titulo, contenido, autor, id);
      
      if (result.changes === 0) {
        return null; // Post no encontrado
      }
      
      return this.getPostById(id);
    } catch (error) {
      console.error('Error al actualizar post:', error.message);
      throw error;
    }
  }

  patchPost(id, updates) {
    try {
      // Construir la consulta dinámicamente basada en los campos a actualizar
      const fields = Object.keys(updates);
      const setClause = fields.map(field => `${field} = ?`).join(', ');
      const values = Object.values(updates);
      
      const stmt = this.db.prepare(`
        UPDATE posts 
        SET ${setClause}, fechaActualizacion = date('now')
        WHERE id = ?
      `);
      
      const result = stmt.run(...values, id);
      
      if (result.changes === 0) {
        return null; // Post no encontrado
      }
      
      return this.getPostById(id);
    } catch (error) {
      console.error('Error al actualizar parcialmente el post:', error.message);
      throw error;
    }
  }

  deletePost(id) {
    try {
      // Primero obtener el post antes de eliminarlo
      const post = this.getPostById(id);
      if (!post) {
        return null;
      }

      // Eliminar el post (los comentarios se eliminan automáticamente por CASCADE)
      const stmt = this.db.prepare('DELETE FROM posts WHERE id = ?');
      const result = stmt.run(id);
      
      if (result.changes === 0) {
        return null;
      }
      
      return post;
    } catch (error) {
      console.error('Error al eliminar post:', error.message);
      throw error;
    }
  }

  // ========== OPERACIONES PARA COMENTARIOS ==========

  getAllComentarios(postId = null) {
    try {
      let stmt;
      if (postId) {
        stmt = this.db.prepare('SELECT * FROM comentarios WHERE postId = ? ORDER BY fechaCreacion ASC');
        return stmt.all(postId);
      } else {
        stmt = this.db.prepare('SELECT * FROM comentarios ORDER BY fechaCreacion DESC');
        return stmt.all();
      }
    } catch (error) {
      console.error('Error al obtener comentarios:', error.message);
      throw error;
    }
  }

  getComentarioById(id) {
    try {
      const stmt = this.db.prepare('SELECT * FROM comentarios WHERE id = ?');
      return stmt.get(id);
    } catch (error) {
      console.error('Error al obtener comentario por ID:', error.message);
      throw error;
    }
  }

  createComentario(postId, texto, autor) {
    try {
      // Verificar que el post existe
      const post = this.getPostById(postId);
      if (!post) {
        throw new Error(`Post con ID ${postId} no existe`);
      }

      const stmt = this.db.prepare(`
        INSERT INTO comentarios (postId, texto, autor) 
        VALUES (?, ?, ?)
      `);
      const result = stmt.run(postId, texto, autor);
      
      return this.getComentarioById(result.lastInsertRowid);
    } catch (error) {
      console.error('Error al crear comentario:', error.message);
      throw error;
    }
  }

  updateComentario(id, texto, autor) {
    try {
      const stmt = this.db.prepare(`
        UPDATE comentarios 
        SET texto = ?, autor = ?, fechaActualizacion = date('now')
        WHERE id = ?
      `);
      const result = stmt.run(texto, autor, id);
      
      if (result.changes === 0) {
        return null;
      }
      
      return this.getComentarioById(id);
    } catch (error) {
      console.error('Error al actualizar comentario:', error.message);
      throw error;
    }
  }

  patchComentario(id, updates) {
    try {
      const fields = Object.keys(updates);
      const setClause = fields.map(field => `${field} = ?`).join(', ');
      const values = Object.values(updates);
      
      const stmt = this.db.prepare(`
        UPDATE comentarios 
        SET ${setClause}, fechaActualizacion = date('now')
        WHERE id = ?
      `);
      
      const result = stmt.run(...values, id);
      
      if (result.changes === 0) {
        return null;
      }
      
      return this.getComentarioById(id);
    } catch (error) {
      console.error('Error al actualizar parcialmente el comentario:', error.message);
      throw error;
    }
  }

  deleteComentario(id) {
    try {
      const comentario = this.getComentarioById(id);
      if (!comentario) {
        return null;
      }

      const stmt = this.db.prepare('DELETE FROM comentarios WHERE id = ?');
      const result = stmt.run(id);
      
      if (result.changes === 0) {
        return null;
      }
      
      return comentario;
    } catch (error) {
      console.error('Error al eliminar comentario:', error.message);
      throw error;
    }
  }

  // ========== OPERACIONES AUXILIARES ==========

  getStats() {
    try {
      const postsCount = this.db.prepare('SELECT COUNT(*) as count FROM posts').get();
      const comentariosCount = this.db.prepare('SELECT COUNT(*) as count FROM comentarios').get();
      
      return {
        posts: postsCount.count,
        comentarios: comentariosCount.count
      };
    } catch (error) {
      console.error('Error al obtener estadísticas:', error.message);
      throw error;
    }
  }

  close() {
    if (this.db) {
      this.db.close();
      console.log('🔌 Conexión a la base de datos cerrada');
    }
  }
}

// Crear instancia singleton
const dbManager = new DatabaseManager();

module.exports = dbManager; 