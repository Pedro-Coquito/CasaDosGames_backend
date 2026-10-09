import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Feedback from '../components/Feedback/Feedback'
import { fetchGames } from '../services/api'
import type { Game } from '../types/game'
import { readFavoriteIds } from '../utils/favorites'
import styles from './Home.module.css'

export default function Home() {
  const navigate = useNavigate()
  const [userEmail] = useState(() => localStorage.getItem('userEmail') ?? '')
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let active = true

    fetchGames()
      .then((data) => {
        if (!active) return
        setGames(data)
        setLoading(false)
      })
      .catch((err: unknown) => {
        if (!active) return
        setError(err instanceof Error ? err.message : 'Não foi possível carregar os jogos.')
        setLoading(false)
      })

    return () => {
      active = false
    }
  }, [reloadKey])

  function retry() {
    setLoading(true)
    setError('')
    setReloadKey((current) => current + 1)
  }

  const favoriteIds = readFavoriteIds()
  const favoriteGames = games.filter((game) => favoriteIds.includes(game.id))

  function handleLogout() {
    localStorage.removeItem('isLogged')
    localStorage.removeItem('userEmail')
    navigate('/login')
  }

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <h1 className={styles.title}>Casa dos Games</h1>

        {userEmail && (
          <p className={styles.welcomeUser}>Logado como: <strong>{userEmail}</strong></p>
        )}

        <p className={styles.description}>
          Catálogo para consultar, favoritar e cadastrar jogos. Os dados vêm da API própria.
        </p>

        {loading && <Feedback tone="loading" message="Carregando resumo..." />}
        {!loading && error && <Feedback tone="error" message={error} onRetry={retry} />}

        {!loading && !error && (
          <>
            <div className={styles.statsContainer}>
              <div className={styles.statCard}>
                <h3>{games.length}</h3>
                <p>Jogos no catálogo</p>
              </div>
              <div className={styles.statCard}>
                <h3>{favoriteGames.length}</h3>
                <p>Meus favoritos</p>
              </div>
            </div>

            <div className={styles.favoritesSection}>
              <h2 className={styles.sectionTitle}>Jogos favoritos</h2>

              {favoriteGames.length === 0 ? (
                <p className={styles.noFavorites}>
                  Você ainda não favoritou nenhum jogo. Abra o catálogo e marque um título.
                </p>
              ) : (
                <div className={styles.favoriteGrid}>
                  {favoriteGames.slice(0, 3).map((game) => (
                    <div key={game.id} className={styles.miniCard}>
                      <img src={game.thumbnail} alt={game.title} />
                      <div className={styles.miniCardInfo}>
                        <h4>{game.title}</h4>
                        <Link to={`/jogos/${game.id}`} className={styles.miniDetailsBtn}>
                          Ver
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        <div className={styles.actionsContainer}>
          <Link to="/jogos" className={styles.catalogLink}>Ir para o catálogo</Link>
          <Link to="/jogos/novo" className={styles.catalogLink}>Cadastrar jogo</Link>
          <button type="button" onClick={handleLogout} className={styles.logoutButton}>Sair</button>
        </div>
      </div>
    </div>
  )
}
