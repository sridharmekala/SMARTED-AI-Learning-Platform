import api from './api';

export async function getQuizByTopicId(topicId) {
  const response = await api.get(`/quiz/${topicId}`);
  return response.data;
}

export async function submitQuiz(payload) {
  const response = await api.post('/quiz/submit', payload);
  return response.data;
}
