import axios from 'axios'

const instance = axios.create({
  //   baseURL: API_URI,
  timeout: 1000,
  headers: { 'Content-Type': 'application/json' },
})

instance.interceptors.request.use(
  function (config) {
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)
instance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default instance
