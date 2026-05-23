import api from './api';

function normalizeTopic(topic) {
  return {
    ...topic,
    id: topic.id ?? topic.topicId
  };
}

export async function getTopics() {
  const response = await api.get('/course/topics');
  return response.data.map(normalizeTopic);
}

export async function getTopicById(id) {
  const response = await api.get(`/course/topics/${id}`);
  return normalizeTopic(response.data);
}
