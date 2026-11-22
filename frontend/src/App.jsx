import { useEffect, useState } from 'react'
import CatalogPage from './components/CatalogPage.jsx'
import ExamManagement from './components/ExamManagement.jsx'
import ProductFormPage from './components/ProductFormPage.jsx'
import './styles/catalog.css'

export default function App() {
  const [route, setRoute] = useState(window.location.hash)

  useEffect(() => {
    const syncRoute = () => setRoute(window.location.hash)
    window.addEventListener('hashchange', syncRoute)
    return () => window.removeEventListener('hashchange', syncRoute)
  }, [])

  const isExams = route.startsWith('#/exams')
  const productId = /^#\/catalog\/(\d+)\/edit$/.exec(route)?.[1]
  const isProductForm = route === '#/catalog/new' || Boolean(productId)

  let page = <CatalogPage />
  if (isExams) page = <ExamManagement />
  if (isProductForm) page = <ProductFormPage key={route} productId={productId} />

  return (
    <div className="catalog-shell">
      <nav className="workspace-nav" aria-label="Secciones del laboratorio">
        <a className={isExams ? '' : 'active'} href="#/catalog">Catálogo</a>
        <a className={isExams ? 'active' : ''} href="#/exams">Exámenes</a>
      </nav>
      {page}
    </div>
  )
}
