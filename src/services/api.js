import { apiFetch } from '../api/client';

export async function getPatientRecords() {
  return await apiFetch('/patients');
}
// Other API service methods here