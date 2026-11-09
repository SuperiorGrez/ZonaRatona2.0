import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    open: true,
    // json-server escribe en db.json; Vite no debe recargar la página por eso.
    watch: { ignored: ['**/db.json'] },
  },
});
