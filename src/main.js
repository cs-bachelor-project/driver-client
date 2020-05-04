import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import moment from 'moment'
import decode from 'jwt-decode'
import { Datetime } from 'vue-datetime'
import 'vue-datetime/dist/vue-datetime.css'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import VueSweetalert2 from 'vue-sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css';
import Toast, { TYPE } from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import Echo from 'laravel-echo'
window.io = require('socket.io-client')

Vue.config.productionTip = false

const AUTH_TOKEN_KEY = 'token'

window.Echo = new Echo({
  broadcaster: 'socket.io',
  host: window.location.hostname + ':6001',
  auth: {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem(AUTH_TOKEN_KEY)}`,
    }
  }
})

Vue.prototype.$axios = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  timeout: 30000,
})

Vue.use(Toast, {
  toastDefaults: {
    [TYPE.ERROR]: {
      timeout: 5000,
    },
    [TYPE.SUCCESS]: {
      timeout: 3000,
    }
  }
});
Vue.use(VueSweetalert2);
Vue.component('datetime', Datetime)

Vue.prototype.$axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem(AUTH_TOKEN_KEY)}`

Vue.mixin({
  data: function () {
    return {
      get moment() {
        return moment;
      },
      ready: false,
    }
  },
  methods: {
    utcToLocal: function (time) {
      return this.moment.utc(time).local();
    },
    logout: function () {
      this.clearAuthToken()
      this.$router.push({ name: 'login' })
    },
    setAuthToken: function (token) {
      Vue.prototype.$axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      localStorage.setItem(AUTH_TOKEN_KEY, token)
    },
    getAuthToken: function () {
      return localStorage.getItem(AUTH_TOKEN_KEY)
    },
    clearAuthToken: function () {
      Vue.prototype.$axios.defaults.headers.common['Authorization'] = ''
      localStorage.removeItem(AUTH_TOKEN_KEY)
    },
    isLoggedIn: function () {
      let authToken = this.getAuthToken()
      return !!authToken && !this.isTokenExpired(authToken)
    },
    getUserInfo: function () {
      if (this.isLoggedIn()) {
        return decode(this.getAuthToken())
      }
    },
    hasAnyRole: function (roles) {
      let userRoles = this.getUserInfo().roles

      for (let i = 0; i < roles.length; i++) {
        let has = userRoles.includes(roles[i])

        if (has === true) {
          return true
        }
      }

      return false
    },
    getTokenExpirationDate: function (encodedToken) {
      let token = decode(encodedToken)
      if (!token.exp) {
        return null
      }

      let date = new Date(0)
      date.setUTCSeconds(token.exp)

      return date
    },
    isTokenExpired: function (token) {
      let expirationDate = this.getTokenExpirationDate(token)
      return expirationDate < new Date()
    }
  }
})

Vue.component('loading', require('./components/loading.vue').default);

new Vue({
  router,
  Echo,
  render: h => h(App)
}).$mount('#app')