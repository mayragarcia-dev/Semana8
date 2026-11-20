import { useCallback, useEffect, useState } from 'react'
import { listProducts } from '../services/productService.js'

function unwrapList(payload) {
  return Array.isArray(payload) ? payload : payload?.results ?? []
}

export default function CatalogPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadProducts = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      setProducts(unwrapList(await listProducts()))
    } catch {
      setError('No se pudo cargar el catálogo. Comprueba que la API esté activa e inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadProducts() }, [loadProducts])

  return <main className="catalog-page">
    <header className="catalog-hero">
      <div><p className="catalog-eyebrow">Catálogo · Laboratorio</p><h1>Productos</h1><p>Explora los productos organizados por categoría.</p></div>
      <button className="catalog-refresh" onClick={loadProducts} disabled={loading}>Actualizar</button>
    </header>
    {loading ? <section className="catalog-grid" aria-label="Cargando productos" role="status">{[1, 2, 3, 4].map((item) => <div className="product-skeleton" key={item}><div /><span /><span /></div>)}</section>
      : error ? <section className="catalog-error" role="alert"><p>{error}</p><button onClick={loadProducts}>Reintentar</button></section>
        : products.length ? <section className="catalog-grid" aria-label="Listado de productos">{products.map((product) => <article className="product-card" key={product.id}>
          <img className="product-image" src={product.image} alt={product.name} />
          <div className="product-copy"><p className="product-category">{product.category?.name ?? 'Sin categoría'}</p><h2>{product.name}</h2><p className="product-description">{product.description}</p><p className="category-description">{product.category?.description}</p>
            <footer className="product-meta"><strong>S/ {Number(product.price).toFixed(2)}</strong><span>{product.stock} disponibles</span></footer>
          </div>
        </article>)}</section> : <p className="catalog-empty">No hay productos registrados.</p>}
  </main>
}
