import { useEffect, useState } from 'react'
import CatalogPage from './components/CatalogPage.jsx'
import ExamManagement from './components/ExamManagement.jsx'
import './styles/catalog.css'

export default function App() {
  const [section, setSection] = useState(window.location.hash.startsWith('#/exams') ? 'exams' : 'catalog')

  useEffect(() => {
    const syncSection = () => setSection(window.location.hash.startsWith('#/exams') ? 'exams' : 'catalog')
    window.addEventListener('hashchange', syncSection)
    return () => window.removeEventListener('hashchange', syncSection)
  }, [])

  return <div className="catalog-shell">
    <nav className="workspace-nav" aria-label="Secciones del laboratorio">
      <a className={section === 'catalog' ? 'active' : ''} href="#/catalog">Catálogo</a>
      <a className={section === 'exams' ? 'active' : ''} href="#/exams">Exámenes</a>
    </nav>
    {section === 'exams' ? <ExamManagement /> : <CatalogPage />}
  </div>
}
