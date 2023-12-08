CREATE DATABASE marketplace;
CREATE TABLE usuarios (id SERIAL PRIMARY KEY, nombre VARCHAR(255) NOT NULL, apellido VARCHAR(255) NOT NULL, correo VARCHAR(255) NOT NULL, contrasena TEXT NOT NULL, genero VARCHAR(255) NOT NULL);
CREATE TABLE productos (id SERIAL PRIMARY KEY, usuario_id INTEGER REFERENCES usuarios(id) , titulo VARCHAR(255) NOT NULL, descripcion TEXT NOT NULL, url_img TEXT NOT NULL, precio INTEGER NOT NULL, estado BOOLEAN NOT NULL);
CREATE TABLE mis_favoritos (id SERIAL PRIMARY KEY, usuario_id INTEGER REFERENCES usuarios(id), producto_id INTEGER REFERENCES productos(id)); 
/* Se debe crear un usuario desde el Back */

INSERT INTO productos (usuario_id, titulo, descripcion, url_img, precio, estado) VALUES (1, 'Control PS4 Inalámbrico','JOYSTICK DOUBLESHOCK 4 PARA PS4 WIRELESS CONTROL! El mejor precio a tu disposición, el nuevo joystick Doubleshock 4 es el ideal para ahorrar dinero brindando la misma calidad de los joysticks originales Sony.','https://images.unsplash.com/photo-1592840496694-26d035b52b48?q=80&w=1425&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',39990, true ), (2, 'Control PS4 ','JOYSTICK DOUBLESHOCK 4 PARA PS4 WIRELESS CONTROL! El mejor precio a tu disposición, el nuevo joystick Doubleshock 4 es el ideal para ahorrar dinero brindando la misma calidad de los joysticks originales Sony.','https://cdnx.jumpseller.com/gtigx1/image/23574748/resize/640/640?1657577463',49990, true )

INSERT INTO mis_favoritos (usuario_id, producto_id) VALUES (1,2),(2,1),(3,2),(3,1);
SELECT * FROM usuarios;