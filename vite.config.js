import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [tailwindcss(), react()],
  resolve: {
    alias: {
      // flowbite-react bundles tailwind-merge v2 for Tailwind 3 alongside v3, and only
      // uses v2 when its version is set to 3. We're on Tailwind 4, so drop the dead copy.
      'tailwind-merge-v2': 'tailwind-merge-v3',
    },
  },
  server: {
    port: 3000,
  },
});
