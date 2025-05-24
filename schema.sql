-- Schema para Cloudflare D1
-- Este archivo contiene la estructura de las tablas para la API de Posts y Comentarios

-- Eliminar tablas si existen (para recrearlas)
DROP TABLE IF EXISTS comentarios;
DROP TABLE IF EXISTS posts;

-- Crear tabla posts
CREATE TABLE posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    contenido TEXT NOT NULL,
    autor TEXT NOT NULL,
    fechaCreacion DATE DEFAULT (date('now')),
    fechaActualizacion DATE DEFAULT (date('now'))
);

-- Crear tabla comentarios
CREATE TABLE comentarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    postId INTEGER NOT NULL,
    texto TEXT NOT NULL,
    autor TEXT NOT NULL,
    fechaCreacion DATE DEFAULT (date('now')),
    fechaActualizacion DATE DEFAULT (date('now')),
    FOREIGN KEY (postId) REFERENCES posts (id) ON DELETE CASCADE
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX idx_posts_fechaCreacion ON posts(fechaCreacion);
CREATE INDEX idx_comentarios_postId ON comentarios(postId);
CREATE INDEX idx_comentarios_fechaCreacion ON comentarios(fechaCreacion);

-- Trigger para actualizar fechaActualizacion en posts
CREATE TRIGGER trigger_posts_updated_at
    AFTER UPDATE ON posts
    BEGIN
        UPDATE posts SET fechaActualizacion = date('now') WHERE id = NEW.id;
    END;

-- Trigger para actualizar fechaActualizacion en comentarios
CREATE TRIGGER trigger_comentarios_updated_at
    AFTER UPDATE ON comentarios
    BEGIN
        UPDATE comentarios SET fechaActualizacion = date('now') WHERE id = NEW.id;
    END;

-- Insertar datos de ejemplo
INSERT INTO posts (titulo, contenido, autor, fechaCreacion) VALUES
('Mi primer post', 'Este es el contenido de mi primer post', 'Juan Pérez', '2024-01-15'),
('Aprendiendo APIs', 'Hoy estoy aprendiendo sobre APIs REST', 'María García', '2024-01-16'),
('Introducción a Cloudflare D1', 'Cloudflare D1 es una base de datos SQLite sin servidor que permite escalar aplicaciones globalmente', 'Ana Rodríguez', '2024-01-17');

-- Insertar comentarios de ejemplo
INSERT INTO comentarios (postId, texto, autor, fechaCreacion) VALUES
(1, '¡Excelente post!', 'Ana López', '2024-01-15'),
(1, 'Muy útil, gracias por compartir', 'Carlos Ruiz', '2024-01-16'),
(2, 'Yo también estoy aprendiendo APIs', 'Laura Martín', '2024-01-16'),
(2, '¿Tienes algún tutorial recomendado?', 'Pedro Sánchez', '2024-01-17'),
(3, 'Cloudflare D1 parece muy prometedor', 'Isabel Torres', '2024-01-17'); 