// Worker optimizado para Cloudflare Workers con D1
export default {
  async fetch(request, env, ctx) {
    // Configurar CORS
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // Manejar preflight CORS
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      const url = new URL(request.url);
      const { pathname } = url;
      const method = request.method;

      // Database binding
      const db = env.DB;

      // Helper function para crear respuestas
      const createResponse = (data, status = 200) => {
        return new Response(JSON.stringify(data), {
          status,
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        });
      };

      // Helper function para manejo de errores
      const createErrorResponse = (error, message, status = 500) => {
        console.error('Error:', error);
        return createResponse({
          error: message,
          mensaje: "Ha ocurrido un error al procesar la solicitud"
        }, status);
      };

      // ========== RUTA PRINCIPAL ==========
      if (pathname === '/' && method === 'GET') {
        try {
          const postsCount = await db.prepare('SELECT COUNT(*) as count FROM posts').first();
          const comentariosCount = await db.prepare('SELECT COUNT(*) as count FROM comentarios').first();

          return createResponse({
            mensaje: "¡Bienvenido a la API de Posts y Comentarios con Cloudflare D1!",
            version: env.API_VERSION || "1.0.0",
            estadisticas: {
              posts: postsCount.count,
              comentarios: comentariosCount.count
            },
            baseDatos: "Cloudflare D1 (SQLite sin servidor)",
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
          return createErrorResponse(error, "Error al obtener información de la API");
        }
      }

      // ========== RUTAS PARA POSTS ==========

      // GET /posts - Obtener todos los posts
      if (pathname === '/posts' && method === 'GET') {
        try {
          const { results } = await db.prepare('SELECT * FROM posts ORDER BY fechaCreacion DESC').all();
          return createResponse({
            mensaje: "Lista de todos los posts",
            total: results.length,
            posts: results
          });
        } catch (error) {
          return createErrorResponse(error, "Error al obtener posts");
        }
      }

      // GET /posts/:id - Obtener un post específico
      if (pathname.match(/^\/posts\/\d+$/) && method === 'GET') {
        try {
          const id = parseInt(pathname.split('/')[2]);
          const post = await db.prepare('SELECT * FROM posts WHERE id = ?').bind(id).first();
          
          if (!post) {
            return createResponse({
              error: "Post no encontrado",
              mensaje: `No existe un post con ID ${id}`
            }, 404);
          }
          
          return createResponse({
            mensaje: "Post encontrado",
            post: post
          });
        } catch (error) {
          return createErrorResponse(error, "Error al obtener el post");
        }
      }

      // POST /posts - Crear un nuevo post
      if (pathname === '/posts' && method === 'POST') {
        try {
          const body = await request.json();
          const { titulo, contenido, autor } = body;
          
          if (!titulo || !contenido || !autor) {
            return createResponse({
              error: "Datos incompletos",
              mensaje: "Los campos titulo, contenido y autor son obligatorios"
            }, 400);
          }
          
          const result = await db.prepare(`
            INSERT INTO posts (titulo, contenido, autor) 
            VALUES (?, ?, ?)
          `).bind(titulo, contenido, autor).run();
          
          const nuevoPost = await db.prepare('SELECT * FROM posts WHERE id = ?').bind(result.meta.last_row_id).first();
          
          return createResponse({
            mensaje: "Post creado exitosamente",
            post: nuevoPost
          }, 201);
        } catch (error) {
          return createErrorResponse(error, "Error al crear el post");
        }
      }

      // PUT /posts/:id - Actualizar un post completo
      if (pathname.match(/^\/posts\/\d+$/) && method === 'PUT') {
        try {
          const id = parseInt(pathname.split('/')[2]);
          const body = await request.json();
          const { titulo, contenido, autor } = body;
          
          if (!titulo || !contenido || !autor) {
            return createResponse({
              error: "Datos incompletos",
              mensaje: "Los campos titulo, contenido y autor son obligatorios"
            }, 400);
          }
          
          const result = await db.prepare(`
            UPDATE posts 
            SET titulo = ?, contenido = ?, autor = ?, fechaActualizacion = date('now')
            WHERE id = ?
          `).bind(titulo, contenido, autor, id).run();
          
          if (result.changes === 0) {
            return createResponse({
              error: "Post no encontrado",
              mensaje: `No existe un post con ID ${id}`
            }, 404);
          }
          
          const postActualizado = await db.prepare('SELECT * FROM posts WHERE id = ?').bind(id).first();
          
          return createResponse({
            mensaje: "Post actualizado exitosamente",
            post: postActualizado
          });
        } catch (error) {
          return createErrorResponse(error, "Error al actualizar el post");
        }
      }

      // PATCH /posts/:id - Actualizar parcialmente un post
      if (pathname.match(/^\/posts\/\d+$/) && method === 'PATCH') {
        try {
          const id = parseInt(pathname.split('/')[2]);
          const body = await request.json();
          
          if (Object.keys(body).length === 0) {
            return createResponse({
              error: "Datos vacíos",
              mensaje: "Debe proporcionar al menos un campo para actualizar"
            }, 400);
          }
          
          const fields = Object.keys(body);
          const setClause = fields.map(field => `${field} = ?`).join(', ');
          const values = Object.values(body);
          
          const result = await db.prepare(`
            UPDATE posts 
            SET ${setClause}, fechaActualizacion = date('now')
            WHERE id = ?
          `).bind(...values, id).run();
          
          if (result.changes === 0) {
            return createResponse({
              error: "Post no encontrado",
              mensaje: `No existe un post con ID ${id}`
            }, 404);
          }
          
          const postActualizado = await db.prepare('SELECT * FROM posts WHERE id = ?').bind(id).first();
          
          return createResponse({
            mensaje: "Post actualizado parcialmente",
            post: postActualizado
          });
        } catch (error) {
          return createErrorResponse(error, "Error al actualizar parcialmente el post");
        }
      }

      // DELETE /posts/:id - Eliminar un post
      if (pathname.match(/^\/posts\/\d+$/) && method === 'DELETE') {
        try {
          const id = parseInt(pathname.split('/')[2]);
          
          // Obtener el post antes de eliminarlo
          const post = await db.prepare('SELECT * FROM posts WHERE id = ?').bind(id).first();
          if (!post) {
            return createResponse({
              error: "Post no encontrado",
              mensaje: `No existe un post con ID ${id}`
            }, 404);
          }
          
          const result = await db.prepare('DELETE FROM posts WHERE id = ?').bind(id).run();
          
          return createResponse({
            mensaje: "Post eliminado exitosamente",
            post: post
          });
        } catch (error) {
          return createErrorResponse(error, "Error al eliminar el post");
        }
      }

      // ========== RUTAS PARA COMENTARIOS ==========

      // GET /comentarios - Obtener todos los comentarios
      if (pathname === '/comentarios' && method === 'GET') {
        try {
          const urlParams = new URLSearchParams(url.search);
          const postId = urlParams.get('postId');
          
          let query, results;
          if (postId) {
            query = 'SELECT * FROM comentarios WHERE postId = ? ORDER BY fechaCreacion ASC';
            results = (await db.prepare(query).bind(parseInt(postId)).all()).results;
          } else {
            query = 'SELECT * FROM comentarios ORDER BY fechaCreacion DESC';
            results = (await db.prepare(query).all()).results;
          }
          
          return createResponse({
            mensaje: postId ? `Comentarios del post ${postId}` : "Todos los comentarios",
            total: results.length,
            comentarios: results
          });
        } catch (error) {
          return createErrorResponse(error, "Error al obtener comentarios");
        }
      }

      // GET /comentarios/:id - Obtener un comentario específico
      if (pathname.match(/^\/comentarios\/\d+$/) && method === 'GET') {
        try {
          const id = parseInt(pathname.split('/')[2]);
          const comentario = await db.prepare('SELECT * FROM comentarios WHERE id = ?').bind(id).first();
          
          if (!comentario) {
            return createResponse({
              error: "Comentario no encontrado",
              mensaje: `No existe un comentario con ID ${id}`
            }, 404);
          }
          
          return createResponse({
            mensaje: "Comentario encontrado",
            comentario: comentario
          });
        } catch (error) {
          return createErrorResponse(error, "Error al obtener el comentario");
        }
      }

      // POST /comentarios - Crear un nuevo comentario
      if (pathname === '/comentarios' && method === 'POST') {
        try {
          const body = await request.json();
          const { postId, texto, autor } = body;
          
          if (!postId || !texto || !autor) {
            return createResponse({
              error: "Datos incompletos",
              mensaje: "Los campos postId, texto y autor son obligatorios"
            }, 400);
          }
          
          // Verificar que el post existe
          const post = await db.prepare('SELECT * FROM posts WHERE id = ?').bind(parseInt(postId)).first();
          if (!post) {
            return createResponse({
              error: "Post no existe",
              mensaje: `No existe un post con ID ${postId}`
            }, 400);
          }
          
          const result = await db.prepare(`
            INSERT INTO comentarios (postId, texto, autor) 
            VALUES (?, ?, ?)
          `).bind(parseInt(postId), texto, autor).run();
          
          const nuevoComentario = await db.prepare('SELECT * FROM comentarios WHERE id = ?').bind(result.meta.last_row_id).first();
          
          return createResponse({
            mensaje: "Comentario creado exitosamente",
            comentario: nuevoComentario
          }, 201);
        } catch (error) {
          return createErrorResponse(error, "Error al crear el comentario");
        }
      }

      // PUT /comentarios/:id - Actualizar un comentario completo
      if (pathname.match(/^\/comentarios\/\d+$/) && method === 'PUT') {
        try {
          const id = parseInt(pathname.split('/')[2]);
          const body = await request.json();
          const { texto, autor } = body;
          
          if (!texto || !autor) {
            return createResponse({
              error: "Datos incompletos",
              mensaje: "Los campos texto y autor son obligatorios"
            }, 400);
          }
          
          const result = await db.prepare(`
            UPDATE comentarios 
            SET texto = ?, autor = ?, fechaActualizacion = date('now')
            WHERE id = ?
          `).bind(texto, autor, id).run();
          
          if (result.changes === 0) {
            return createResponse({
              error: "Comentario no encontrado",
              mensaje: `No existe un comentario con ID ${id}`
            }, 404);
          }
          
          const comentarioActualizado = await db.prepare('SELECT * FROM comentarios WHERE id = ?').bind(id).first();
          
          return createResponse({
            mensaje: "Comentario actualizado exitosamente",
            comentario: comentarioActualizado
          });
        } catch (error) {
          return createErrorResponse(error, "Error al actualizar el comentario");
        }
      }

      // PATCH /comentarios/:id - Actualizar parcialmente un comentario
      if (pathname.match(/^\/comentarios\/\d+$/) && method === 'PATCH') {
        try {
          const id = parseInt(pathname.split('/')[2]);
          const body = await request.json();
          
          if (Object.keys(body).length === 0) {
            return createResponse({
              error: "Datos vacíos",
              mensaje: "Debe proporcionar al menos un campo para actualizar"
            }, 400);
          }
          
          const fields = Object.keys(body);
          const setClause = fields.map(field => `${field} = ?`).join(', ');
          const values = Object.values(body);
          
          const result = await db.prepare(`
            UPDATE comentarios 
            SET ${setClause}, fechaActualizacion = date('now')
            WHERE id = ?
          `).bind(...values, id).run();
          
          if (result.changes === 0) {
            return createResponse({
              error: "Comentario no encontrado",
              mensaje: `No existe un comentario con ID ${id}`
            }, 404);
          }
          
          const comentarioActualizado = await db.prepare('SELECT * FROM comentarios WHERE id = ?').bind(id).first();
          
          return createResponse({
            mensaje: "Comentario actualizado parcialmente",
            comentario: comentarioActualizado
          });
        } catch (error) {
          return createErrorResponse(error, "Error al actualizar parcialmente el comentario");
        }
      }

      // DELETE /comentarios/:id - Eliminar un comentario
      if (pathname.match(/^\/comentarios\/\d+$/) && method === 'DELETE') {
        try {
          const id = parseInt(pathname.split('/')[2]);
          
          const comentario = await db.prepare('SELECT * FROM comentarios WHERE id = ?').bind(id).first();
          if (!comentario) {
            return createResponse({
              error: "Comentario no encontrado",
              mensaje: `No existe un comentario con ID ${id}`
            }, 404);
          }
          
          const result = await db.prepare('DELETE FROM comentarios WHERE id = ?').bind(id).run();
          
          return createResponse({
            mensaje: "Comentario eliminado exitosamente",
            comentario: comentario
          });
        } catch (error) {
          return createErrorResponse(error, "Error al eliminar el comentario");
        }
      }

      // HEAD /posts - Información de headers sin el body
      if (pathname === '/posts' && method === 'HEAD') {
        try {
          const postsCount = await db.prepare('SELECT COUNT(*) as count FROM posts').first();
          return new Response(null, {
            status: 200,
            headers: {
              'X-Total-Posts': postsCount.count.toString(),
              'X-API-Version': env.API_VERSION || '1.0.0',
              'X-Database-Type': 'Cloudflare-D1',
              ...corsHeaders
            }
          });
        } catch (error) {
          return new Response(null, { status: 500, headers: corsHeaders });
        }
      }

      // HEAD /comentarios - Información de headers sin el body
      if (pathname === '/comentarios' && method === 'HEAD') {
        try {
          const comentariosCount = await db.prepare('SELECT COUNT(*) as count FROM comentarios').first();
          return new Response(null, {
            status: 200,
            headers: {
              'X-Total-Comentarios': comentariosCount.count.toString(),
              'X-API-Version': env.API_VERSION || '1.0.0',
              'X-Database-Type': 'Cloudflare-D1',
              ...corsHeaders
            }
          });
        } catch (error) {
          return new Response(null, { status: 500, headers: corsHeaders });
        }
      }

      // Ruta no encontrada
      return createResponse({
        error: "Endpoint no encontrado",
        mensaje: `La ruta ${method} ${pathname} no existe`,
        sugerencia: "Visita GET / para ver todos los endpoints disponibles"
      }, 404);

    } catch (error) {
      console.error('Error general del worker:', error);
      return new Response(JSON.stringify({
        error: "Error interno del servidor",
        mensaje: "Ha ocurrido un error inesperado"
      }), {
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
  }
}; 