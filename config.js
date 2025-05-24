require('dotenv').config();

const config = {
  // Configuración del servidor
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Configuración de la base de datos
  DATABASE: {
    NAME: process.env.DATABASE_NAME || 'api_playground_db',
    PATH: process.env.DATABASE_PATH || './data/database.db',
    URL: process.env.DATABASE_URL || 'http://localhost:8787'
  },
  
  // Configuración de Cloudflare
  CLOUDFLARE: {
    API_TOKEN: process.env.CLOUDFLARE_API_TOKEN || '',
    ACCOUNT_ID: process.env.CLOUDFLARE_ACCOUNT_ID || ''
  },
  
  // Configuración de la API
  API: {
    VERSION: process.env.API_VERSION || '1.0.0',
    MAX_POSTS_PER_PAGE: parseInt(process.env.MAX_POSTS_PER_PAGE) || 50,
    MAX_COMMENTS_PER_PAGE: parseInt(process.env.MAX_COMMENTS_PER_PAGE) || 100
  }
};

module.exports = config; 