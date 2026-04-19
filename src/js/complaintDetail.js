import { checkAdminAccess } from "../utils/auth";
import { fetchAdminComplaints, fetchComplaintById, updateComplaintStatus, assignDepartment } from "../services/adminapi";

let complaintData = null;
let allDepartments = [];

document.addEventListener('DOMContentLoaded', async () => {
  const user = checkAdminAccess();
  if (!user) return;
  document.getElementById('nav-user').textContent = user.email || 'Admin';

  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (!id) {
    window.location.href = '/404.html';
    return;
  }

  await loadDepartments();
  await loadComplaint(id);
});

async function loadDepartments() {
  const data = await fetchDepartments();
  if (data.success) {
    allDepartments = data.data || data.departments || [];
  }
}

async function loadComplaint(id) {
  const container = document.getElementById('detail-content');
  container.innerHTML = `<div class="loading"><div class="spinner"></div>Loading complaint...</div>`;

  const data = await fetchComplaintById(id);

  if (!data.success) {
    container.innerHTML = `<div class="alert alert-error">⚠ ${data.message || 'Failed to load complaint'}</div>`;
    return;
  }

  complaintData = data.data || data.complaint || data;
  renderDetail(complaintData);
}

function renderDetail(c) {
  const container = document.getElementById('detail-content');
  const flow = ['pending', 'underReview', 'inProgress', 'resolved'];
  const idx = flow.indexOf(c.status);
  const nextStatus = flow[idx + 1];

  document.getElementById('detail-title').textContent = `Complaint #${c.id}`;

  container.innerHTML = `
    <div class="detail-grid">
      <div>
        <div class="card section">
          <div class="card-title">Complaint Information</div>
          <div class="grid-2">
            <div class="detail-field">
              <div class="detail-label">ID</div>
              <div class="detail-value mono">#${c.id}</div>
            </div>
            <div class="detail-field">
              <div class="detail-label">Category</div>
              <div class="detail-value">${c.category || '—'}</div>
            </div>
            <div class="detail-field">
              <div class="detail-label">Status</div>
              <div class="detail-value"><span class="badge badge-${c.status}">${formatStatus(c.status)}</span></div>
            </div>
            <div class="detail-field">
              <div class="detail-label">Priority</div>
              <div class="detail-value"><span class="badge badge-${c.priority?.toLowerCase()}">${c.priority || '—'}</span></div>
            </div>
            <div class="detail-field">
              <div class="detail-label">Department</div>
              <div class="detail-value">${c.departmentName || c.department?.name || '—'}</div>
            </div>
            <div class="detail-field">
              <div class="detail-label">Validation Status</div>
              <div class="detail-value">
                <span class="badge ${c.validationStatus === 'valid' ? 'badge-resolved' : c.validationStatus === 'invalid' ? 'badge-high' : 'badge-pending'}">
                  ${c.validationStatus || 'Pending'}
                </span>
              </div>
            </div>
            <div class="detail-field" style="grid-column:1/-1">
              <div class="detail-label">Location / Address</div>
              <div class="detail-value">${c.location || c.address || '—'}</div>
            </div>
            ${c.latitude && c.longitude ? `
            <div class="detail-field">
              <div class="detail-label">Latitude</div>
              <div class="detail-value mono">${c.latitude}</div>
            </div>
            <div class="detail-field">
              <div class="detail-label">Longitude</div>
              <div class="detail-value mono">${c.longitude}</div>
            </div>` : ''}
            <div class="detail-field" style="grid-column:1/-1">
              <div class="detail-label">Description</div>
              <div class="detail-value" style="line-height:1.7;">${c.description || '—'}</div>
            </div>
            <div class="detail-field">
              <div class="detail-label">Submitted</div>
              <div class="detail-value mono">${formatDate(c.createdAt)}</div>
            </div>
            <div class="detail-field">
              <div class="detail-label">Updated</div>
              <div class="detail-value mono">${formatDate(c.updatedAt)}</div>
            </div>
          </div>
        </div>

        ${c.imageUrl || c.image ? `
        <div class="card section">
          <div class="card-title">Attached Image</div>
          <img src="${c.imageUrl || c.image}" alt="Complaint image" class="complaint-image"
               onerror="this.parentElement.style.display='none'">
        </div>` : ''}
      </div>

      <div>
        <div class="card section">
          <div class="card-title">Admin Actions</div>

          <div id="action-msg"></div>

          <div class="form-group">
            <label>Assign Department</label>
            <select id="assign-dept" style="margin-bottom:8px;">
              <option value="">Select department...</option>
              ${allDepartments.map(d => `<option value="${d.id}" ${c.departmentId == d.id ? 'selected' : ''}>${d.name}</option>`).join('')}
            </select>
            <button class="btn btn-primary" style="width:100%" onclick="doAssign()">Assign Department</button>
          </div>

          ${nextStatus ? `
          <div class="form-group" style="border-top:1px solid var(--border);padding-top:16px;margin-top:8px;">
            <label>Update Status</label>
            <div class="alert alert-info" style="margin-bottom:12px;font-size:12px;">
              Next step: <strong>${formatStatus(nextStatus)}</strong>
            </div>
            <button class="btn btn-primary" style="width:100%;background:var(--success);" onclick="doUpdateStatus('${nextStatus}')">
              Move to ${formatStatus(nextStatus)}
            </button>
          </div>` : `
          <div style="border-top:1px solid var(--border);padding-top:16px;margin-top:8px;">
            <div class="alert alert-success">✓ This complaint is fully resolved</div>
          </div>`}
        </div>

        ${c.submittedBy || c.user ? `
        <div class="card section">
          <div class="card-title">Submitted By</div>
          <div class="detail-field">
            <div class="detail-label">Name</div>
            <div class="detail-value">${c.submittedBy?.name || c.user?.name || '—'}</div>
          </div>
          <div class="detail-field">
            <div class="detail-label">Email</div>
            <div class="detail-value">${c.submittedBy?.email || c.user?.email || '—'}</div>
          </div>
        </div>` : ''}
      </div>
    </div>
  `;
}

async function doAssign() {
  const deptId = document.getElementById('assign-dept').value;
  if (!deptId) { showActionMsg('Please select a department', 'error'); return; }
  const data = await assignDepartment(complaintData.id, deptId);
  if (!data.success) {
    showActionMsg(data.message || 'Assignment failed', 'error');
  } else {
    showActionMsg('Department assigned successfully', 'success');
    await loadComplaint(complaintData.id);
  }
}

async function doUpdateStatus(status) {
  const data = await updateComplaintStatus(complaintData.id, status);
  if (!data.success) {
    showActionMsg(data.message || 'Status update failed', 'error');
  } else {
    showActionMsg(`Status updated to ${formatStatus(status)}`, 'success');
    await loadComplaint(complaintData.id);
  }
}

function showActionMsg(msg, type) {
  const el = document.getElementById('action-msg');
  if (!el) return;
  el.innerHTML = `<div class="alert alert-${type === 'error' ? 'error' : 'success'}" style="margin-bottom:12px;">${msg}</div>`;
  setTimeout(() => { el.innerHTML = ''; }, 4000);
}

function formatStatus(s) {
  const map = { pending: 'Pending', underReview: 'Under Review', inProgress: 'In Progress', resolved: 'Resolved' };
  return map[s] || s;
}

function formatDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
}