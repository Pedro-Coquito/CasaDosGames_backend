import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Feedback from '../components/Feedback/Feedback'
import { GENRES, PLATFORMS } from '../constants/catalog'
import { createGame, fetchGame, updateGame } from '../services/api'
import type { GameInput } from '../types/game'
import styles from './FormJogo.module.css'

const EMPTY_FORM: GameInput = {
  title: '',
  short_description: '',
  genre: GENRES[0],
  platform: PLATFORMS[0],
  thumbnail: '',
  game_url: '',
}

export default function FormJogo() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const [form, setForm] = useState<GameInput>(EMPTY_FORM)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return

    let active = true

    fetchGame(Number(id))
      .then((game) => {
        if (!active) return
        setForm({
          title: game.title,
          short_description: game.short_description,
          genre: game.genre,
          platform: game.platform,
          thumbnail: game.thumbnail.startsWith('http') ? game.thumbnail : '',
          game_url: game.game_url,
        })
        setLoading(false)
      })
      .catch((err: unknown) => {
        if (!active) return
        setError(err instanceof Error ? err.message : 'Não foi possível carregar o jogo.')
        setLoading(false)
      })

    return () => {
      active = false
    }
  }, [id])

  function updateField(field: keyof GameInput, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setSaving(true)
    setError('')

    try {
      const saved = isEdit && id
        ? await updateGame(Number(id), form)
        : await createGame(form)
      navigate(`/jogos/${saved.id}`)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Não foi possível salvar o jogo.')
      setSaving(false)
    }
  }

  return (
    <div className={styles.container}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <Link to="/jogos" className={styles.backLink}>← Voltar ao catálogo</Link>
        <h1 className={styles.title}>{isEdit ? 'Editar jogo' : 'Cadastrar jogo'}</h1>

        {loading && <Feedback tone="loading" message="Carregando dados do jogo..." />}

        {!loading && error && !form.title && (
          <Feedback tone="error" message={error} />
        )}

        {!loading && (form.title || !isEdit) && (
          <>
            <label className={styles.label}>
              Título
              <input
                className={styles.input}
                value={form.title}
                onChange={(event) => updateField('title', event.target.value)}
                required
                minLength={2}
              />
            </label>

            <label className={styles.label}>
              Descrição
              <textarea
                className={styles.textarea}
                value={form.short_description}
                onChange={(event) => updateField('short_description', event.target.value)}
                required
                minLength={10}
                rows={4}
              />
            </label>

            <div className={styles.row}>
              <label className={styles.label}>
                Gênero
                <select
                  className={styles.input}
                  value={form.genre}
                  onChange={(event) => updateField('genre', event.target.value)}
                >
                  {GENRES.map((genre) => (
                    <option key={genre} value={genre}>{genre}</option>
                  ))}
                </select>
              </label>

              <label className={styles.label}>
                Plataforma
                <select
                  className={styles.input}
                  value={form.platform}
                  onChange={(event) => updateField('platform', event.target.value)}
                >
                  {PLATFORMS.map((platform) => (
                    <option key={platform} value={platform}>{platform}</option>
                  ))}
                </select>
              </label>
            </div>

            <label className={styles.label}>
              URL da imagem (opcional)
              <input
                className={styles.input}
                value={form.thumbnail}
                onChange={(event) => updateField('thumbnail', event.target.value)}
                placeholder="https://..."
              />
            </label>

            <label className={styles.label}>
              Link oficial (opcional)
              <input
                className={styles.input}
                value={form.game_url}
                onChange={(event) => updateField('game_url', event.target.value)}
                placeholder="https://..."
              />
            </label>

            {error && <p className={styles.error}>{error}</p>}

            <button type="submit" className={styles.button} disabled={saving}>
              {saving ? 'Salvando...' : isEdit ? 'Salvar alterações' : 'Cadastrar'}
            </button>
          </>
        )}
      </form>
    </div>
  )
}
