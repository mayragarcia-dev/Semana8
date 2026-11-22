import { useCallback, useEffect, useState } from 'react'
import { listAllCategories } from '../services/categoryService.js'
import { deleteProduct, listAllProducts } from '../services/productService.js'

export default function CatalogPage() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [categoryId, setCategoryId] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  async function removeProduct(product) {
    if (!window.confirm(`¿Eliminar «${product.name}»?`)) return

    setDeleting(true)
    setDeleteError('')
    try {
      await deleteProduct(product.id)
      setProducts((current) => current.filter((item) => item.id !== product.id))
    } catch {
      setDeleteError('No se pudo eliminar el producto. Inténtalo de nuevo.')
    } finally {
      setDeleting(false)
    }
  }

  const loadProducts = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [productList, categoryList] = await Promise.all([
        listAllProducts(),
        listAllCategories(),
      ])
      setProducts(productList)
      setCategories(categoryList)
    } catch {
      setError('No se pudo cargar el catálogo. Comprueba que la API esté activa e inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadProducts() }, [loadProducts])

  const visibleProducts = categoryId
    ? products.filter((product) => String(product.category?.id) === categoryId)
    : products

  return <main className="catalog-page">
    <header className="catalog-hero">
      <div><p className="catalog-eyebrow">Catálogo · Laboratorio</p><h1>Productos</h1><p>Explora los productos organizados por categoría.</p></div>
      <div className="catalog-actions">
        <button className="catalog-refresh" onClick={loadProducts} disabled={loading || deleting}>Actualizar</button>
        <a className="catalog-refresh" href="#/catalog/new">Nuevo producto</a>
      </div>
    </header>
    <label className="catalog-filter">
      Categoría
      <select value={categoryId} onChange={(event) => setCategoryId(event.target.value)} disabled={loading || Boolean(error)}>
        <option value="">Todas las categorías</option>
        {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
      </select>
    </label>
    {deleteError && <p className="catalog-error" role="alert">{deleteError}</p>}
    {loading ? <section className="catalog-grid" aria-label="Cargando productos" role="status">{[1, 2, 3, 4].map((item) => <div className="product-skeleton" key={item}><div /><span /><span /></div>)}</section>
      : error ? <section className="catalog-error" role="alert"><p>{error}</p><button onClick={loadProducts}>Reintentar</button></section>
        : visibleProducts.length ? <section className="catalog-grid" aria-label="Listado de productos">{visibleProducts.map((product) => <article className="product-card" key={product.id}>
          <img className="product-image" src={product.image} alt={product.name} />
          <div className="product-copy"><p className="product-category">{product.category?.name ?? 'Sin categoría'}</p><h2>{product.name}</h2><p className="product-description">{product.description}</p><p className="category-description">{product.category?.description}</p>
            <footer className="product-meta"><strong>S/ {Number(product.price).toFixed(2)}</strong><span>{product.stock} disponibles</span></footer>
            <div className="product-actions">
              <a href={`#/catalog/${product.id}/edit`}>Editar</a>
              <button type="button" disabled={deleting} onClick={() => removeProduct(product)}>Eliminar</button>
            </div>
          </div>
        </article>)}</section> : <p className="catalog-empty">{categoryId ? 'No hay productos en esta categoría.' : 'No hay productos registrados.'}</p>}
  </main>
}


