import { useCallback, useEffect, useState } from 'react'
import { createExam, deleteExam, listExams } from './services/apiClient.js'
import './styles/exams.css'

export default function App() {
  const [exams, setExams] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const loadExams = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await listExams()
      setExams(Array.isArray(data) ? data : data.results ?? [])
    } catch {
      setError('No se pudieron cargar los exámenes. Comprueba que la API esté disponible.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadExams() }, [loadExams])

  async function handleCreate(event) {
    event.preventDefault()
    if (!title.trim()) return
    try {
      await createExam({ title: title.trim(), description: description.trim() })
      setTitle('')
      setDescription('')
      await loadExams()
    } catch {
      setError('No se pudo crear el examen. Inténtalo de nuevo.')
    }
  }

  async function handleDelete(id) {
    try {
      await deleteExam(id)
      await loadExams()
    } catch {
      setError('No se pudo eliminar el examen. Inténtalo de nuevo.')
    }
  }

  return (
    <main className="exams-page">
      <header className="exams-header"><p className="exams-kicker">Laboratorio 13 · API REST</p><h1>Exámenes</h1><p>Gestiona los exámenes disponibles en la API del laboratorio 8.</p></header>
      <form className="exam-form" onSubmit={handleCreate}>
        <label>Nombre del examen<input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Ej. Evaluación parcial" required /></label>
        <label>Descripción<input value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Descripción breve" /></label>
        <button type="submit">Crear examen</button>
      </form>
      <section aria-labelledby="exam-list-title"><div className="section-heading"><h2 id="exam-list-title">Listado de exámenes</h2><button className="refresh-button" onClick={loadExams} disabled={loading}>Actualizar</button></div>
        {loading ? <div className="skeleton-list" role="status" aria-label="Cargando exámenes">{[1, 2, 3].map((item) => <div className="skeleton-row" key={item}><span /><span /><span /></div>)}</div>
          : error ? <div className="error-panel" role="alert"><p>{error}</p><button onClick={loadExams}>Reintentar</button></div>
            : <div className="table-wrap"><table><thead><tr><th>ID</th><th>Nombre</th><th>Descripción</th><th>Acciones</th></tr></thead><tbody>{exams.map((exam) => <tr key={exam.id}><td>{exam.id}</td><td>{exam.title}</td><td>{exam.description || '—'}</td><td><button className="delete-button" onClick={() => handleDelete(exam.id)} aria-label={`Eliminar ${exam.title}`}>Eliminar</button></td></tr>)}</tbody></table>{exams.length === 0 && <p className="empty-state">Todavía no hay exámenes registrados.</p>}</div>}
      </section>
    </main>
  )
}
