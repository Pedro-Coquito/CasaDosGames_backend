import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Feedback from '../components/Feedback/Feedback'
import { GENRES } from '../constants/catalog'
import { fetchGames } from '../services/api'
import type { Game } from '../types/game'
import { filterAndSortGames, measureFilterCost, type FilterBenchmark, type SortOption } from '../utils/gamesList'
import styles from './ListaJogo.module.css'

export default function ListaJogo() {
  const [games, setGames] = useState<Game[]>([])
  const [search, setSearch] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('')
  const [sort, setSort] = useState<SortOption>('title-asc')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)
  const [benchmark, setBenchmark] = useState<FilterBenchmark | undefined>()

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
        setError(err instanceof Error ? err.message : 'Não foi possível carregar o catálogo.')
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

  function runBenchmark() {
    const result = measureFilterCost(games)
    if (result) setBenchmark(result)
  }

  const filteredGames = useMemo(
    () => filterAndSortGames(games, search, selectedGenre, sort),
    [games, search, selectedGenre, sort],
  )

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerRow}>
          <h1 className={styles.title}>Catálogo de Jogos</h1>
          <Link to="/jogos/novo" className={styles.createLink}>Cadastrar jogo</Link>
        </div>
      </header>

      <div className={styles.filtersContainer}>
        <input
          type="text"
          placeholder="Pesquisar por nome..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className={styles.searchInput}
        />

        <select
          value={selectedGenre}
          onChange={(event) => setSelectedGenre(event.target.value)}
          className={styles.selectInput}
        >
          <option value="">Todos os gêneros</option>
          {GENRES.map((genre) => (
            <option key={genre} value={genre}>{genre}</option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(event) => setSort(event.target.value as SortOption)}
          className={styles.selectInput}
        >
          <option value="title-asc">Nome (A-Z)</option>
          <option value="title-desc">Nome (Z-A)</option>
          <option value="genre">Gênero</option>
        </select>
      </div>

      {loading && <Feedback tone="loading" message="Carregando catálogo..." />}
      {!loading && error && <Feedback tone="error" message={error} onRetry={retry} />}
      {!loading && !error && filteredGames.length === 0 && (
        <Feedback tone="empty" message="Nenhum jogo encontrado para essa busca ou filtro." />
      )}

      {!loading && !error && filteredGames.length > 0 && (
        <>
          <p className={styles.resultCount}>{filteredGames.length} jogo(s) encontrado(s)</p>
          <div className={styles.benchmark}>
            <button type="button" onClick={runBenchmark} className={styles.benchmarkButton}>
              Medir filtro
            </button>
            {benchmark && (
              <p>
                {benchmark.rounds} filtros em {benchmark.items} jogos: sem reutilizar o resultado {benchmark.beforeMs} ms,
                reutilizando {benchmark.afterMs} ms.
              </p>
            )}
          </div>
          <div className={styles.grid}>
            {filteredGames.map((game) => (
              <article key={game.id} className={styles.card}>
                <img src={game.thumbnail} alt={game.title} />
                <div className={styles.cardContent}>
                  <span className={styles.genreBadge}>{game.genre}</span>
                  <h3>{game.title}</h3>
                  <p>{game.short_description}</p>
                </div>
                <div className={styles.cardFooter}>
                  <Link to={`/jogos/${game.id}`} className={styles.detailsButton}>
                    Ver detalhes
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
