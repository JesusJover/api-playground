# API Playground - Curso de APIs HTTP

Una API simple desarrollada con Node.js y Express para aprender y practicar todos los métodos HTTP usando herramientas como Postman.

## 🚀 Instalación y Ejecución

### 1. Instalar dependencias
```bash
npm install
```

### 2. Ejecutar el servidor
```bash
# Modo normal
npm start

# Modo desarrollo (con nodemon)
npm run dev
```

El servidor se ejecutará en `http://localhost:3000`

## 📚 Recursos Disponibles

La API maneja dos recursos principales:
- **Posts**: Artículos o publicaciones
- **Comentarios**: Comentarios asociados a los posts

## 🛠 Métodos HTTP Disponibles

### Posts

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/posts` | Obtener todos los posts |
| GET | `/posts/:id` | Obtener un post específico |
| POST | `/posts` | Crear un nuevo post |
| PUT | `/posts/:id` | Actualizar un post completo |
| PATCH | `/posts/:id` | Actualizar parcialmente un post |
| DELETE | `/posts/:id` | Eliminar un post |
| HEAD | `/posts` | Obtener solo headers |

### Comentarios

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/comentarios` | Obtener todos los comentarios |
| GET | `/comentarios?postId=X` | Obtener comentarios de un post específico |
| GET | `/comentarios/:id` | Obtener un comentario específico |
| POST | `/comentarios` | Crear un nuevo comentario |
| PUT | `/comentarios/:id` | Actualizar un comentario completo |
| PATCH | `/comentarios/:id` | Actualizar parcialmente un comentario |
| DELETE | `/comentarios/:id` | Eliminar un comentario |
| HEAD | `/comentarios` | Obtener solo headers |

## 📝 Ejemplos de Uso con Postman

### 1. GET - Obtener todos los posts
```
Método: GET
URL: http://localhost:3000/posts
Headers: (ninguno necesario)
```

### 2. GET - Obtener un post específico
```
Método: GET
URL: http://localhost:3000/posts/1
```

### 3. POST - Crear un nuevo post
```
Método: POST
URL: http://localhost:3000/posts
Headers: Content-Type: application/json
Body (JSON):
{
  "titulo": "Mi nuevo post",
  "contenido": "Este es el contenido de mi post",
  "autor": "Tu Nombre"
}
```

### 4. PUT - Actualizar un post completo
```
Método: PUT
URL: http://localhost:3000/posts/1
Headers: Content-Type: application/json
Body (JSON):
{
  "titulo": "Post actualizado",
  "contenido": "Contenido completamente nuevo",
  "autor": "Autor Actualizado"
}
```

### 5. PATCH - Actualizar parcialmente un post
```
Método: PATCH
URL: http://localhost:3000/posts/1
Headers: Content-Type: application/json
Body (JSON):
{
  "titulo": "Solo actualizo el título"
}
```

### 6. DELETE - Eliminar un post
```
Método: DELETE
URL: http://localhost:3000/posts/1
```

### 7. POST - Crear un comentario
```
Método: POST
URL: http://localhost:3000/comentarios
Headers: Content-Type: application/json
Body (JSON):
{
  "postId": 1,
  "texto": "¡Excelente post!",
  "autor": "Comentarista"
}
```

### 8. GET - Obtener comentarios de un post específico
```
Método: GET
URL: http://localhost:3000/comentarios?postId=1
```

### 9. HEAD - Obtener solo headers
```
Método: HEAD
URL: http://localhost:3000/posts
```

### 10. OPTIONS - Verificar métodos permitidos
```
Método: OPTIONS
URL: http://localhost:3000/posts
```

## 🎯 Ejercicios Prácticos

### Ejercicio 1: CRUD Básico de Posts
1. Obtén todos los posts existentes
2. Crea un nuevo post con tus datos
3. Actualiza el post que creaste
4. Elimina el post

### Ejercicio 2: Trabajando con Comentarios
1. Obtén todos los comentarios
2. Filtra comentarios de un post específico
3. Crea un comentario para un post existente
4. Actualiza parcialmente tu comentario
5. Elimina el comentario

### Ejercicio 3: Explorando Códigos de Estado
1. Intenta obtener un post que no existe (ID: 999)
2. Intenta crear un post sin datos obligatorios
3. Verifica las respuestas y códigos de estado HTTP

### Ejercicio 4: Métodos Avanzados
1. Usa HEAD para obtener información sin el body
2. Usa OPTIONS para ver qué métodos están permitidos
3. Experimenta con PATCH vs PUT

## 🔧 Estructura de Datos

### Post
```json
{
  "id": 1,
  "titulo": "Título del post",
  "contenido": "Contenido del post",
  "autor": "Nombre del autor",
  "fechaCreacion": "2024-01-15"
}
```

### Comentario
```json
{
  "id": 1,
  "postId": 1,
  "texto": "Texto del comentario",
  "autor": "Nombre del autor",
  "fechaCreacion": "2024-01-15"
}
```

## 📊 Códigos de Estado HTTP

- **200**: OK - Operación exitosa
- **201**: Created - Recurso creado exitosamente
- **400**: Bad Request - Datos inválidos o incompletos
- **404**: Not Found - Recurso no encontrado
- **500**: Internal Server Error - Error del servidor

## 🎓 Tips para Estudiantes

1. **Usa Postman Collections**: Crea una colección con todas las peticiones para reutilizarlas
2. **Presta atención a los headers**: Especialmente `Content-Type: application/json`
3. **Observa los códigos de estado**: Te indican si la operación fue exitosa o no
4. **Experimenta con diferentes datos**: Prueba casos válidos e inválidos
5. **Usa variables en Postman**: Para reutilizar URLs y datos comunes

## 🌐 Acceso a la Documentación

Visita `http://localhost:3000` para ver la documentación interactiva de la API con todos los endpoints disponibles.

¡Feliz aprendizaje! 🎉 