import api from './api';

export async function getDailyPlan() {
  const response = await api.get('/daily-plan');
  return response.data;
}
