const express = require('express');
const cors = require('cors');
const config = require('./config');
const db = require('./database/db');

const app = express();
const PORT = config.PORT;

// Middleware
app.use(cors());
app.use(express.json());

// Middleware para manejo de errores de base de datos
const handleDbError = (error, res) => {
  console.error('Error de base de datos:', error.message);
  res.status(500).json({
    error: "Error interno del servidor",
    mensaje: "Ha ocurrido un error al procesar la solicitud"
  });
};

// ========== RUTAS PARA POSTS ==========

// GET /posts - Obtener todos los posts
app.get('/posts', async (req, res) => {
  try {
    const posts = db.getAllPosts();
    res.json({
      mensaje: "Lista de todos los posts",
      total: posts.length,
      posts: posts
    });
  } catch (error) {
    handleDbError(error, res);
  }
});

// GET /posts/:id - Obtener un post específico
app.get('/posts/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const post = db.getPostById(id);
    
    if (!post) {
      return res.status(404).json({
        error: "Post no encontrado",
        mensaje: `No existe un post con ID ${id}`
      });
    }
    
    res.json({
      mensaje: "Post encontrado",
      post: post
    });
  } catch (error) {
    handleDbError(error, res);
  }
});

// POST /posts - Crear un nuevo post
app.post('/posts', async (req, res) => {
  try {
    const { titulo, contenido, autor } = req.body;
    
    if (!titulo || !contenido || !autor) {
      return res.status(400).json({
        error: "Datos incompletos",
        mensaje: "Los campos titulo, contenido y autor son obligatorios"
      });
    }
    
    const nuevoPost = db.createPost(titulo, contenido, autor);
    
    res.status(201).json({
      mensaje: "Post creado exitosamente",
      post: nuevoPost
    });
  } catch (error) {
    handleDbError(error, res);
  }
});

// PUT /posts/:id - Actualizar un post completo
app.put('/posts/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { titulo, contenido, autor } = req.body;
    
    if (!titulo || !contenido || !autor) {
      return res.status(400).json({
        error: "Datos incompletos",
        mensaje: "Los campos titulo, contenido y autor son obligatorios"
      });
    }
    
    const postActualizado = db.updatePost(id, titulo, contenido, autor);
    
    if (!postActualizado) {
      return res.status(404).json({
        error: "Post no encontrado",
        mensaje: `No existe un post con ID ${id}`
      });
    }
    
    res.json({
      mensaje: "Post actualizado exitosamente",
      post: postActualizado
    });
  } catch (error) {
    handleDbError(error, res);
  }
});

// PATCH /posts/:id - Actualizar parcialmente un post
app.patch('/posts/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updates = req.body;
    
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        error: "Datos vacíos",
        mensaje: "Debe proporcionar al menos un campo para actualizar"
      });
    }
    
    const postActualizado = db.patchPost(id, updates);
    
    if (!postActualizado) {
      return res.status(404).json({
        error: "Post no encontrado",
        mensaje: `No existe un post con ID ${id}`
      });
    }
    
    res.json({
      mensaje: "Post actualizado parcialmente",
      post: postActualizado
    });
  } catch (error) {
    handleDbError(error, res);
  }
});

// DELETE /posts/:id - Eliminar un post
app.delete('/posts/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const postEliminado = db.deletePost(id);
    
    if (!postEliminado) {
      return res.status(404).json({
        error: "Post no encontrado",
        mensaje: `No existe un post con ID ${id}`
      });
    }
    
    res.json({
      mensaje: "Post eliminado exitosamente",
      post: postEliminado
    });
  } catch (error) {
    handleDbError(error, res);
  }
});

// ========== RUTAS PARA COMENTARIOS ==========

// GET /comentarios - Obtener todos los comentarios
app.get('/comentarios', async (req, res) => {
  try {
    const { postId } = req.query;
    const comentarios = db.getAllComentarios(postId ? parseInt(postId) : null);
    
    res.json({
      mensaje: postId ? `Comentarios del post ${postId}` : "Todos los comentarios",
      total: comentarios.length,
      comentarios: comentarios
    });
  } catch (error) {
    handleDbError(error, res);
  }
});

// GET /comentarios/:id - Obtener un comentario específico
app.get('/comentarios/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const comentario = db.getComentarioById(id);
    
    if (!comentario) {
      return res.status(404).json({
        error: "Comentario no encontrado",
        mensaje: `No existe un comentario con ID ${id}`
      });
    }
    
    res.json({
      mensaje: "Comentario encontrado",
      comentario: comentario
    });
  } catch (error) {
    handleDbError(error, res);
  }
});

// POST /comentarios - Crear un nuevo comentario
app.post('/comentarios', async (req, res) => {
  try {
    const { postId, texto, autor } = req.body;
    
    if (!postId || !texto || !autor) {
      return res.status(400).json({
        error: "Datos incompletos",
        mensaje: "Los campos postId, texto y autor son obligatorios"
      });
    }
    
    const nuevoComentario = db.createComentario(parseInt(postId), texto, autor);
    
    res.status(201).json({
      mensaje: "Comentario creado exitosamente",
      comentario: nuevoComentario
    });
  } catch (error) {
    if (error.message.includes('no existe')) {
      return res.status(400).json({
        error: "Post no existe",
        mensaje: error.message
      });
    }
    handleDbError(error, res);
  }
});

