import api from './api';

export async function sendChatMessage(message) {
  const response = await api.post('/chat', { message });
  return response.data;
}

export async function getChatHistory() {
  const response = await api.get('/chat/history');
  return response.data;
}

export async function clearChatHistory() {
  await api.delete('/chat/history');
}
