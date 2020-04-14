import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import "./styles/App.css";
import './styles/index.css';
import "bootstrap/dist/css/bootstrap.min.css"


ReactDOM.render(<App />, document.getElementById('app'));
if (module.hot) {
    module.hot.accept();
}