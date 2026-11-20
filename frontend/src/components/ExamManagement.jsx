import { useCallback, useEffect, useState } from 'react'
import { createExam, deleteExam, listExams } from '../services/examService.js'
import '../styles/exams.css'

function unwrapList(payload) {
  return Array.isArray(payload) ? payload : payload?.results ?? []
}

export default function ExamManagement() {
  const [exams, setExams] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(window.location.hash === '#/exams/new' ? 'new' : 'list')
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    const handleNavigation = () => {
      setPage(window.location.hash === '#/exams/new' ? 'new' : 'list')
      setFormError('')
    }
    window.addEventListener('hashchange', handleNavigation)
    return () => window.removeEventListener('hashchange', handleNavigation)
  }, [])

  const loadExams = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      setExams(unwrapList(await listExams()))
    } catch {
      setError('No se pudieron cargar los exámenes. Comprueba que la API esté disponible.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { if (page === 'list') loadExams() }, [loadExams, page])

  async function handleCreate(event) {
    event.preventDefault()
    setFormError('')
    setSaving(true)
    try {
      await createExam({ title: title.trim(), description: description.trim() })
      setTitle('')
      setDescription('')
      window.location.hash = '/exams'
    } catch (requestError) {
      const data = requestError.response?.data
      const messages = data && typeof data === 'object'
        ? Object.entries(data).map(([field, value]) => `${field}: ${Array.isArray(value) ? value.join(' ') : value}`)
        : []
      setFormError(messages.join(' · ') || 'No se pudo crear el examen. Comprueba la conexión e inténtalo de nuevo.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    setDeletingId(id)
    setError('')
    try {
      await deleteExam(id)
      await loadExams()
    } catch {
      setError('No se pudo eliminar el examen. Comprueba la conexión y reintenta la operación.')
    } finally {
      setDeletingId(null)
    }
  }

  return <main className="exams-page">
    <header className="exams-header"><p className="exams-kicker">Laboratorio 12 · API REST</p><h1>Exámenes</h1><p>Gestiona los exámenes disponibles en la API del laboratorio 8.</p></header>
    <nav className="page-navigation" aria-label="Exámenes"><a href="#/exams">Listado de exámenes</a><a href="#/exams/new">Nuevo examen</a></nav>
    {page === 'new' ? <section aria-labelledby="create-title"><h2 id="create-title">Crear examen</h2><form className="exam-form" onSubmit={handleCreate} noValidate>
      <label>Nombre del examen<input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Ej. Evaluación parcial" required /></label>
      <label>Descripción<input value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Descripción breve" /></label>
      <button type="submit" disabled={saving}>{saving ? 'Guardando…' : 'Crear examen'}</button>
      {formError && <div className="error-panel form-error" role="alert">{formError}</div>}
    </form></section> : <section aria-labelledby="exam-list-title"><div className="section-heading"><h2 id="exam-list-title">Listado de exámenes</h2><button className="refresh-button" onClick={loadExams} disabled={loading}>Actualizar</button></div>
      {loading ? <div className="skeleton-list" role="status" aria-label="Cargando exámenes">{[1, 2, 3].map((item) => <div className="skeleton-row" key={item}><span /><span /><span /></div>)}</div>
        : error ? <div className="error-panel" role="alert"><p>{error}</p><button onClick={loadExams}>Reintentar</button></div>
          : <div className="table-wrap"><table><thead><tr><th>ID</th><th>Nombre</th><th>Descripción</th><th>Acciones</th></tr></thead><tbody>{exams.map((exam) => <tr key={exam.id}><td>{exam.id}</td><td>{exam.title}</td><td>{exam.description || '—'}</td><td><button className="delete-button" onClick={() => handleDelete(exam.id)} disabled={deletingId !== null} aria-label={`Eliminar ${exam.title}`}>{deletingId === exam.id ? 'Eliminando…' : 'Eliminar'}</button></td></tr>)}</tbody></table>{exams.length === 0 && <p className="empty-state">Todavía no hay exámenes registrados.</p>}</div>}
    </section>}
  </main>
}
