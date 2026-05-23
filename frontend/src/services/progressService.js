import api from './api';

export async function getProgress() {
  const response = await api.get('/course');
  return response.data;
}

export async function getCourses() {
  const response = await api.get('/courses');
  return response.data;
}

export async function getCourse(courseId) {
  const response = await api.get(`/courses/${courseId}`);
  return response.data;
}

export async function getCourseProgress(courseId) {
  const response = await api.get(`/courses/${courseId}/progress`);
  return response.data;
}

export async function markTopicCompleted(topicId) {
  const response = await api.post(`/course/topics/${topicId}/complete`);
  return response.data;
}

export async function getCourseTopics(status = 'all') {
  const path = status === 'all' ? '/course/topics' : `/course/topics/${status}`;
  const response = await api.get(path);
  return response.data;
}

export async function getCourseTopicsById(courseId, status = 'all') {
  const path = status === 'all' ? `/courses/${courseId}/topics` : `/courses/${courseId}/topics/${status}`;
  const response = await api.get(path);
  return response.data;
}
