# 🌐 Guía de Despliegue en Cloudflare Workers con D1

Esta guía te ayudará a desplegar tu API en Cloudflare Workers usando Cloudflare D1 como base de datos.

✅ **¡Actualizada!**: Ahora incluye una versión completamente optimizada para Workers (`worker.js`) que usa bindings D1 nativos.

## 📋 Versiones Disponibles

### 🖥️ **Versión Local (`server.js`)**
- ✅ Express.js + SQLite con better-sqlite3
- ✅ Perfecto para desarrollo y aprendizaje
- ✅ Comando: `npm start` o `npm run dev`

### ☁️ **Versión Workers (`worker.js`)**
- ✅ Optimizada para Cloudflare Workers
- ✅ Usa bindings D1 nativos (sin better-sqlite3)
- ✅ Sin dependencias de Node.js
- ✅ Máximo rendimiento y escalabilidad
- ✅ Comando: `wrangler publish`

## 📋 Prerrequisitos

1. **Cuenta de Cloudflare**: Necesitas una cuenta gratuita en [Cloudflare](https://cloudflare.com)
2. **Node.js**: Versión 16 o superior
3. **Wrangler CLI**: Herramienta de línea de comandos de Cloudflare

## 🚀 Paso a Paso

### 1. Instalar Wrangler CLI

```bash
# Instalar globalmente
npm install -g wrangler

# Verificar instalación
wrangler --version
```

### 2. Autenticarse con Cloudflare

```bash
# Esto abrirá tu navegador para autenticarte
wrangler auth

# Verificar autenticación
wrangler whoami
```

### 3. Crear Base de Datos D1

```bash
# Crear la base de datos
wrangler d1 create api-playground
```

**⚠️ Importante**: Guarda el output de este comando, especialmente el `database_id`. Lo necesitarás en el siguiente paso.

Ejemplo de output:
```
[[d1_databases]]
binding = "DB"
database_name = "api-playground"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

### 4. Configurar wrangler.toml

El archivo `wrangler.toml` ya está configurado para la versión optimizada. Solo actualiza el `database_id`:

```toml
name = "api-playground"
main = "worker.js"
compatibility_date = "2024-09-23"

[[d1_databases]]
binding = "DB"
database_name = "api-playground"
database_id = "TU_DATABASE_ID_AQUI"  # ← Reemplaza esto

[env.production.vars]
NODE_ENV = "production"
API_VERSION = "1.0.0"
MAX_POSTS_PER_PAGE = "50"
MAX_COMMENTS_PER_PAGE = "100"
```

### 5. Ejecutar Schema en D1

```bash
# Aplicar el schema a la base de datos D1
wrangler d1 execute api-playground --file=./schema.sql

# Verificar que se crearon las tablas
wrangler d1 execute api-playground --command="SELECT name FROM sqlite_master WHERE type='table';"
```

### 6. Desarrollo Local con D1

Para probar localmente con D1:

```bash
# Ejecutar en modo local con persistencia
wrangler dev --local --persist

# O ejecutar contra D1 remoto
wrangler dev --remote
```

### 7. Desplegar a Cloudflare Workers

```bash
# Desplegar a producción
wrangler publish

# O desplegar a staging
wrangler publish --env staging
```

✅ **¡Listo!** Tu API estará disponible en `https://api-playground.tu-subdominio.workers.dev`

## 🎯 Características de la Versión Workers

### ✅ **Optimizaciones Nativas**

- **Sin Express**: Usa la API nativa de Workers para máximo rendimiento
- **Bindings D1**: Acceso directo a la base de datos sin drivers
- **Sin Node.js**: No requiere `nodejs_compat`
- **CORS incluido**: Headers configurados automáticamente
- **Error handling**: Manejo robusto de errores en español

### 🛠️ **Funcionalidades Completas**

Todos los endpoints funcionan igual que en la versión local:

```javascript
// Ejemplos de uso de bindings D1
const posts = await db.prepare('SELECT * FROM posts').all();
const post = await db.prepare('SELECT * FROM posts WHERE id = ?').bind(id).first();
const result = await db.prepare('INSERT INTO posts (titulo, contenido, autor) VALUES (?, ?, ?)').bind(titulo, contenido, autor).run();
```

### 📊 **Headers Informativos**

```bash
# La API incluye headers útiles
X-Total-Posts: 5
X-Total-Comentarios: 12
X-API-Version: 1.0.0
X-Database-Type: Cloudflare-D1
```

## 🔧 Comandos Útiles

### Gestión de Base de Datos

```bash
# Ejecutar consultas directas
wrangler d1 execute api-playground --command="SELECT COUNT(*) FROM posts;"

# Poblar con datos de ejemplo
wrangler d1 execute api-playground --file=./scripts/seed.sql

# Obtener información de la base de datos
wrangler d1 info api-playground

# Backup de la base de datos
wrangler d1 export api-playground --output=backup.sql

# Restaurar desde backup
wrangler d1 execute api-playground --file=backup.sql
```

### Logs y Debugging

```bash
# Ver logs en tiempo real
wrangler tail

# Ver logs con filtros
wrangler tail --format=pretty

# Logs específicos de errores
wrangler tail --status=error
```

## 📊 Verificación del Despliegue

Una vez desplegado, puedes verificar que todo funciona:

```bash
# Obtener la URL de tu Worker
wrangler whoami

# Probar la API (reemplaza con tu URL)
curl https://api-playground.tu-subdominio.workers.dev/
curl https://api-playground.tu-subdominio.workers.dev/posts
curl https://api-playground.tu-subdominio.workers.dev/comentarios

# Crear un post de prueba
curl -X POST https://api-playground.tu-subdominio.workers.dev/posts \
  -H "Content-Type: application/json" \
  -d '{"titulo":"Post desde Workers","contenido":"¡Funciona perfectamente!","autor":"Developer"}'
```

## 🔐 Variables de Entorno

Para configurar variables de entorno en producción:

```bash
# Establecer variables
wrangler secret put API_KEY
wrangler secret put ADMIN_PASSWORD

# Listar variables
wrangler secret list

# Variables públicas (en wrangler.toml)
[env.production.vars]
NODE_ENV = "production"
API_VERSION = "1.0.0"
```

## 📝 Comparación de Versiones

| Característica | Local (server.js) | Workers (worker.js) |
|---------------|-------------------|---------------------|
| **Base de datos** | SQLite + better-sqlite3 | D1 bindings |
| **Servidor** | Express.js | Workers Runtime |
| **Desarrollo** | `npm run dev` | `wrangler dev` |
| **Despliegue** | VPS/Servidor | `wrangler publish` |
| **Escalabilidad** | Manual | Automática |
| **Cold start** | ~500ms | ~5ms |
| **Red global** | ❌ | ✅ (200+ ubicaciones) |
| **Límites** | Hardware del servidor | Plan gratuito generoso |
| **Debugging** | ✅ Completo | ✅ Logs remotos |
| **Dependencies** | Node.js ecosystem | Solo Web APIs |

## 🆘 Solución de Problemas

### ❌ **Error anterior: "The package 'path' wasn't found"**
✅ **Solucionado**: La nueva versión `worker.js` no usa módulos Node.js

### ❌ **Error: "Database not found"**
```bash
# Verificar que la base de datos existe
wrangler d1 list

# Recrear si es necesario
wrangler d1 create api-playground
```

### ❌ **Error: "Binding not found"**
- Verifica que `wrangler.toml` tenga el `database_id` correcto
- Asegúrate de que el nombre del binding sea "DB"

### ❌ **Error con better-sqlite3 (versión antigua)**
✅ **Solucionado**: La versión `worker.js` usa bindings D1 nativos

### ❌ **Error de permisos**
```bash
# Reautenticarse
wrangler auth
```

### ❌ **Error: "Module not found"**
✅ **Solucionado**: La versión optimizada no requiere módulos externos

## 🎯 Migración de Local a Workers

Si ya tienes datos en la versión local:

1. **Exportar datos locales**:
```bash
# Desde la versión local
npm run db:export > local-data.sql
```

2. **Importar a D1**:
```bash
# A la base de datos D1
wrangler d1 execute api-playground --file=local-data.sql
```

3. **Verificar migración**:
```bash
# Comprobar que los datos están en D1
wrangler d1 execute api-playground --command="SELECT COUNT(*) FROM posts;"
```

## 🔄 Flujo de Desarrollo Recomendado

### 🎓 **Para Estudiantes**
1. **Aprender localmente**: Usa `server.js` con `npm run dev`
2. **Experimentar**: Prueba todos los endpoints con Postman
3. **Desplegar**: Sube a Workers con `worker.js` cuando esté listo

### 👨‍💻 **Para Desarrolladores**
1. **Desarrollo**: Versión local para debugging rápido
2. **Testing**: Versión Workers para pruebas de producción
3. **Producción**: Workers para máximo rendimiento

## 📈 Límites y Rendimiento

### 🆓 **Plan Gratuito de Cloudflare**
- **Workers**: 100,000 requests/día
- **D1**: 100,000 lecturas/día, 100,000 escrituras/día
- **Storage**: Hasta 5GB por base de datos
- **CPU time**: 10ms por request

### ⚡ **Rendimiento**
- **Cold start**: ~5ms (vs ~500ms local)
- **Latencia**: <100ms globalmente
- **Throughput**: Miles de requests concurrentes
- **Disponibilidad**: 99.9%+ SLA

## 🌍 **Ventajas de la Versión Workers**

### ✅ **Técnicas**
- Sin servidores que mantener
- Escalado automático
- Red de distribución global
- Cold start ultra rápido
- APIs nativas del navegador

### ✅ **Económicas**
- Plan gratuito muy generoso
- Pay-per-use en planes pagos
- Sin costos de infraestructura
- Sin tiempo de inactividad

### ✅ **Educativas**
- Aprende tecnologías modernas
- Entiende arquitecturas serverless
- Experimenta con edge computing
- Desarrolla para la web moderna

¡Tu API ahora está completamente optimizada para Cloudflare Workers! 🚀🌍 