import Vue, { DirectiveOptions } from 'vue'

import 'normalize.css'
import ElementUI from 'element-ui'
import SvgIcon from 'vue-svgicon'

import '@/styles/element-variables.scss'
import '@/styles/index.scss'

import App from '@/App.vue'
import store from '@/store'
import { AppModule } from '@/store/modules/app'
import router from '@/router'
import i18n from '@/lang'
import '@/icons/components'
import '@/permission'
import '@/utils/error-log'
import '@/pwa/register-service-worker'
import * as directives from '@/directives'
import * as filters from '@/filters'
import * as firebase from 'firebase/app'

Vue.use(ElementUI, {
  size: AppModule.size, // Set element-ui default size
  i18n: (key: string, value: string) => i18n.t(key, value)
})

Vue.use(SvgIcon, {
  tagName: 'svg-icon',
  defaultWidth: '1em',
  defaultHeight: '1em'
})

// Register global directives
Object.keys(directives).forEach(key => {
  Vue.directive(key, (directives as { [key: string ]: DirectiveOptions })[key])
})

// Register global filter functions
Object.keys(filters).forEach(key => {
  Vue.filter(key, (filters as { [key: string ]: Function })[key])
})

Vue.config.productionTip = false

const firebaseConfig = {
  apiKey: "AIzaSyCWQjn29mR5eJ-PC52zQnJAm3GuBVY1mTg",
  authDomain: "karakapli-web.firebaseapp.com",
  databaseURL: "https://karakapli-web.firebaseio.com",
  projectId: "karakapli-web",
  storageBucket: "karakapli-web.appspot.com",
  messagingSenderId: "315781520643",
  appId: "1:315781520643:web:a0d83d3e717d8a0a5ddd36",
  measurementId: "G-GH4EHXVSQK"
};

firebase.default.initializeApp(firebaseConfig)

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App)
}).$mount('#app')
