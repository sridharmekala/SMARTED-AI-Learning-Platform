import api from './api';

export async function getCertificate(courseId) {
  const response = await api.get(`/courses/${courseId}/certificate`);
  return response.data;
}
