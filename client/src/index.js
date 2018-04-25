import React from 'react';
import ReactDOM from 'react-dom';
import '../src/CSS/index.css';
import '../src/CSS/font-awesome.min.css';
import '../src/CSS/bootstrap-grid.min.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from './redux/store/configurestore';

const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
        <App />
    </BrowserRouter>
  </Provider>
    , document.getElementById('root'));
