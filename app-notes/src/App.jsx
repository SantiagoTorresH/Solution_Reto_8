// import { useState } from 'react'
import './App.css'

import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Notes from './pages/Notes';
import ProtectedRoute from './routes/ProtectedRoute';
import Footer from './components/Footer';


function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-800">

      <main className="flex-grow">
        <Routes>
          {/* Esto hace que si entras a la raíz, te mande a login automáticamente */}
          <Route path="/" element={<Navigate to="/login" />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/notes"
            element={
              <ProtectedRoute>
                <Notes />
              </ProtectedRoute>
            }
          />
        </Routes>


      </main>
      <Footer />
    </div>

  );
}

export default App;