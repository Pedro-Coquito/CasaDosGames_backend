import { Link, useNavigate } from 'react-router-dom'
import styles from './NavBar.module.css'

export default function Navbar() {
  const navigate = useNavigate()

  function handleLogout() {
    localStorage.removeItem('isLogged')
    localStorage.removeItem('userEmail')
    navigate('/login')
  }

  return (
    <nav className={styles.nav}>
      <Link to="/" className={styles.brand}>Casa dos Games</Link>
      <div className={styles.linksContainer}>
        <Link to="/" className={styles.link}>Home</Link>
        <Link to="/jogos" className={styles.link}>Catálogo</Link>
        <Link to="/favoritos" className={styles.link}>Favoritos</Link>
        <Link to="/jogos/novo" className={styles.link}>Cadastrar</Link>
        <button type="button" onClick={handleLogout} className={styles.logoutButton}>
          Sair
        </button>
      </div>
    </nav>
  )
}
