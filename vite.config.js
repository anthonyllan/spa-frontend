import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Configuración mejorada para manejar favicons y otros assets
    rollupOptions: {
      output: {
        manualChunks: undefined,
        // Versión actualizada usando la propiedad 'names' en lugar de 'name'
        assetFileNames: (assetInfo) => {
          // Obtener nombre del archivo de la manera recomendada
          const fileName = assetInfo.name || (assetInfo.names && assetInfo.names[0]) || '';
          
          // Mantener los archivos favicon y otros iconos en la raíz
          if (/favicon\.(ico|png|svg)$|apple-touch-icon\.png$/.test(fileName)) {
            return '[name][extname]';
          }
          // El resto de assets en la carpeta assets con hash
          return 'assets/[name]-[hash][extname]';
        }
      }
    }
  },
  // Asegurar que los archivos en public son copiados tal cual
  publicDir: 'public'
})