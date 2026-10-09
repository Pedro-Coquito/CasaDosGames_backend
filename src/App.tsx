import { Navigate, Route, Routes } from 'react-router-dom'
import type { ReactNode } from 'react'
import Navbar from './components/NavBar/NavBar'
import DetalhesJogo from './pages/DetalhesJogo'
import Favoritos from './pages/Favoritos'
import FormJogo from './pages/FormJogo'
import Home from './pages/Home'
import ListaJogo from './pages/ListaJogo'
import Login from './pages/Login'

function PrivateRoute({ children }: { children: ReactNode }) {
  const isLogged = localStorage.getItem('isLogged') === 'true'
  if (!isLogged) return <Navigate to="/login" replace />

  return (
    <>
      <Navbar />
      {children}
    </>
  )
}

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
      <Route path="/Home" element={<PrivateRoute><Home /></PrivateRoute>} />
      <Route path="/jogos" element={<PrivateRoute><ListaJogo /></PrivateRoute>} />
      <Route path="/jogos/novo" element={<PrivateRoute><FormJogo /></PrivateRoute>} />
      <Route path="/jogos/:id" element={<PrivateRoute><DetalhesJogo /></PrivateRoute>} />
      <Route path="/jogos/:id/editar" element={<PrivateRoute><FormJogo /></PrivateRoute>} />
      <Route path="/favoritos" element={<PrivateRoute><Favoritos /></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
