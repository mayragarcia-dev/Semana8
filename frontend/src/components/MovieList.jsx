import MovieCard from './MovieCard.jsx'
import MovieSearch from './MovieSearch.jsx'
import '../styles/movie-list.css'
import { useWindowSize } from '../hooks/useWindowSize.js'

export default function MovieList({ movies, favoriteIds, onToggleFavorite, searchTerm, onSearchChange }) {
  const { width } = useWindowSize()
  const columns = width < 390 ? 1 : width < 720 ? 2 : width < 1000 ? 3 : 4
  return (
    <section className="movie-list-section" id="peliculas" aria-labelledby="movies-title">
      <div className="movie-list-section__intro">
        <div>
          <p className="movie-list-section__eyebrow">EN CARTELERA</p>
          <h2 id="movies-title">Elige tu próxima historia.</h2>
        </div>
        <p className="movie-list-section__note">Ocho películas. Una sala para cada emoción.</p>
      </div>
      <MovieSearch value={searchTerm} onChange={onSearchChange} />
      <div className="movie-list" style={{ '--movie-columns': columns }}>
        {movies.map((movie) => <MovieCard movie={movie} key={movie.id} isFavorite={favoriteIds.includes(movie.id)} onToggleFavorite={onToggleFavorite} />)}
        {movies.length === 0 && <p className="movie-list__empty">No encontramos películas con ese título.</p>}
      </div>
    </section>
  )
}
