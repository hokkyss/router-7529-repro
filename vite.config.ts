import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { defineConfig } from 'vite'
import viteReact, { reactCompilerPreset } from '@vitejs/plugin-react'
import { cloudflare } from '@cloudflare/vite-plugin'
import babel from '@rolldown/plugin-babel'

export default defineConfig({
  server: {
    port: 3000,
  },
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    cloudflare({ viteEnvironment: { name: 'ssr', childEnvironments: ['rsc'] } }),
    tanstackStart(),
    viteReact(),
    babel({
      presets: [reactCompilerPreset()]
    })
  ],
})
