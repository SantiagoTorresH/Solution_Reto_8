// import { useState } from 'react'
import './App.css'

import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Notes from './pages/Notes';
import ProtectedRoute from './routes/ProtectedRoute';

function App() {

  return (
    <>
    <div className="min-h-screen bg-gray-900">

      <Routes>

        {/*public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} /> 

        {/*protected routes */}
        <Route 
          path="/notes" element={
            // aqui usaremos el componente protected Rouete para verificar si el usuario esta logeado
            <ProtectedRoute>
              <Notes />
            </ProtectedRoute>
          } />
          {/* ruta por defecto(can redirect to Login, if there is no token) */}
          <Route path="/" element={<Notes />} /> 



      </Routes>
    </div>

    </>
  );
}

export default App
