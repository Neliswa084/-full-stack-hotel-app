import express from "express"
import dotenv from "dotenv"
import { testDbConnection } from "./config/database"
import { initDb } from "./config/initDb"
import cors from "cors"
import authRoutes from "./routes/authRoutes"
import hotelsRoutes from "./routes/hotelsRoutes"
import roomRoutes from "./routes/roomRoutes"



dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000

const startServer = async () => {
  await testDbConnection()
  await initDb()

  app.use(express.json())
app.use(cors())

  app.use("/api/auth", authRoutes)
  app.use("/api/hotels", hotelsRoutes)
  app.use("/api/rooms", roomRoutes)


  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
  })
}

startServer()