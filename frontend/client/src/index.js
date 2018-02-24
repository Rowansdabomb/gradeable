import React from 'react';
import ReactDOM from 'react-dom';
import '../src/CSS/index.css';
import '../src/CSS/font-awesome.min.css';
import '../src/CSS/bootstrap-grid.min.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
    , document.getElementById('root'));
