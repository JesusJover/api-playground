const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Base de datos en memoria
let posts = [
  {
    id: 1,
    titulo: "Mi primer post",
    contenido: "Este es el contenido de mi primer post",
    autor: "Juan Pérez",
    fechaCreacion: "2024-01-15"
  },
  {
    id: 2,
    titulo: "Aprendiendo APIs",
    contenido: "Hoy estoy aprendiendo sobre APIs REST",
    autor: "María García",
    fechaCreacion: "2024-01-16"
  }
];

let comentarios = [
  {
    id: 1,
    postId: 1,
    texto: "¡Excelente post!",
    autor: "Ana López",
    fechaCreacion: "2024-01-15"
  },
  {
    id: 2,
    postId: 1,
    texto: "Muy útil, gracias por compartir",
    autor: "Carlos Ruiz",
    fechaCreacion: "2024-01-16"
  },
  {
    id: 3,
    postId: 2,
    texto: "Yo también estoy aprendiendo APIs",
    autor: "Laura Martín",
    fechaCreacion: "2024-01-16"
  }
];

// Función auxiliar para obtener el siguiente ID
const getNextId = (array) => {
  return array.length > 0 ? Math.max(...array.map(item => item.id)) + 1 : 1;
};

// ========== RUTAS PARA POSTS ==========

// GET /posts - Obtener todos los posts
app.get('/posts', (req, res) => {
  res.json({
    mensaje: "Lista de todos los posts",
    total: posts.length,
    posts: posts
  });
});

// GET /posts/:id - Obtener un post específico
app.get('/posts/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const post = posts.find(p => p.id === id);
  
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
});

// POST /posts - Crear un nuevo post
app.post('/posts', (req, res) => {
  const { titulo, contenido, autor } = req.body;
  
  if (!titulo || !contenido || !autor) {
    return res.status(400).json({
      error: "Datos incompletos",
      mensaje: "Los campos titulo, contenido y autor son obligatorios"
    });
  }
  
  const nuevoPost = {
    id: getNextId(posts),
    titulo,
    contenido,
    autor,
    fechaCreacion: new Date().toISOString().split('T')[0]
  };
  
  posts.push(nuevoPost);
  
  res.status(201).json({
    mensaje: "Post creado exitosamente",
    post: nuevoPost
  });
});

// PUT /posts/:id - Actualizar un post completo
app.put('/posts/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { titulo, contenido, autor } = req.body;
  
  const postIndex = posts.findIndex(p => p.id === id);
  
  if (postIndex === -1) {
    return res.status(404).json({
      error: "Post no encontrado",
      mensaje: `No existe un post con ID ${id}`
    });
  }
  
  if (!titulo || !contenido || !autor) {
    return res.status(400).json({
      error: "Datos incompletos",
      mensaje: "Los campos titulo, contenido y autor son obligatorios"
    });
  }
  
  posts[postIndex] = {
    ...posts[postIndex],
    titulo,
    contenido,
    autor
  };
  
  res.json({
    mensaje: "Post actualizado exitosamente",
    post: posts[postIndex]
  });
});

// PATCH /posts/:id - Actualizar parcialmente un post
app.patch('/posts/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const updates = req.body;
  
  const postIndex = posts.findIndex(p => p.id === id);
  
  if (postIndex === -1) {
    return res.status(404).json({
      error: "Post no encontrado",
      mensaje: `No existe un post con ID ${id}`
    });
  }
  
  posts[postIndex] = {
    ...posts[postIndex],
    ...updates
  };
  
  res.json({
    mensaje: "Post actualizado parcialmente",
    post: posts[postIndex]
  });
});

// DELETE /posts/:id - Eliminar un post
app.delete('/posts/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const postIndex = posts.findIndex(p => p.id === id);
  
  if (postIndex === -1) {
    return res.status(404).json({
      error: "Post no encontrado",
      mensaje: `No existe un post con ID ${id}`
    });
  }
  
  const postEliminado = posts.splice(postIndex, 1)[0];
  
  // También eliminar comentarios relacionados
  comentarios = comentarios.filter(c => c.postId !== id);
  
  res.json({
    mensaje: "Post eliminado exitosamente",
    post: postEliminado
  });
});

// ========== RUTAS PARA COMENTARIOS ==========

