import { pool } from "../config/db.js"
import {uploadImage} from "../config/cloudinary.js"


export const obtenerUniversidades = async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM universidades')
    res.send(rows)
}

export const crearUniversidad = async (req, res) => {
    const { nombre_id, nombre } = req.body

    const [rows] = await pool.query('INSERT INTO universidades (nombre_id, nombre) VALUES (?, ?)', [nombre_id, nombre])

    res.send({
        id: rows.insertId,
        nombre_id,
        nombre
    })
}

export const obtenerCursos = async (req, res) => {
    const { id } = req.params

    const [rowsCursos] = await pool.query('SELECT * FROM cursos WHERE universidad_id = ?', [id])

    res.send(rowsCursos)
}

export const crearCursos = async (req, res) => {

    const { universidad_id, cursos } = req.body

    for (const curso of cursos) {
        const { nombre_id, nombre, orden } = curso

        await pool.query(
            'INSERT INTO cursos (nombre_id, nombre, universidad_id, orden) VALUES (?, ?, ?, ?)',
            [nombre_id, nombre, universidad_id, orden]
        );
    }

    res.send({ mensaje: 'Cursos creados exitosamente' })
}

export const crearTemas = async (req, res) => {

    const { universidad_id, curso_id, temas } = req.body

    for (const tema of temas) {
        const { nombre_id, nombre, orden } = tema

        await pool.query(
            'INSERT INTO temas (universidad_id, curso_id, nombre_id, nombre, orden) VALUES (?, ?, ?, ?, ?)',
            [universidad_id, curso_id, nombre_id, nombre, orden]
        );
    }

    res.send({ mensaje: 'Temas creados exitosamente' })
}

export const obtenerTemas = async (req, res) => {
    const { id, curso } = req.params

    const [rowsCursos] = await pool.query('SELECT * FROM cursos WHERE nombre_id = ?', [curso])

    const [rowsTemas] = await pool.query('SELECT * FROM temas WHERE universidad_id = ? AND curso_id = ?', [id, curso])

    res.send({
        curso_id: curso,
        nombre: rowsCursos[0].nombre,
        temas: rowsTemas
    })
}

export const crearPreguntas = async (req, res) => {

    const { universidad_id, curso_id, tema_id, anio, clave, orden, numero, pregunta_texto, solucion_texto, clave_a, clave_b, clave_c, clave_d, clave_e } = req.body

    let preguntaImg = ''
    let solucionImg = ''

    if(req.files){
        const preguntaImg = await uploadImage(req.files.pregunta_img.tempFilePath)

        const solucionImg = await uploadImage(req.files.solucion_img.tempFilePath)
    }

    await pool.query(
        'INSERT INTO preguntas (universidad_id, curso_id, tema_id, pregunta_img, solucion_img, año, clave, orden, numero, pregunta_texto, solucion_texto, clave_a, clave_b, clave_c, clave_d, clave_e ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [universidad_id, curso_id, tema_id, preguntaImg.url, solucionImg.url, anio, clave, orden, numero, pregunta_texto, solucion_texto, clave_a, clave_b, clave_c, clave_d, clave_e ]
    );

    res.send({mensaje: "Pregunta creada exitosamente"})
}

const funcionObtenerPreguntas = async (id, anio) => {
    const [rowsCursos] = await pool.query('SELECT * FROM cursos WHERE universidad_id = ?', [id])
    const [rowsPreguntas] = await pool.query('SELECT * FROM preguntas WHERE universidad_id = ? AND año = ?', [id, anio])

    // Ordenar cursos por su propiedad "orden"
    rowsCursos.sort((a, b) => a.orden - b.orden);

    // Ordenar preguntas por su propiedad "curso_id" y luego por "orden"
    rowsPreguntas.sort((a, b) => {
        if (a.curso_id === b.curso_id) {
            return a.orden - b.orden;
        }
        return rowsCursos.find((curso) => curso.nombre_id === a.curso_id).orden - rowsCursos.find((curso) => curso.nombre_id === b.curso_id).orden;
    });

    const preguntasFinal = [];

    // Iterar sobre los cursos
    for (const curso of rowsCursos) {
        const preguntasCurso = [];

        // Filtrar las preguntas relacionadas con el curso actual
        const preguntasFiltradas = rowsPreguntas.filter((pregunta) => pregunta.curso_id === curso.nombre_id);

        // Agregar las preguntas filtradas al array preguntasCurso
        for (const pregunta of preguntasFiltradas) {
            preguntasCurso.push(pregunta);
        }

        // Crear un objeto para el curso actual en arrayFinal
        const cursoObj = {
            "curso_id": curso.nombre_id,
            "nombre": curso.nombre,
            "preguntas": preguntasCurso
        };

        // Agregar el objeto del curso a arrayFinal
        preguntasFinal.push(cursoObj);
    }

    return preguntasFinal
}

