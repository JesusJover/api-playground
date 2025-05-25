# 📮 Cómo Importar la Colección de Postman

## Paso 1: Asegúrate de tener Postman instalado
Si no tienes Postman, descárgalo desde [https://www.postman.com/downloads/](https://www.postman.com/downloads/)

## Paso 2: Importar la colección

### Opción A: Importar desde archivo
1. Abre Postman
2. Haz clic en **"Import"** (botón en la esquina superior izquierda)
3. Arrastra el archivo `Postman_Collection.json` a la ventana
4. O haz clic en **"Upload Files"** y selecciona `Postman_Collection.json`
5. Haz clic en **"Import"**

### Opción B: Importar desde el código
1. Abre Postman
2. Haz clic en **"Import"**
3. Selecciona la pestaña **"Raw text"**
4. Copia todo el contenido del archivo `Postman_Collection.json`
5. Pégalo en el área de texto
6. Haz clic en **"Continue"** y luego **"Import"**

## Paso 3: Configurar el entorno

### Método Automático (Recomendado)
La colección ya incluye una variable `{{base_url}}` configurada para `https://api-playground.jesusjover.es`. No necesitas hacer nada más.

### Método Manual para desarrollo local (Opcional)
Si quieres usar la versión local:
1. Haz clic en el ícono de engranaje ⚙️ (Manage Environments)
2. Haz clic en **"Add"**
3. Nombra el entorno: "API Playground Local"
4. Agrega una variable:
   - **Variable**: `base_url`
   - **Initial Value**: `http://localhost:3000`
   - **Current Value**: `http://localhost:3000`
5. Haz clic en **"Add"**
6. Selecciona el entorno en el dropdown superior derecho

## Paso 4: ¡Ya está listo!
La colección está configurada para usar la API en producción (`https://api-playground.jesusjover.es`). 

Si quieres usar la versión local, primero asegúrate de que la API esté ejecutándose:

```bash
npm start
```

Y cambia la variable `base_url` según se explica en el paso anterior.

## Paso 5: Explorar la colección

Una vez importada, verás la colección "API Playground - Posts y Comentarios" con las siguientes carpetas:

### 📋 Información de la API
- Petición para obtener información general de la API

### 📝 Posts
- **GET** - Obtener todos los posts
- **GET** - Obtener post específico
- **POST** - Crear nuevo post
- **PUT** - Actualizar post completo
- **PATCH** - Actualizar post parcialmente
- **DELETE** - Eliminar post
- **HEAD** - Headers de posts

### 💬 Comentarios
- **GET** - Obtener todos los comentarios
- **GET** - Comentarios de un post específico
- **GET** - Obtener comentario específico
- **POST** - Crear nuevo comentario
- **PUT** - Actualizar comentario completo
- **PATCH** - Actualizar comentario parcialmente
- **DELETE** - Eliminar comentario
- **HEAD** - Headers de comentarios

### 🔍 Búsquedas
- **GET** - Buscar posts por autor
- **GET** - Buscar posts por contenido
- **GET** - Buscar posts por autor y contenido
- **GET** - Buscar comentarios por autor
- **GET** - Buscar comentarios por contenido
- **GET** - Buscar comentarios por autor y contenido
- **GET** - Búsqueda sin parámetros (error 400)

### 🚨 Testing
- **GET** - Simular error 500

### 🧪 Casos de Prueba
- Peticiones para probar casos de error (404, 400, etc.)

### 🔧 Métodos Especiales
- **OPTIONS** para ver métodos permitidos

## Paso 6: Ejecutar las peticiones

1. **Prueba básica**: Comienza con "📋 Información de la API"
2. **CRUD de Posts**: Prueba crear, leer, actualizar y eliminar posts
3. **CRUD de Comentarios**: Haz lo mismo con los comentarios
4. **Búsquedas**: Experimenta con los nuevos endpoints de búsqueda
5. **Testing**: Prueba el endpoint de error 500
6. **Casos de error**: Prueba los casos de prueba para ver diferentes códigos de estado
7. **Métodos especiales**: Experimenta con HEAD y OPTIONS

## 🎯 Consejos de Uso

### Para principiantes:
1. Empieza siempre con GET para ver los datos existentes
2. Luego prueba POST para crear nuevos datos
3. Después experimenta con PUT y PATCH para actualizar
4. Finalmente prueba DELETE
5. Prueba las búsquedas para encontrar contenido específico

### Para usuarios avanzados:
1. Fíjate en los códigos de estado HTTP en cada respuesta
2. Observa los headers de respuesta
3. Experimenta modificando los datos del body
4. Prueba diferentes combinaciones de datos válidos e inválidos
5. Combina parámetros de búsqueda (autor + contenido)
6. Usa el endpoint de error 500 para entender el manejo de errores

### Funcionalidades nuevas:
- **Búsquedas**: Usa `?autor=nombre` para buscar por autor, `?q=texto` para buscar por contenido
- **Combinaciones**: Puedes usar ambos parámetros: `?autor=Juan&q=tutorial`
- **Testing**: El endpoint `/error500` te ayuda a entender cómo se manejan los errores del servidor

### Variables útiles en Postman:
- Usa `{{base_url}}` en lugar de escribir la URL completa cada vez
- Puedes crear variables para IDs de posts o comentarios que uses frecuentemente
- Crea variables para términos de búsqueda que uses a menudo

## ❓ Solución de Problemas

### Si no puedes conectarte:
1. **Para la versión en producción**: Verifica tu conexión a internet
2. **Para la versión local**: Verifica que la API esté ejecutándose (`npm start`)
3. Asegúrate de estar usando la URL correcta en la variable `{{base_url}}`

### Si obtienes errores 400:
1. Verifica que el header `Content-Type: application/json` esté presente
2. Asegúrate de que el JSON del body sea válido
3. Revisa que incluyas todos los campos obligatorios
4. Para búsquedas: asegúrate de incluir al menos un parámetro (`autor` o `q`)

### Si obtienes errores 404:
1. Verifica que el endpoint exista
2. Comprueba que el ID del recurso existe
3. Asegúrate de que la URL esté bien escrita

### Si obtienes errores 500:
1. **Para testing**: Esto es esperado en el endpoint `/error500`
2. **Para otros endpoints**: Reporta el error, puede ser un problema del servidor

¡Listo para practicar con todas las nuevas funcionalidades! 🎉 