import { loadAllPages } from './loadAllPages.js'
import apiClient from './apiClient.js'

const endpoint = 'products/'

function asFormData(values) {
  if (values instanceof FormData) return values
  const formData = new FormData()
  Object.entries(values).forEach(([key, value]) => {
    if (value !== undefined && value !== null) formData.append(key, value)
  })
  return formData
}

export async function listProducts(params) {
  const { data } = await apiClient.get(endpoint, { params })
  return data
}

export async function getProduct(id) {
  const { data } = await apiClient.get(`${endpoint}${id}/`)
  return data
}

export async function createProduct(product) {
  const { data } = await apiClient.post(endpoint, asFormData(product))
  return data
}

export async function updateProduct(id, product) {
  const { data } = await apiClient.patch(`${endpoint}${id}/`, asFormData(product))
  return data
}

export async function deleteProduct(id) {
  await apiClient.delete(`${endpoint}${id}/`)
}

export function listAllProducts() {
  return loadAllPages(listProducts)
}
