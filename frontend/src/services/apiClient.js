import axios from 'axios'

export const API_BASE_URL = 'http://127.0.0.1:8000/api/'
const api = axios.create({ baseURL: API_BASE_URL, timeout: 10000 })

export async function listExams() {
  const { data } = await api.get('exams/')
  return data
}

export async function createExam(exam) {
  const { data } = await api.post('exams/', exam)
  return data
}

export async function deleteExam(id) {
  await api.delete(`exams/${id}/`)
}
