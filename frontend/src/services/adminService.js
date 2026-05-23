import api from './api';

export async function getAdminCourses() {
  const response = await api.get('/admin/courses');
  return response.data;
}

export async function addCourse(payload) {
  const response = await api.post('/admin/courses', payload);
  return response.data;
}

export async function updateCourse(courseId, payload) {
  const response = await api.put(`/admin/courses/${courseId}`, payload);
  return response.data;
}

export async function deleteCourse(courseId) {
  await api.delete(`/admin/courses/${courseId}`);
}

export async function addTopic(payload) {
  const response = await api.post('/admin/topics', payload);
  return response.data;
}

export async function addCourseTopic(courseId, payload) {
  const response = await api.post(`/admin/courses/${courseId}/topics`, payload);
  return response.data;
}

export async function getAdminCourseTopics(courseId) {
  const response = await api.get(`/admin/courses/${courseId}/topics`);
  return response.data;
}

export async function updateTopic(topicId, payload) {
  const response = await api.put(`/admin/topics/${topicId}`, payload);
  return response.data;
}

export async function deleteTopic(topicId) {
  await api.delete(`/admin/topics/${topicId}`);
}

export async function getAdminQuizQuestions() {
  const response = await api.get('/admin/quiz-questions');
  return response.data;
}

export async function addQuizQuestion(payload) {
  const response = await api.post('/admin/quiz-questions', payload);
  return response.data;
}

export async function addTopicQuestion(topicId, payload) {
  const response = await api.post(`/admin/topics/${topicId}/questions`, payload);
  return response.data;
}

export async function updateQuestion(questionId, payload) {
  const response = await api.put(`/admin/questions/${questionId}`, payload);
  return response.data;
}

export async function deleteQuestion(questionId) {
  await api.delete(`/admin/questions/${questionId}`);
}

export async function getStudents() {
  const response = await api.get('/admin/students');
  return response.data;
}

export async function addStudent(payload) {
  const response = await api.post('/admin/students', payload);
  return response.data;
}

export async function getStudent(studentId) {
  const response = await api.get(`/admin/students/${studentId}`);
  return response.data;
}

export async function updateStudent(studentId, payload) {
  const response = await api.put(`/admin/students/${studentId}`, payload);
  return response.data;
}

export async function deleteStudent(studentId) {
  await api.delete(`/admin/students/${studentId}`);
}

export async function resetStudentPassword(studentId, newPassword) {
  const response = await api.put(`/admin/students/${studentId}/reset-password`, { newPassword });
  return response.data;
}

export async function getStudentProgress(studentId) {
  const response = await api.get(`/admin/students/${studentId}/progress`);
  return response.data;
}

export async function getStudentScores(studentId) {
  const response = await api.get(`/admin/students/${studentId}/scores`);
  return response.data;
}
