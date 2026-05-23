import api from './api';

export async function getNotes() {
  const response = await api.get('/notes');
  return response.data;
}

export async function getTopicNote(topicId) {
  const response = await api.get(`/notes/topics/${topicId}`);
  return response.data;
}

export async function saveTopicNote(topicId, content) {
  const response = await api.post(`/notes/topics/${topicId}`, { content });
  return response.data;
}

export async function updateNote(noteId, content) {
  const response = await api.put(`/notes/${noteId}`, { content });
  return response.data;
}

export async function deleteTopicNote(topicId) {
  await api.delete(`/notes/topics/${topicId}`);
}

export async function deleteNote(noteId) {
  await api.delete(`/notes/${noteId}`);
}
