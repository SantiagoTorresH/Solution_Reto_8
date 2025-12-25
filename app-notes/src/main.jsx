// biblioteca para manejar las rutas de la aplicacion(/login, /register, /notes)
// envolvemos la aplicacion en el proveedor de enrutamiento.


import { StrictMode } from 'react';

import './index.css';
import App from './App.jsx';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // importamos Brouserouter


ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter> {/* envolvemos la aplicacion en el proveedor de enrutamiento. */}
      <App />
    </BrowserRouter>
  </StrictMode>
)
