import { Router } from "express";
import {
    obtenerUniversidades, crearUniversidad, obtenerCursos, crearCursos,
    crearTemas, obtenerTemas, crearPreguntas, obtenerPreguntas, enviarRespuestas,
    crearExamen, obtenerExamen, obtenerExamenes
} from "../controllers/universidades.controllers.js";

const router = Router();

router.get("/universidades", obtenerUniversidades)
router.get("/cursos/:id", obtenerCursos)
router.get("/temas/:id/:curso", obtenerTemas)
router.get("/preguntas/:id/:anio", obtenerPreguntas)
router.get("/examen/:id/:anio", obtenerExamen)
router.get("/examenes/:id", obtenerExamenes)



router.post("/crear-universidad", crearUniversidad)
router.post("/crear-cursos", crearCursos)
router.post("/crear-temas", crearTemas)
router.post("/crear-preguntas", crearPreguntas)
router.post("/enviar-respuestas", enviarRespuestas)
router.post("/crear-examen", crearExamen)


export default router;