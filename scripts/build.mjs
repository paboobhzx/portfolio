import { mkdir, rm, cp, readdir, stat } from "node:fs/promises"
import { existsSync } from "node:fs"
import path from "node:path"
import { spawn } from "node:child_process"

const ROOT = process.cwd()
const SRC_PAGES = path.join(ROOT, "src", "pages")
const SRC_ASSETS = path.join(ROOT, "src", "assets")
const DIST = path.join(ROOT, "dist")
const DIST_ASSETS = path.join(DIST, "assets")

async function copyDir(src, dest) {
  await mkdir(dest, { recursive: true })
  const entries = await readdir(src)
  for (const name of entries) {
    const from = path.join(src, name)
    const to = path.join(dest, name)
    const st = await stat(from)
    if (st.isDirectory()) await copyDir(from, to)
    else await cp(from, to)
  }
}

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: "inherit" })
    p.on("close", (code) => {
      if (code === 0) resolve()
      else reject(new Error(`${cmd} exited with code ${code}`))
    })
  })
}

await rm(DIST, { recursive: true, force: true })
await mkdir(DIST_ASSETS, { recursive: true })

// Copy pages
await copyDir(SRC_PAGES, DIST)

// Copy assets (js)
if (existsSync(SRC_ASSETS)) await copyDir(SRC_ASSETS, DIST_ASSETS)

// Copy screenshots
const SCREENSHOTS = path.join(ROOT, "screenshots")
const DIST_SCREENSHOTS = path.join(DIST, "screenshots")
if (existsSync(SCREENSHOTS)) {
  await copyDir(SCREENSHOTS, DIST_SCREENSHOTS)
  console.log("[build] screenshots copied")
}

// Build Tailwind CSS
const tw = path.join(ROOT, "node_modules", ".bin", "tailwindcss")
await run(tw, [
  "-c",
  path.join(ROOT, "tailwind.config.cjs"),
  "-i",
  path.join(ROOT, "src", "styles", "input.css"),
  "-o",
  path.join(DIST_ASSETS, "styles.css"),
  "--minify"
])

console.log("[build] dist ready")

