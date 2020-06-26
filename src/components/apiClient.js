import axios from 'axios'

const DEBUG = 0

var BASE_URL = 'https://wsu-suction-based-lisa.herokuapp.com'
if (DEBUG) {
    BASE_URL = 'http://127.0.0.1:8000'
}

export default axios.create({
    baseURL: BASE_URL,
    timeout: 20000,
    headers: {
        'Content-Type': 'application/json'
    }
})
