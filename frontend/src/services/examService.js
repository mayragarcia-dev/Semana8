import api from './apiClient.js'

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
