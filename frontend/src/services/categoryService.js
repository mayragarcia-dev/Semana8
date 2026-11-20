import apiClient from './apiClient.js'

const endpoint = 'categories/'

export async function listCategories(params) {
  const { data } = await apiClient.get(endpoint, { params })
  return data
}

export async function getCategory(id) {
  const { data } = await apiClient.get(`${endpoint}${id}/`)
  return data
}

export async function createCategory(category) {
  const { data } = await apiClient.post(endpoint, category)
  return data
}

export async function updateCategory(id, category) {
  const { data } = await apiClient.patch(`${endpoint}${id}/`, category)
  return data
}

export async function deleteCategory(id) {
  await apiClient.delete(`${endpoint}${id}/`)
}
