import api from './api';

export async function getSavedTopics() {
  const response = await api.get('/saved-topics');
  return response.data;
}

export async function saveTopic(topicId) {
  const response = await api.post(`/saved-topics/${topicId}`);
  return response.data;
}

export async function removeSavedTopic(topicId) {
  await api.delete(`/saved-topics/${topicId}`);
}

export async function getSavedTopicStatus(topicId) {
  const response = await api.get(`/saved-topics/${topicId}/status`);
  return response.data.saved;
}
