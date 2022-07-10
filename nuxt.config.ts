import { defineNuxtConfig } from 'nuxt'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    publicRuntimeConfig: {
        WEATHER_APP_ID_KEY: process.env.WEATHER_APP_ID_KEY
    },
    privateRuntimeConfig: {

    },
    css: [
        "~/assets/css/tailwind.css"
    ],
    build: {
        postcss: {
            postcssOptions: {
                plugins: {
                    tailwindcss: {},
                    autoprefixer: {}
                }
            }
        }
    }
})
