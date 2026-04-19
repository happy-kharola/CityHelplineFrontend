// Functions in this file:
// - fetchDashboard: Fetches admin dashboard data
// - fetchAdminComplaints: Retrieves complaints with optional filters
// - assignDepartment: Assigns a department to a complaint
// - updateComplaintStatus: Updates the status of a complaint

import { buildHeaders } from "../utils/auth.js";

if (typeof BASE_URL === 'undefined') var BASE_URL = 'http://localhost:5003';

export async function fetchDashboard() {
  const res = await fetch(`${BASE_URL}/api/admin/dashboard`, {
    headers: buildHeaders()
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Request failed');
  }

  return res.json();
}
export async function fetchAdminComplaints(params = {}) {
  const query = new URLSearchParams();
  if (params.status) query.set('status', params.status);
  if (params.department) query.set('department', params.department);
  if (params.limit) query.set('limit', params.limit);
  if (params.offset) query.set('offset', params.offset);
  const res = await fetch(`${BASE_URL}/api/admin/complaints?${query}`, {
    headers: buildHeaders()
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Request failed');
  }

  return res.json();
}

export async function assignDepartment(complaintId, departmentId) {
  const res = await fetch(`${BASE_URL}/api/admin/complaints/${complaintId}/assign`, {
    method: 'PATCH',
    headers: buildHeaders(),
    body: JSON.stringify({ departmentId })
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Request failed');
  }

  return res.json();
}

export async function updateComplaintStatus(complaintId, status) {
  const res = await fetch(`${BASE_URL}/api/admin/complaints/${complaintId}/status`, {
    method: 'PATCH',
    headers: buildHeaders(),
    body: JSON.stringify({ status })
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Request failed');
  }

  return res.json();
}