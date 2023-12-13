import express from "express"
import cors from "cors"
import universidadesRutas from "./routes/universidades.routes.js"
import fileUpload from "express-fileupload"

const app = express()

app.use(cors())

app.use(express.json())

app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : './uploads'
}));

app.use('/api', universidadesRutas)

app.listen(4000)

console.log("Servidor corriendo en el puerto 4000")