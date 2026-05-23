import api from './api';

export async function searchLearningContent(query) {
  const response = await api.get('/search', {
    params: { q: query }
  });
  return response.data;
}
