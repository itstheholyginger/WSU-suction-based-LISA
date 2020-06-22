import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
import './styles/App.css'
import './styles/index.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'font-awesome/css/font-awesome.min.css'
import { BrowserRouter as Router } from 'react-router-dom'

ReactDOM.render(
    <Router>
        <App />
    </Router>,
    document.getElementById('app')
)
if (module.hot) {
    module.hot.accept()
}
