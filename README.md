# API Playground - Curso de APIs HTTP con Cloudflare D1

Una API simple desarrollada con Node.js y Express para aprender y practicar todos los métodos HTTP usando herramientas como Postman. **Disponible en dos versiones**:

- **`server.js`**: Para desarrollo local con Express y SQLite
- **`worker.js`**: Optimizada para Cloudflare Workers con bindings D1 nativos

## 🚀 Instalación y Configuración

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar la base de datos local
```bash
# Inicializar la base de datos SQLite
npm run db:init

# Poblar con datos de ejemplo
npm run db:seed

# (Opcional) Resetear completamente la base de datos
npm run db:reset
```

### 3. Configurar variables de entorno
Las variables por defecto están en `config.js`:
- `PORT`: Puerto del servidor (por defecto 3000)
- `DATABASE_PATH`: Ruta del archivo SQLite (por defecto `./data/database.db`)
- `API_VERSION`: Versión de la API

### 4. Ejecutar el servidor (Desarrollo Local)
```bash
# Modo normal
npm start

# Modo desarrollo (con nodemon)
npm run dev
```

El servidor se ejecutará en `http://localhost:3000`

## 🌐 Despliegue en Cloudflare Workers

### Preparación para Cloudflare D1

1. **Instalar Wrangler CLI**:
```bash
npm install -g wrangler
```

2. **Autenticarse con Cloudflare**:
```bash
wrangler auth
```

3. **Crear base de datos D1**:
```bash
wrangler d1 create api-playground
```

4. **Actualizar `wrangler.toml`** con el ID de la base de datos.

5. **Ejecutar el schema en D1**:
```bash
wrangler d1 execute api-playground --file=./schema.sql
```

6. **Desplegar la aplicación**:
```bash
wrangler publish
```

### Desarrollo local con D1

Para probar el worker localmente:
```bash
wrangler dev --local --persist
```

## 📚 Versiones Disponibles

### 🖥️ **Versión Local (`server.js`)**
- ✅ Express.js + SQLite con better-sqlite3
- ✅ Perfecto para desarrollo y aprendizaje
- ✅ Todas las funciones de Node.js disponibles
- ✅ Fácil debugging y desarrollo

### ☁️ **Versión Workers (`worker.js`)**
- ✅ Optimizada para Cloudflare Workers
- ✅ Usa bindings D1 nativos
- ✅ Sin dependencias de Node.js
- ✅ Máximo rendimiento y escalabilidad
- ✅ Disponible globalmente en segundos

La API maneja dos recursos principales con persistencia en **SQLite/D1**:
- **Posts**: Artículos o publicaciones
- **Comentarios**: Comentarios asociados a los posts

### Nuevas características de la base de datos:
- **Persistencia**: Los datos se mantienen entre reinicios
- **Relaciones**: Los comentarios están vinculados a posts con claves foráneas
- **Triggers**: Actualización automática de fechas de modificación
- **Índices**: Optimización de consultas por fecha y relaciones
- **Transacciones**: Operaciones atómicas para consistencia de datos

## 🛠 Métodos HTTP Disponibles

Ambas versiones implementan exactamente los mismos endpoints:

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

Los ejemplos funcionan igual para ambas versiones. Para la versión de Workers, solo cambia la URL base.

### Local: `http://localhost:3000`
### Workers: `https://api-playground.tu-subdominio.workers.dev`

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

### Ejercicio 5: Base de Datos (Nuevo)
1. Crea varios posts y comentarios
2. Reinicia el servidor y verifica que los datos persisten
3. Usa el filtro de comentarios por postId
4. Prueba eliminar un post y observa que sus comentarios también se eliminan

### Ejercicio 6: Comparar Versiones
1. Prueba la misma funcionalidad en ambas versiones (local y Workers)
2. Observa las diferencias en los headers de respuesta
3. Compara el rendimiento y tiempo de respuesta

## 🔧 Estructura de Datos

### Post
```json
{
  "id": 1,
  "titulo": "Título del post",
  "contenido": "Contenido del post",
  "autor": "Nombre del autor",
  "fechaCreacion": "2024-01-15",
  "fechaActualizacion": "2024-01-15"
}
```

### Comentario
```json
{
  "id": 1,
  "postId": 1,
  "texto": "Texto del comentario",
  "autor": "Nombre del autor",
  "fechaCreacion": "2024-01-15",
  "fechaActualizacion": "2024-01-15"
}
```

## 📊 Códigos de Estado HTTP

- **200**: OK - Operación exitosa
- **201**: Created - Recurso creado exitosamente
- **400**: Bad Request - Datos inválidos o incompletos
- **404**: Not Found - Recurso no encontrado
- **500**: Internal Server Error - Error del servidor

## 🗄️ Comandos de Base de Datos

```bash
# Inicializar base de datos (crear tablas, índices, triggers)
npm run db:init

# Poblar con datos de ejemplo
npm run db:seed

# Resetear completamente (eliminar y recrear)
npm run db:reset
```

## 🎓 Tips para Estudiantes

1. **Usa Postman Collections**: Crea una colección con todas las peticiones para reutilizarlas
2. **Presta atención a los headers**: Especialmente `Content-Type: application/json`
3. **Observa los códigos de estado**: Te indican si la operación fue exitosa o no
4. **Experimenta con diferentes datos**: Prueba casos válidos e inválidos
5. **Usa variables en Postman**: Para reutilizar URLs y datos comunes
6. **Explora la persistencia**: Los datos se mantienen entre reinicios del servidor
7. **Prueba las relaciones**: Eliminar un post elimina automáticamente sus comentarios
8. **Compara ambas versiones**: Local vs Workers para entender las diferencias

## 🌐 Acceso a la Documentación

Visita la URL base (local o Workers) para ver la documentación interactiva de la API con todos los endpoints disponibles y estadísticas de la base de datos.

## 🔄 Tecnologías Utilizadas

### Versión Local
- **Node.js**: Runtime de JavaScript
- **Express**: Framework web
- **SQLite**: Base de datos local con better-sqlite3

### Versión Workers
- **Cloudflare Workers**: Runtime serverless
- **Cloudflare D1**: Base de datos SQLite sin servidor
- **Web APIs**: APIs nativas del navegador/Workers

## 🚀 Ventajas de Cada Versión

### 🖥️ Desarrollo Local (server.js)
- ✅ Desarrollo rápido y fácil debugging
- ✅ Ecosistema completo de Node.js
- ✅ Ideal para aprendizaje y prototipado
- ✅ Sin límites de requests

### ☁️ Cloudflare Workers (worker.js)
- ✅ Escalabilidad automática
- ✅ Red global (200+ ubicaciones)
- ✅ Cold start ultra rápido
- ✅ Cero configuración de servidor
- ✅ Plan gratuito generoso

¡Feliz aprendizaje! 🎉 