import { API_BASE } from "../js/config.js";
import { getToken } from "../utils/auth.js";

// API_BASE = "http://localhost:3000"  (no trailing /api)
// So all paths below start with /api/...

function buildHeaders() {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

/**
 * GET /api/complaints  — public, no token required
 * Returns enriched array of all complaints.
 * DB fields: complaint_id, lattitude, longitude, location,
 *            description, status, category_id, image_url, created_at
 */
export async function fetchComplaints() {
  const res = await fetch(`${API_BASE}/api/complaints`);

  if (!res.ok) {
    throw new Error(`Failed to fetch complaints: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  // enrichComplaintList returns a plain array
  return Array.isArray(data) ? data : data.complaints || [];
}

/**
 * GET /api/complaints/:id  — public
 */
export async function fetchComplaintById(id) {
  const res = await fetch(`${API_BASE}/api/complaints/${id}`);

  if (!res.ok) throw new Error(`Complaint not found: ${res.status}`);
  return await res.json();
}

/**
 * POST /api/complaints  — requires token + multipart image (image is mandatory on server)
 *
 * Server expects: lat, long, description, category_id  +  image (file)
 * Note: server field is "long" not "lng", and "lattitude" (typo) in DB
 *       but the POST body key the controller reads is "long".
 *
 * @param {{ lat: number, long: number, description: string, category_id: string|number }} complaintData
 * @param {File} imageFile  — required by server (postComplaintWithImage)
 */
export async function fileComplaint(complaintData, imageFile) {
  if (!imageFile) throw new Error("An evidence photo is required.");

  const token = getToken();
  const formData = new FormData();

  // Append each field individually so multer + req.body can read them
  Object.entries(complaintData).forEach(([key, value]) => {
    formData.append(key, value);
  });

  // Field name must match what parseComplaintImageUpload (multer) expects
  formData.append("image", imageFile, imageFile.name);

  const res = await fetch(`${API_BASE}/api/complaints`, {
    method: "POST",
    headers: {
      // DO NOT set Content-Type — browser sets multipart boundary automatically
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (res.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "login.html";
    return null;
  }

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `Error ${res.status}`);
  return data;
}

/**
 * PATCH /api/complaints/:id/status  — admin only
 * Status enum: pending → underReview → inProgress → resolved
 * Server enforces forward-only, one-step-at-a-time progression.
 */
export async function updateComplaintStatus(complaintId, newStatus) {
  const res = await fetch(`${API_BASE}/api/complaints/${complaintId}/status`, {
    method: "PATCH",
    headers: buildHeaders(),
    body: JSON.stringify({ status: newStatus }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `Error ${res.status}`);
  return data;
}

/**
 * DELETE /api/complaints/:id  — owner only
 */
export async function deleteComplaint(complaintId) {
  const res = await fetch(`${API_BASE}/api/complaints/${complaintId}`, {
    method: "DELETE",
    headers: buildHeaders(),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `Error ${res.status}`);
  return data;
}