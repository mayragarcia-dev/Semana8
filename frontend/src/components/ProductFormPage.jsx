import { useEffect, useRef, useState } from 'react'
import { listAllCategories } from '../services/categoryService.js'
import { createProduct, getProduct, updateProduct } from '../services/productService.js'
import '../styles/product-form.css'

const emptyProduct = { name: '', description: '', price: '', stock: '', category_id: '' }
const fieldLabels = {
  name: 'Nombre',
  description: 'Descripción',
  price: 'Precio',
  stock: 'Existencias',
  category_id: 'Categoría',
  image: 'Imagen',
}

export default function ProductFormPage({ productId }) {
  const [values, setValues] = useState(emptyProduct)
  const [categories, setCategories] = useState([])
  const [currentImage, setCurrentImage] = useState('')
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [attempt, setAttempt] = useState(0)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const active = useRef(false)
  const isEditing = Boolean(productId)

  useEffect(() => {
    active.current = true
    return () => { active.current = false }
  }, [])

  useEffect(() => {
    let ignore = false

    async function loadForm() {
      setLoading(true)
      setLoadError('')
      try {
        const [categoryList, product] = await Promise.all([
          listAllCategories(),
          productId ? getProduct(productId) : null,
        ])
        if (ignore) return
        setCategories(categoryList)
        if (product) {
          setValues({
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
            category_id: String(product.category.id),
          })
          setCurrentImage(product.image)
        }
      } catch (error) {
        if (ignore) return
        setLoadError(error.response?.status === 404
          ? 'El producto ya no está disponible.'
          : 'No se pudo cargar el formulario. Comprueba que la API esté disponible.')
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadForm()
    return () => { ignore = true }
  }, [attempt, productId])

  function handleChange(event) {
    const { name, value } = event.target
    setValues((previous) => ({ ...previous, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const name = values.name.trim()
    if (!name) {
      setSaveError('Escribe un nombre para el producto.')
      return
    }

    const payload = { ...values, name, description: values.description.trim() }
    if (image) payload.image = image

    setSaveError('')
    setSaving(true)
    const submittedRoute = window.location.hash
    try {
      if (isEditing) await updateProduct(productId, payload)
      else await createProduct(payload)

      if (active.current && window.location.hash === submittedRoute) {
        window.location.hash = '/catalog'
      }
    } catch (error) {
      const details = error.response?.data
      const messages = details && typeof details === 'object'
        ? Object.entries(details).map(([field, value]) => {
          const message = Array.isArray(value) ? value.join(' ') : value
          return fieldLabels[field] ? `${fieldLabels[field]}: ${message}` : message
        }).join(' ')
        : ''

      if (active.current) setSaveError(messages || 'No se pudo guardar el producto. Inténtalo de nuevo.')
    } finally {
      if (active.current) setSaving(false)
    }
  }

  return (
    <main className="catalog-page product-form-page">
      <header className="catalog-hero">
        <div>
          <h1>{isEditing ? 'Editar producto' : 'Nuevo producto'}</h1>
        </div>
        <a href="#/catalog">Volver al catálogo</a>
      </header>
      {loading && <p role="status">Cargando formulario…</p>}
      {loadError && (
        <div className="catalog-error" role="alert">
          <p>{loadError}</p>
          <button type="button" onClick={() => setAttempt((previous) => previous + 1)}>Reintentar</button>
        </div>
      )}
      {!loading && !loadError && (
        <form className="product-form" onSubmit={handleSubmit}>
          <fieldset disabled={saving}>
            <label>
              Nombre
              <input name="name" value={values.name} onChange={handleChange} maxLength={180} required />
            </label>
            <label>
              Descripción
              <textarea name="description" value={values.description} onChange={handleChange} rows={4} />
            </label>
            <div className="product-form-numbers">
              <label>
                Precio (S/)
                <input name="price" type="number" step="0.01" min="0" max="99999999.99" value={values.price} onChange={handleChange} required />
              </label>
              <label>
                Existencias
                <input name="stock" type="number" step="1" min="0" value={values.stock} onChange={handleChange} required />
              </label>
            </div>
            <label>
              Categoría
              <select name="category_id" value={values.category_id} onChange={handleChange} required>
                <option value="">Selecciona una categoría</option>
                {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
              </select>
            </label>
            {categories.length === 0 && <p>No hay categorías disponibles. Registra una antes de guardar un producto.</p>}
            <label>
              {isEditing ? 'Cambiar imagen (opcional)' : 'Imagen'}
              <input name="image" type="file" accept="image/*" onChange={(event) => setImage(event.target.files[0] ?? null)} required={!isEditing} />
            </label>
            {currentImage && <img className="product-form-current-image" src={currentImage} alt="Imagen actual del producto" />}
          </fieldset>
          {saveError && <p className="catalog-error" role="alert">{saveError}</p>}
          <button className="catalog-refresh" type="submit" disabled={saving || categories.length === 0}>
            {saving ? 'Guardando…' : isEditing ? 'Guardar cambios' : 'Crear producto'}
          </button>
        </form>
      )}
    </main>
  )
}
