import express from "express"
import dotenv from "dotenv"
import { testDbConnection } from "./config/database"
import { initDb } from "./config/initDb"



dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000

const startServer = async () => {
  await testDbConnection()
  await initDb()

  app.use(express.json())


  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
  })
}

startServer()