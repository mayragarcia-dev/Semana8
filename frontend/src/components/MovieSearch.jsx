export default function MovieSearch({ value, onChange }) {
  return (
    <label className="movie-search">
      <span>Buscar película</span>
      <input type="search" value={value} onChange={(event) => onChange(event.target.value)} placeholder="Escribe un título…" />
    </label>
  )
}