// PUT /comentarios/:id - Actualizar un comentario completo
app.put('/comentarios/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { texto, autor } = req.body;
    
    if (!texto || !autor) {
      return res.status(400).json({
        error: "Datos incompletos",
        mensaje: "Los campos texto y autor son obligatorios"
      });
    }
    
    const comentarioActualizado = db.updateComentario(id, texto, autor);
    
    if (!comentarioActualizado) {
      return res.status(404).json({
        error: "Comentario no encontrado",
        mensaje: `No existe un comentario con ID ${id}`
      });
    }
    
    res.json({
      mensaje: "Comentario actualizado exitosamente",
      comentario: comentarioActualizado
    });
  } catch (error) {
    handleDbError(error, res);
  }
});

// PATCH /comentarios/:id - Actualizar parcialmente un comentario
app.patch('/comentarios/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updates = req.body;
    
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        error: "Datos vacíos",
        mensaje: "Debe proporcionar al menos un campo para actualizar"
      });
    }
    
    const comentarioActualizado = db.patchComentario(id, updates);
    
    if (!comentarioActualizado) {
      return res.status(404).json({
        error: "Comentario no encontrado",
        mensaje: `No existe un comentario con ID ${id}`
      });
    }
    
    res.json({
      mensaje: "Comentario actualizado parcialmente",
      comentario: comentarioActualizado
    });
  } catch (error) {
    handleDbError(error, res);
  }
});

// DELETE /comentarios/:id - Eliminar un comentario
app.delete('/comentarios/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const comentarioEliminado = db.deleteComentario(id);
    
    if (!comentarioEliminado) {
      return res.status(404).json({
        error: "Comentario no encontrado",
        mensaje: `No existe un comentario con ID ${id}`
      });
    }
    
    res.json({
      mensaje: "Comentario eliminado exitosamente",
      comentario: comentarioEliminado
    });
  } catch (error) {
    handleDbError(error, res);
  }
});

// ========== RUTAS ADICIONALES ==========

// GET / - Información de la API
app.get('/', async (req, res) => {
  try {
    const stats = db.getStats();
    
    res.json({
      mensaje: "¡Bienvenido a la API de Posts y Comentarios con Cloudflare D1!",
      version: config.API.VERSION,
      estadisticas: {
        posts: stats.posts,
        comentarios: stats.comentarios
      },
      baseDatos: "SQLite (Cloudflare D1 compatible)",
      endpoints: {
        posts: {
          "GET /posts": "Obtener todos los posts",
          "GET /posts/:id": "Obtener un post específico",
          "POST /posts": "Crear un nuevo post",
          "PUT /posts/:id": "Actualizar un post completo",
          "PATCH /posts/:id": "Actualizar parcialmente un post",
          "DELETE /posts/:id": "Eliminar un post"
        },
        comentarios: {
          "GET /comentarios": "Obtener todos los comentarios (opcional: ?postId=X)",
          "GET /comentarios/:id": "Obtener un comentario específico",
          "POST /comentarios": "Crear un nuevo comentario",
          "PUT /comentarios/:id": "Actualizar un comentario completo",
          "PATCH /comentarios/:id": "Actualizar parcialmente un comentario",
          "DELETE /comentarios/:id": "Eliminar un comentario"
        }
      }
    });
  } catch (error) {
    handleDbError(error, res);
  }
});

// HEAD /posts - Información de headers sin el body
app.head('/posts', async (req, res) => {
  try {
    const stats = db.getStats();
    res.set('X-Total-Posts', stats.posts.toString());
    res.set('X-API-Version', config.API.VERSION);
    res.set('X-Database-Type', 'SQLite-D1');
    res.status(200).end();
  } catch (error) {
    res.status(500).end();
  }
});

// HEAD /comentarios - Información de headers sin el body
app.head('/comentarios', async (req, res) => {
  try {
    const stats = db.getStats();
    res.set('X-Total-Comentarios', stats.comentarios.toString());
    res.set('X-API-Version', config.API.VERSION);
    res.set('X-Database-Type', 'SQLite-D1');
    res.status(200).end();
  } catch (error) {
    res.status(500).end();
  }
});

// OPTIONS para CORS preflight
app.options('*', (req, res) => {
  res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.status(200).end();
});

// Middleware para manejar rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    error: "Endpoint no encontrado",
    mensaje: `La ruta ${req.method} ${req.originalUrl} no existe`,
    sugerencia: "Visita GET / para ver todos los endpoints disponibles"
  });
});

// Manejo de cierre graceful
process.on('SIGINT', () => {
  console.log('\n🛑 Cerrando servidor...');
  db.close();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Cerrando servidor...');
  db.close();
  process.exit(0);
});

// Iniciar el servidor
app.listen(PORT, () => {
  const stats = db.getStats();
  console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
  console.log(`🗄️  Base de datos: SQLite (compatible con Cloudflare D1)`);
  console.log(`📝 Posts disponibles: ${stats.posts}`);
  console.log(`💬 Comentarios disponibles: ${stats.comentarios}`);
  console.log(`📚 Visita http://localhost:${PORT} para ver la documentación`);
}); 