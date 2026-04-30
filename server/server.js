import express from "express"
import { Server } from "socket.io"
import { createServer } from "node:http"
import { client } from "./database.js"
import cors from "cors"

const app = express()
const server = createServer(app)
const io = new Server(server, {
    cors: {
        origin: "*"
    }
})
const port = 3000

app.use(cors({ origin: "*" }))
await client.connect()

io.on("connection", async (socket) => {
    const res = await client.query("SELECT * FROM messages")
    for (let i = 0; i < res.rows.length; i++) {
        socket.emit("message", res.rows[i])
    }

    socket.on("message", (arg) => {
        client.query(`INSERT INTO messages ("username", "content", "type") VALUES ($1, $2, $3)`, [arg.username, arg.content, arg.type])
        io.emit("message", arg)
    })

    // socket.on("disconnect", async () => {
    //     console.log("Disconnected")
    // })
})

server.listen(port, () => {
    console.log(`I'm serving on http://localhost:${port}`)
})

process.on("SIGINT", async () => {
    await client.end()
    process.exit()
})