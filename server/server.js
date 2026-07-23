import express from "express";
import { Server } from "socket.io";
import { createServer } from "node:http";
import { client } from "./database.js";
import cors from "cors";
import multer from "multer";
import path from "node:path";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
const port = 3000;

app.use(cors({ origin: "*" }));

await client.connect();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

// Endpoint that returns files from uploads directory
app.use("/api/uploads", express.static(path.join(process.cwd(), "uploads")));

// Endpoint to upload files
app.post("/api/upload", upload.array("attachment"), (req, res) => {
  const files = req.files.map((file) => {
    return file.path;
  });
  res.json(files);
});

// Websockets to retrieve and send messages
io.on("connection", async (socket) => {
  const res = await client.query(
    "SELECT * FROM attachments FULL JOIN messages ON attachments.message_id = messages.id ORDER BY messages.id ASC;",
  );
  for (let i = 0; i < res.rows.length; i++) {
    socket.emit("message", res.rows[i]);
  }

  socket.on("message", async (arg) => {
    try {
      await client.query("BEGIN");

      const result = await client.query(
        `INSERT INTO messages ("username", "content") VALUES ($1, $2) RETURNING id;`,
        [arg.username, arg.content],
      );

      const { id } = result.rows[0];

      if (arg.attachments) {
        arg.attachments.forEach(async (attachment) => {
          await client.query(
            `INSERT INTO attachments ("type", "message_id", "path") VALUES ($1, $2, $3);`,
            ["image", id, JSON.stringify([...arg.attachments])],
          );
        });
      }

      await client.query("COMMIT");

      const query = await client.query(
        "SELECT * FROM attachments FULL JOIN messages ON attachments.message_id = messages.id ORDER BY messages.id DESC LIMIT 1;",
      );

      io.emit("message", query.rows[0]);
    } catch (err) {
      await client.query("ROLLBACK");
      console.log(err);
    }
  });

  // socket.on("disconnect", async () => {
  //     console.log("Disconnected")
  // })
});

server.listen(port, () => {
  console.log(`I'm serving on http://localhost:${port}`);
});

process.on("SIGINT", async () => {
  await client.end();
  process.exit();
});
