// biblioteca para manejar las rutas de la aplicacion(/login, /register, /notes)
// envolvemos la aplicacion en el proveedor de enrutamiento.


import { StrictMode } from 'react';
// import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // importamos Brouserouter


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> // envolvemos la app para que reconozca las rutas
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
