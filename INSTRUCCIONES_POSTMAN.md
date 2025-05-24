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
La colección ya incluye una variable `{{base_url}}` configurada para `http://localhost:3000`. No necesitas hacer nada más.

### Método Manual (Opcional)
Si quieres crear tu propio entorno:
1. Haz clic en el ícono de engranaje ⚙️ (Manage Environments)
2. Haz clic en **"Add"**
3. Nombra el entorno: "API Playground Local"
4. Agrega una variable:
   - **Variable**: `base_url`
   - **Initial Value**: `http://localhost:3000`
   - **Current Value**: `http://localhost:3000`
5. Haz clic en **"Add"**
6. Selecciona el entorno en el dropdown superior derecho

## Paso 4: Iniciar la API
Antes de usar Postman, asegúrate de que la API esté ejecutándose:

```bash
npm start
```

Deberías ver el mensaje:
```
🚀 Servidor ejecutándose en http://localhost:3000
```

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

### 🧪 Casos de Prueba
- Peticiones para probar casos de error (404, 400, etc.)

### 🔧 Métodos Especiales
- **OPTIONS** para ver métodos permitidos

## Paso 6: Ejecutar las peticiones

1. **Prueba básica**: Comienza con "📋 Información de la API"
2. **CRUD de Posts**: Prueba crear, leer, actualizar y eliminar posts
3. **CRUD de Comentarios**: Haz lo mismo con los comentarios
4. **Casos de error**: Prueba los casos de prueba para ver diferentes códigos de estado
5. **Métodos especiales**: Experimenta con HEAD y OPTIONS

## 🎯 Consejos de Uso

### Para principiantes:
1. Empieza siempre con GET para ver los datos existentes
2. Luego prueba POST para crear nuevos datos
3. Después experimenta con PUT y PATCH para actualizar
4. Finalmente prueba DELETE

### Para usuarios avanzados:
1. Fíjate en los códigos de estado HTTP en cada respuesta
2. Observa los headers de respuesta
3. Experimenta modificando los datos del body
4. Prueba diferentes combinaciones de datos válidos e inválidos

### Variables útiles en Postman:
- Usa `{{base_url}}` en lugar de escribir `http://localhost:3000` cada vez
- Puedes crear variables para IDs de posts o comentarios que uses frecuentemente

## ❓ Solución de Problemas

### Si no puedes conectarte:
1. Verifica que la API esté ejecutándose (`npm start`)
2. Asegúrate de que la URL sea `http://localhost:3000`
3. Revisa que no haya otros programas usando el puerto 3000

### Si obtienes errores 400:
1. Verifica que el header `Content-Type: application/json` esté presente
2. Asegúrate de que el JSON del body sea válido
3. Revisa que incluyas todos los campos obligatorios

### Si obtienes errores 404:
1. Verifica que el endpoint exista
2. Comprueba que el ID del recurso existe
3. Asegúrate de que la URL esté bien escrita

¡Listo para practicar! 🎉 