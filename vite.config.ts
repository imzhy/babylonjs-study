import {defineConfig} from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsxPlugin from "@vitejs/plugin-vue-jsx";
import {resolve} from "path";
import postCssPresetEnv from "postcss-preset-env";

export default defineConfig({
    base: "./",
    build: {
        emptyOutDir: true,
        outDir: "dist"
    },
    server: {
        host: "0.0.0.0",
        port: 10086
    },
    css: {
        preprocessorOptions: {
            less: {
                javascriptEnable: true
            }
        },
        postcss: {
            plugins: [
                postCssPresetEnv()
            ]
        }
    },
    plugins: [
        vue(),
        vueJsxPlugin()
    ],
    resolve: {
        alias: [
            {
                find: "@assets",
                replacement: resolve("src/assets")
            },
            {
                find: "@store",
                replacement: resolve("src/store")
            },
            {
                find: "@router",
                replacement: resolve("src/router")
            },
            {
                find: "@view",
                replacement: resolve("src/view")
            }
        ]
    }
})
