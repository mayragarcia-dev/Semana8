import '../styles/movie-card.css'
import Button from './Button.jsx'

export default function MovieCard({ movie, isFavorite, onToggleFavorite }) {
  return (
    <article className="movie-card">
      <div className="movie-card__poster-wrap">
        <img className="movie-card__poster" src={movie.image} alt={`Póster de ${movie.title}`} loading="lazy" />
        <span className="movie-card__classification">{movie.classification}</span>
        <Button type="button" variant="favorite" aria-pressed={isFavorite} aria-label={`${isFavorite ? 'Quitar de' : 'Añadir a'} favoritos: ${movie.title}`} onClick={() => onToggleFavorite(movie.id)}>{isFavorite ? '♥' : '♡'}</Button>
      </div>
      <div className="movie-card__body">
        <div className="movie-card__heading">
          <h3>{movie.title}</h3>
          <span className="movie-card__rating" aria-label={`Valoración ${movie.rating} de 10`}>★ {movie.rating}</span>
        </div>
        <div className="movie-card__times" aria-label="Horarios disponibles">
          {movie.schedules.map((time) => <span className="movie-card__time" key={`${movie.id}-${time}`}>{time}</span>)}
        </div>
      </div>
    </article>
  )
}
