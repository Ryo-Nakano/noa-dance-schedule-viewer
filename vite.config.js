import { defineConfig } from "vite";
import rollupPluginGas from "rollup-plugin-google-apps-script";
import path from "path";
import fs from "fs";

export default defineConfig({
  plugins: [
    rollupPluginGas(),
    {
      name: 'copy-appsscript-json', // カスタムプラグインの名前
      writeBundle() {
        const destDir = path.resolve(__dirname, 'dist');
        if (!fs.existsSync(destDir)) fs.mkdirSync(destDir);
        
        // Copy appsscript.json
        const srcFile = path.resolve(__dirname, 'appsscript.json');
        const destFile = path.join(destDir, 'appsscript.json');
        fs.copyFileSync(srcFile, destFile);
        console.log('appsscript.json has been copied to dist folder');
        
        // Copy dialog.html
        const srcHtml = path.resolve(__dirname, 'src/dialog.html');
        const destHtml = path.join(destDir, 'dialog.html');
        if (fs.existsSync(srcHtml)) {
          fs.copyFileSync(srcHtml, destHtml);
          console.log('dialog.html has been copied to dist folder');
        }
      }
    }
  ],
  build: {
    rollupOptions: {
      input: "src/index.js",
      output: {
        dir: "dist",
        entryFileNames: "main.js",
      },
    },
    minify: false, // trueにすると関数名が消えるのでfalse必須
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});