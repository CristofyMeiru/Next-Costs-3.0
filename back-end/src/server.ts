require('dotenv').config()
import express, {Application} from 'express'
import cors from 'cors'
import cookieParser, { } from 'cookie-parser'
import userRoutes from './routes/user.routes'
import ConnectToDB from './config/ConnectToDB'
import projectRoutes from './routes/project.routes'
import path from 'path'
import serviceRoutes from './routes/service.routes'

const app: Application = express()
const port: number = Number(process.env.PORT)

//Middlewares
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}))
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))
//Conection with DB
    ConnectToDB()
//Rotas categorizadas
app.use('/user', userRoutes)
app.use('/project', projectRoutes)
app.use('/service', serviceRoutes)

app.listen(port, ()=> {
    console.log("Server is running...\nhttp://localhost:" + port)
})