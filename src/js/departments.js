import { checkAdminAccess, logoutUser } from "../utils/auth.js";
import { fetchDepartments, createDepartment, updateDepartment, deleteDepartment } from "../services/departmentapi.js"


document.getElementById('logout-btn').addEventListener('click',logoutUser);
let editingId = null;

document.addEventListener('DOMContentLoaded', async () => {
  const user = checkAdminAccess();
  if (!user) return;
  document.getElementById('nav-user').textContent = user.email || 'Admin';

  await loadDepartments();

  document.getElementById('btn-add-dept').addEventListener('click', () => openModal(null));
  document.getElementById('modal-cancel').addEventListener('click', closeModal);
  document.getElementById('dept-form').addEventListener('submit', onSubmitForm);
  document.getElementById('modal-overlay').addEventListener('click', (e) => {
    if (e.target === document.getElementById('modal-overlay')) closeModal();
  });
});

async function loadDepartments() {
  const list = document.getElementById('dept-list');
  list.innerHTML = `<div class="loading"><div class="spinner"></div>Loading departments...</div>`;

  try {
    const data = await fetchDepartments();

    const departments = data || [];

    document.getElementById('dept-count').textContent = `${departments.length} total`;

    if (departments.length === 0) {
      list.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">🏛</div>
          <div class="empty-state-text">No departments yet. Add one above.</div>
        </div>`;
      return;
    }

    list.innerHTML = departments.map(d => `
      <div class="dept-item">
        <div>
          <div class="dept-name">${d.name}</div>
          ${d.description ? `<div class="dept-meta">${d.description}</div>` : ''}
          ${d.headEmail ? `<div class="dept-meta">📧 ${d.headEmail}</div>` : ''}
        </div>
        <div class="dept-actions">
          <button class="btn btn-sm btn-secondary" onclick="openModal(${JSON.stringify(d).replace(/"/g, '&quot;')})">Edit</button>
          <button class="btn btn-sm btn-danger" onclick="doDelete(${d.id}, '${d.name.replace(/'/g, "\\'")}')">Delete</button>
        </div>
      </div>
    `).join('');

  } catch (err) {
   showErr(err.message);
  }
}
function openModal(dept) {
  editingId = dept ? dept.id : null;
  document.getElementById('modal-title').textContent = dept ? 'Edit Department' : 'Add Department';
  document.getElementById('field-name').value = dept ? dept.name : '';
  document.getElementById('field-desc').value = dept ? (dept.description || '') : '';
  document.getElementById('field-head').value = dept ? (dept.headEmail || '') : '';
  document.getElementById('form-msg').innerHTML = '';
  document.getElementById('modal-overlay').style.display = 'flex';
  document.getElementById('field-name').focus();
}

function closeModal() {
  document.getElementById('modal-overlay').style.display = 'none';
  editingId = null;
}

async function onSubmitForm(e) {
  e.preventDefault();
  const name = document.getElementById('field-name').value.trim();
  const description = document.getElementById('field-desc').value.trim();
  const headEmail = document.getElementById('field-head').value.trim();

  if (!name) {
    document.getElementById('form-msg').innerHTML = `<div class="alert alert-error">Name is required</div>`;
    return;
  }

  const payload = { name };
  if (description) payload.description = description;
  if (headEmail) payload.headEmail = headEmail;

  const submitBtn = document.getElementById('modal-submit');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Saving...';

  let data;
  if (editingId) {
    data = await updateDepartment(editingId, payload);
  } else {
    data = await createDepartment(payload);
  }

  submitBtn.disabled = false;
  submitBtn.textContent = 'Save';

  if (!data.success) {
    document.getElementById('form-msg').innerHTML = `<div class="alert alert-error">⚠ ${data.message || 'Save failed'}</div>`;
    return;
  }

  closeModal();
  await loadDepartments();
  showToast(editingId ? 'Department updated' : 'Department added', 'success');
}

async function doDelete(id, name) {
  if (!confirm(`Delete department "${name}"? This cannot be undone.`)) return;
  const data = await deleteDepartment(id);
  if (!data.success) {
    showToast(data.message || 'Delete failed', 'error');
  } else {
    showToast('Department deleted', 'success');
    await loadDepartments();
  }
}

function showToast(msg, type) {
  const existing = document.getElementById('toast');
  if (existing) existing.remove();
  const t = document.createElement('div');
  t.id = 'toast';
  t.className = `alert alert-${type === 'error' ? 'error' : 'success'}`;
  t.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:9999;min-width:260px;box-shadow:var(--shadow);';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3500);
}