export const obtenerPreguntas = async (req, res) => {
    const { id, anio } = req.params

    const preguntas = await funcionObtenerPreguntas(id, anio)

    res.send(preguntas)
}

export const enviarRespuestas = async (req, res) => {
    const { universidad_id, año, respuestas } = req.body

    const preguntas = await funcionObtenerPreguntas(universidad_id, año)

    // Función para comparar respuestas
    function compararRespuestas(preguntas, respuestas) {
        const estadisticas = {
            correctas: 0,
            incorrectas: 0,
            blanco: 0,
            puntaje: 0,
            solucionario: []
        };

        for (const curso of preguntas) {
            const cursoRespuestas = {
                curso_id: curso.curso_id,
                nombre: curso.nombre,
                preguntas: []
            };

            for (const pregunta of curso.preguntas) {
                const respuestaCorrespondiente = respuestas.find(respuesta => respuesta.id === pregunta.id);

                const claveEnviada = respuestaCorrespondiente ? respuestaCorrespondiente.clave : null;
                const claveCorrecta = pregunta.clave;

                let esCorrecta = null; // Inicialmente establecida como null

                if (claveEnviada === null || claveEnviada === "") {
                    esCorrecta = null; // Respuesta en blanco
                    estadisticas.blanco++;
                } else if (claveEnviada === claveCorrecta) {
                    esCorrecta = true; // Respuesta correcta
                    estadisticas.correctas++;
                } else {
                    esCorrecta = false; // Respuesta incorrecta
                    estadisticas.incorrectas++;
                }

                const preguntaRespuesta = {
                    id: pregunta.id,
                    pregunta_img: pregunta.pregunta_img,
                    solucion_img: pregunta.solucion_img,
                    clave_enviada: claveEnviada,
                    clave_correcta: claveCorrecta,
                    orden: pregunta.orden,
                    correcta: esCorrecta, // Asignar el valor calculado
                    numero: pregunta.numero,
                    clave_a: pregunta.clave_a,
                    clave_b: pregunta.clave_b,
                    clave_c: pregunta.clave_c,
                    clave_d: pregunta.clave_d,
                    clave_e: pregunta.clave_e,
                    pregunta_texto: pregunta.pregunta_texto,
                    solucion_texto: pregunta.solucion_texto,
                    tema_id: pregunta.tema_id
                };

                cursoRespuestas.preguntas.push(preguntaRespuesta);
            }
            estadisticas.solucionario.push(cursoRespuestas);
        }

        estadisticas.puntaje = (estadisticas.correctas * 10) - (estadisticas.incorrectas * 0.25219265)

        return estadisticas;
    }

    // Llamar a la función y mostrar resultados
    const resultado = compararRespuestas(preguntas, respuestas);

    res.send(resultado);
}

export const crearExamen = async (req, res) => {
    const { nombre, universidad_id, año, instrucciones, minutos } = req.body

    await pool.query('INSERT INTO examenes (nombre, universidad_id, año, instrucciones, minutos) VALUES (?, ?, ?, ?, ?)', [nombre, universidad_id, año, instrucciones, minutos])

    res.send({ mensaje: 'Examen creado exitosamente' })
}

export const obtenerExamen = async (req, res) => {
    const { id, anio} = req.params

    const [rowsExamen] = await pool.query('SELECT * FROM examenes WHERE universidad_id = ? AND año = ?', [id, anio])

    res.send(rowsExamen[0])
}

export const obtenerExamenes = async (req, res) => {
    const { id } = req.params

    const [rowUniversidad] = await pool.query('SELECT * FROM universidades WHERE nombre_id = ?', [id])
    
    const [rowsExamenes] = await pool.query('SELECT * FROM examenes WHERE universidad_id = ?', [id])

    res.send({
        id,
        nombre: rowUniversidad[0].nombre,
        examenes: rowsExamenes
    })
}
