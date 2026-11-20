import axios from 'axios'

// Mantén la dirección de la API en este único lugar.
export const API_BASE_URL = 'http://127.0.0.1:8000/api/'
const api = axios.create({ baseURL: API_BASE_URL, timeout: 10000 })
export default api
