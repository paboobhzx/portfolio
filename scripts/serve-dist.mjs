import http from "node:http"
import { readFile } from "node:fs/promises"
import { createReadStream, existsSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const ROOT = path.join(__dirname, "..")
const DIST = path.join(ROOT, "dist")

const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml"
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || "/", "http://localhost")
  const pathname = url.pathname === "/" ? "/index.html" : url.pathname
  const file = path.join(DIST, pathname)
  const ext = path.extname(file)

  if (!file.startsWith(DIST) || !existsSync(file)) {
    res.statusCode = 404
    res.end("Not found")
    return
  }

  res.setHeader("content-type", mime[ext] || "application/octet-stream")
  createReadStream(file).pipe(res)
})

server.listen(4173, () => {
  console.log("http://localhost:4173")
})

