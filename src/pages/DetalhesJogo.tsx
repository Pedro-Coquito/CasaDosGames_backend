import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Feedback from '../components/Feedback/Feedback'
import { deleteGame, fetchGame } from '../services/api'
import type { Game } from '../types/game'
import { isFavorite, removeFavoriteId, toggleFavoriteId } from '../utils/favorites'
import styles from './DetalhesJogo.module.css'

export default function DetalhesJogo() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [game, setGame] = useState<Game | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [favorite, setFavorite] = useState(false)
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)
  const [trackedId, setTrackedId] = useState(id)

  if (id !== trackedId) {
    setTrackedId(id)
    setLoading(true)
    setError('')
    setGame(null)
    setConfirmingDelete(false)
  }

  useEffect(() => {
    if (!id) return
    let active = true

    fetchGame(Number(id))
      .then((data) => {
        if (!active) return
        setGame(data)
        setFavorite(isFavorite(data.id))
        setLoading(false)
      })
      .catch((err: unknown) => {
        if (!active) return
        setGame(null)
        setError(err instanceof Error ? err.message : 'Não foi possível carregar o jogo.')
        setLoading(false)
      })

    return () => {
      active = false
    }
  }, [id, reloadKey])

  function retry() {
    setLoading(true)
    setError('')
    setReloadKey((current) => current + 1)
  }

  function handleFavorite() {
    if (!game) return
    setFavorite(toggleFavoriteId(game.id))
  }

  async function handleDelete() {
    if (!game) return
    setDeleting(true)
    setError('')

    try {
      await deleteGame(game.id)
      removeFavoriteId(game.id)
      navigate('/jogos')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Não foi possível excluir o jogo.')
      setDeleting(false)
      setConfirmingDelete(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.headerRow}>
          <button type="button" onClick={() => navigate('/jogos')} className={styles.backLink}>
            ← Voltar
          </button>
          {game && (
            <button
              type="button"
              onClick={handleFavorite}
              className={`${styles.favoriteBtn} ${favorite ? styles.favorited : ''}`}
            >
              {favorite ? '❤️ Nos favoritos' : '🤍 Favoritar'}
            </button>
          )}
        </div>

        {loading && <Feedback tone="loading" message="Carregando jogo..." />}
        {!loading && error && <Feedback tone="error" message={error} onRetry={retry} />}

        {!loading && game && (
          <>
            <h1 className={styles.title}>{game.title}</h1>

            <div className={styles.imageContainer}>
              <img src={game.thumbnail} alt={game.title} className={styles.image} />
            </div>

            <div className={styles.infoContainer}>
              <div className={styles.badgeGroup}>
                <span className={styles.badge}>Gênero: {game.genre}</span>
                <span className={styles.badge}>Plataforma: {game.platform}</span>
              </div>

              <p className={styles.description}>
                <strong>Descrição:</strong> {game.short_description}
              </p>

              {game.game_url && (
                <a href={game.game_url} target="_blank" rel="noopener noreferrer" className={styles.playButton}>
                  Acessar jogo oficial
                </a>
              )}

              <div className={styles.manageRow}>
                <Link to={`/jogos/${game.id}/editar`} className={styles.editButton}>Editar</Link>
                {!confirmingDelete ? (
                  <button type="button" className={styles.deleteButton} onClick={() => setConfirmingDelete(true)}>
                    Excluir
                  </button>
                ) : (
                  <button type="button" className={styles.deleteButton} onClick={handleDelete} disabled={deleting}>
                    {deleting ? 'Excluindo...' : 'Confirmar exclusão'}
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