// GET /comentarios - Obtener todos los comentarios
app.get('/comentarios', (req, res) => {
  const { postId } = req.query;
  
  let comentariosFiltrados = comentarios;
  
  if (postId) {
    comentariosFiltrados = comentarios.filter(c => c.postId === parseInt(postId));
  }
  
  res.json({
    mensaje: postId ? `Comentarios del post ${postId}` : "Todos los comentarios",
    total: comentariosFiltrados.length,
    comentarios: comentariosFiltrados
  });
});

// GET /comentarios/:id - Obtener un comentario específico
app.get('/comentarios/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const comentario = comentarios.find(c => c.id === id);
  
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
});

// POST /comentarios - Crear un nuevo comentario
app.post('/comentarios', (req, res) => {
  const { postId, texto, autor } = req.body;
  
  if (!postId || !texto || !autor) {
    return res.status(400).json({
      error: "Datos incompletos",
      mensaje: "Los campos postId, texto y autor son obligatorios"
    });
  }
  
  // Verificar que el post existe
  const post = posts.find(p => p.id === parseInt(postId));
  if (!post) {
    return res.status(400).json({
      error: "Post no existe",
      mensaje: `No existe un post con ID ${postId}`
    });
  }
  
  const nuevoComentario = {
    id: getNextId(comentarios),
    postId: parseInt(postId),
    texto,
    autor,
    fechaCreacion: new Date().toISOString().split('T')[0]
  };
  
  comentarios.push(nuevoComentario);
  
  res.status(201).json({
    mensaje: "Comentario creado exitosamente",
    comentario: nuevoComentario
  });
});

// PUT /comentarios/:id - Actualizar un comentario completo
app.put('/comentarios/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { texto, autor } = req.body;
  
  const comentarioIndex = comentarios.findIndex(c => c.id === id);
  
  if (comentarioIndex === -1) {
    return res.status(404).json({
      error: "Comentario no encontrado",
      mensaje: `No existe un comentario con ID ${id}`
    });
  }
  
  if (!texto || !autor) {
    return res.status(400).json({
      error: "Datos incompletos",
      mensaje: "Los campos texto y autor son obligatorios"
    });
  }
  
  comentarios[comentarioIndex] = {
    ...comentarios[comentarioIndex],
    texto,
    autor
  };
  
  res.json({
    mensaje: "Comentario actualizado exitosamente",
    comentario: comentarios[comentarioIndex]
  });
});

// PATCH /comentarios/:id - Actualizar parcialmente un comentario
app.patch('/comentarios/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const updates = req.body;
  
  const comentarioIndex = comentarios.findIndex(c => c.id === id);
  
  if (comentarioIndex === -1) {
    return res.status(404).json({
      error: "Comentario no encontrado",
      mensaje: `No existe un comentario con ID ${id}`
    });
  }
  
  comentarios[comentarioIndex] = {
    ...comentarios[comentarioIndex],
    ...updates
  };
  
  res.json({
    mensaje: "Comentario actualizado parcialmente",
    comentario: comentarios[comentarioIndex]
  });
});

// DELETE /comentarios/:id - Eliminar un comentario
app.delete('/comentarios/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const comentarioIndex = comentarios.findIndex(c => c.id === id);
  
  if (comentarioIndex === -1) {
    return res.status(404).json({
      error: "Comentario no encontrado",
      mensaje: `No existe un comentario con ID ${id}`
    });
  }
  
  const comentarioEliminado = comentarios.splice(comentarioIndex, 1)[0];
  
  res.json({
    mensaje: "Comentario eliminado exitosamente",
    comentario: comentarioEliminado
  });
});

// ========== RUTAS ADICIONALES ==========

// GET / - Información de la API
app.get('/', (req, res) => {
  res.json({
    mensaje: "¡Bienvenido a la API de Posts y Comentarios!",
    version: "1.0.0",
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
});

// HEAD /posts - Información de headers sin el body
app.head('/posts', (req, res) => {
  res.set('X-Total-Posts', posts.length.toString());
  res.set('X-API-Version', '1.0.0');
  res.status(200).end();
});

// HEAD /comentarios - Información de headers sin el body
app.head('/comentarios', (req, res) => {
  res.set('X-Total-Comentarios', comentarios.length.toString());
  res.set('X-API-Version', '1.0.0');
  res.status(200).end();
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

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
  console.log(`📝 Posts disponibles: ${posts.length}`);
  console.log(`💬 Comentarios disponibles: ${comentarios.length}`);
  console.log(`📚 Visita http://localhost:${PORT} para ver la documentación`);
}); 