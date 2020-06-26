import axios from 'axios'

const BASE_URL = ''

export default axios.create({
    baseURL: BASE_URL,
    timeout: 20000,
    headers: {
        'Content-Type': 'application/json'
    }
})
