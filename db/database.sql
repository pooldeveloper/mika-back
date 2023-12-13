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
    orden INT NOT NULL
);

DESCRIBE cursos;

CREATE TABLE temas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    universidad_id VARCHAR(255) NOT NULL,
    curso_id VARCHAR(255) NOT NULL,
    nombre_id VARCHAR(255) NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    orden INT NOT NULL
);

DESCRIBE temas;

CREATE TABLE preguntas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    universidad_id VARCHAR(255) NOT NULL,
    curso_id VARCHAR(255) NOT NULL,
    tema_id VARCHAR(255) NOT NULL,
    pregunta_img VARCHAR(255),
    solucion_img VARCHAR(255),
    año VARCHAR(255) NOT NULL,
    clave VARCHAR(255) NOT NULL,
    orden INT NOT NULL,
    numero INT NOT NULL,
    pregunta_texto LONGTEXT,
    solucion_texto LONGTEXT,
    clave_a VARCHAR(255),
    clave_b VARCHAR(255),
    clave_c VARCHAR(255),
    clave_d VARCHAR(255),
    clave_e VARCHAR(255)
);

DESCRIBE preguntas;

CREATE TABLE examenes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    universidad_id VARCHAR(255) NOT NULL,
	año VARCHAR(255) NOT NULL,
    instrucciones LONGTEXT NOT NULL,
    minutos int NOT NULL
);

DESCRIBE examenes;

