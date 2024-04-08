import ssr from "vike/plugin";
import react from "@vitejs/plugin-react";
import { defineConfig, Plugin } from "vite";
import vono from "@vonojs/vono"
import Adaptor from "@vonojs/vono/adaptor-node"
import * as fs from "node:fs/promises";

const adaptor = new Adaptor()
const oldBuildEnd = adaptor.buildEnd
adaptor.buildEnd = async () => {
  await oldBuildEnd?.()
  const file = await fs.readFile("dist/server/server.mjs", "utf-8")
  await fs.writeFile("dist/server/run.js", `import "./entry.mjs";\n${file}`)
}

// Ugly hack to prevent Vike from creating middleware
const toggleMiddlewareMode = (toggle: boolean): Plugin => {
  let config: any;
  return {
    name: "toggle-middleware-mode-" + toggle,
    enforce: "post",
    configResolved: (c) => {
        config = c
    },
    configureServer: {
      order: "post",
      handler: async (server) => {
        config.server.middlewareMode = toggle
      }
    }
  }
}

export default defineConfig({
  plugins: [
    react(),
    vono({adaptor, serverEntry: "server/entry"}),
    toggleMiddlewareMode(true),
    ssr({
      disableAutoFullBuild: true,
    }),
    toggleMiddlewareMode(false)
  ]
})
