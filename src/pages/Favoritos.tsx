import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Feedback from '../components/Feedback/Feedback'
import { fetchGames } from '../services/api'
import type { Game } from '../types/game'
import { readFavoriteIds, removeFavoriteId } from '../utils/favorites'
import styles from './Favoritos.module.css'

export default function Favoritos() {
  const [games, setGames] = useState<Game[]>([])
  const [favoriteIds, setFavoriteIds] = useState<number[]>(() => readFavoriteIds())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let active = true

    fetchGames()
      .then((data) => {
        if (!active) return
        setGames(data)
        setFavoriteIds(readFavoriteIds())
        setLoading(false)
      })
      .catch((err: unknown) => {
        if (!active) return
        setError(err instanceof Error ? err.message : 'Não foi possível carregar os favoritos.')
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

  const favorites = games.filter((game) => favoriteIds.includes(game.id))

  function handleRemove(id: number) {
    removeFavoriteId(id)
    setFavoriteIds(readFavoriteIds())
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Meus favoritos</h1>
        <p className={styles.subtitle}>A lista fica neste navegador e usa os jogos carregados da API.</p>
      </header>

      {loading && <Feedback tone="loading" message="Carregando favoritos..." />}
      {!loading && error && <Feedback tone="error" message={error} onRetry={retry} />}
      {!loading && !error && favorites.length === 0 && (
        <Feedback tone="empty" message="Você ainda não favoritou nenhum jogo. Abra o catálogo e escolha um título." />
      )}

      {!loading && !error && favorites.length > 0 && (
        <div className={styles.grid}>
          {favorites.map((game) => (
            <article key={game.id} className={styles.card}>
              <img src={game.thumbnail} alt={game.title} />
              <div className={styles.cardContent}>
                <span className={styles.genreBadge}>{game.genre}</span>
                <h3>{game.title}</h3>
                <p>{game.short_description}</p>
              </div>
              <div className={styles.actions}>
                <Link to={`/jogos/${game.id}`} className={styles.detailsButton}>Ver detalhes</Link>
                <button type="button" className={styles.removeButton} onClick={() => handleRemove(game.id)}>
                  Remover
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
