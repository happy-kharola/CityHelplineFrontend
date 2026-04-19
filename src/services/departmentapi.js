// Functions in this file:
// - fetchDepartments: Fetches all departments
// - createDepartment: Creates a new department
// - updateDepartment: Updates an existing department
// - deleteDepartment: Deletes a department by ID

if (typeof BASE_URL === 'undefined') var BASE_URL = 'http://localhost:5003';
import { buildHeaders } from "../utils/auth.js";

export async function fetchDepartments() {
  const res = await fetch(`${BASE_URL}/api/admin/departments`, {
    headers: buildHeaders()
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Request failed');
  }

  return res.json();
}

export async function createDepartment(data) {
  const res = await fetch(`${BASE_URL}/api/admin/departments`, {
    method: 'POST',
    headers: buildHeaders(),
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Request failed');
  }

  return res.json();
}

export async function updateDepartment(id, data) {
  const res = await fetch(`${BASE_URL}/api/admin/departments/${id}`, {
    method: 'PUT',
    headers: buildHeaders(),
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Request failed');
  }

  return res.json();
}

export async function deleteDepartment(id) {
  const res = await fetch(`${BASE_URL}/api/admin/departments/${id}`, {
    method: 'DELETE',
    headers: buildHeaders()
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Request failed');
  }

  return res.json();
}