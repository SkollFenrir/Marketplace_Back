CREATE DATABASE marketplace;
CREATE TABLE usuarios (id SERIAL PRIMARY KEY, nombre VARCHAR(255) NOT NULL, apellido VARCHAR(255) NOT NULL, correo VARCHAR(255) NOT NULL, contrasena TEXT NOT NULL, genero VARCHAR(255) NOT NULL);
CREATE TABLE productos (id SERIAL PRIMARY KEY, usuario_id INTEGER REFERENCES usuarios(id) , titulo VARCHAR(255) NOT NULL, descripcion TEXT NOT NULL, url_img TEXT NOT NULL, precio INTEGER NOT NULL, estado BOOLEAN NOT NULL);
CREATE TABLE mis_favoritos (id SERIAL PRIMARY KEY, usuario_id INTEGER REFERENCES usuarios(id), producto_id INTEGER REFERENCES productos(id)); 

SELECT * FROM usuarios;