
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { spawn } from 'child_process';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Khởi động API server
  if (mode === 'development') {
    const apiServer = spawn('node', ['src/server/index.js'], { stdio: 'inherit' });
    process.on('exit', () => {
      apiServer.kill();
    });
  }

  return {
    server: {
      host: "::",
      port: 8080,
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
        }
      }
    },
    plugins: [
      react(),
      mode === 'development' &&
      componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
