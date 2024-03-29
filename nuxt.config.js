export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,
  generate: {
    subFolders: true
  },
  router: {
    base: '/'
  },
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'todoApp',
    
    htmlAttrs: {
      lang: 'ko'
    },
    
    meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, viewport-fit=cover, user-scalable=no' },
        { httpEquiv: 'X-UA-Compatible', content: 'ie=edge' },
        { hid: 'description', name: 'description', content: '' }
    ],
    
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'icon', type: 'image/x-icon', sizes: '32x32', href: '/favicon32x32.png' },
      { rel: 'apple-touch-icon', sizes: '96x96', href: '/favicon96x96.png' }
    ],
    
    bodyAttrs: {
        class: "fb"
    },

    script: [
        {src: "/__/firebase/8.4.1/firebase-app.js"},
        {src: "/__/firebase/8.4.1/firebase-auth.js"},
        {src: "/__/firebase/8.4.1/firebase-database.js"},
        {src: "/__/firebase/8.4.1/firebase-firestore.js"},
        {src: "/__/firebase/init.js"},
    ]
  },

  //dev모드에서 자동 새로고침
  watchers: {
	webpack: {
	  aggregateTimeout: 300,
	  poll: 1000
	}
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    "@/assets/scss/app.scss"
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    "~/plugins/global.js"
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
  ],

  serverMiddleware: [
    // mysql 연동 테스트용
    // '~/api/index.js',
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  },
}
