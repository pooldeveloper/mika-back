CREATE DATABASE IF NOT EXISTS mika_db;
use mika_db;

CREATE TABLE universidades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_id VARCHAR(255) NOT NULL,
    nombre VARCHAR(255) NOT NULL
);

DESCRIBE universidades;

CREATE TABLE cursos (
    id INT AUTO_INCREMENT PRIMARY KEY,
	nombre_id VARCHAR(255) NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    universidad_id VARCHAR(255) NOT NULL,
    orden INT
);

DESCRIBE cursos;

CREATE TABLE temas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    universidad_id VARCHAR(255) NOT NULL,
    curso_id VARCHAR(255) NOT NULL,
    nombre_id VARCHAR(255) NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    orden INT
);

DESCRIBE temas;

CREATE TABLE preguntas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    universidad_id VARCHAR(255) NOT NULL,
    curso_id VARCHAR(255) NOT NULL,
    tema_id VARCHAR(255) NOT NULL,
    pregunta_img VARCHAR(255) NOT NULL,
    solucion_img VARCHAR(255) NOT NULL,
    año VARCHAR(255) NOT NULL,
    clave VARCHAR(255) NOT NULL,
    orden INT
);

DESCRIBE preguntas;

CREATE TABLE examenes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    universidad_id VARCHAR(255) NOT NULL,
	año VARCHAR(255) NOT NULL,
    instrucciones VARCHAR(255) NOT NULL,
    minutos int NOT NULL
);

DESCRIBE examenes;

DELETE FROM cursos WHERE universidad_id = 'villareal';
SELECT * FROM preguntas;
