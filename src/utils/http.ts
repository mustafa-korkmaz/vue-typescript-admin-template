import axios from "axios";
import { UserModule } from '@/store/modules/user';
import { Message } from 'element-ui'

const httpService = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL,
  timeout: 10000 // request time out 10 secs
})

// request interceptor
httpService.interceptors.request.use(
  (config) => {
    // Add X-Access-Token header to every request, you can add other custom headers here
    if (UserModule.token) {
      config.headers['Authorization'] = 'Bearer ' + UserModule.token
    }
    return config
  },
  (error) => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
httpService.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    Message({
      message: error.response.data.error_code, // todo: translate error_code
      type: 'error',
      duration: 3 * 1000
    })
    return Promise.reject(error)
  })

export default httpService;