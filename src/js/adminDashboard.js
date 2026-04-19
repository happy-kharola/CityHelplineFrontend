import { checkAdminAccess, logoutUser } from "../utils/auth.js";
import {fetchAdminComplaints, fetchDashboard } from "../services/adminapi.js";

document.getElementById('logout-btn').addEventListener('click', logoutUser);

document.addEventListener('DOMContentLoaded', async () => {
  const user = checkAdminAccess();
  if (!user) return;

  document.getElementById('nav-user').textContent = user.email || 'Admin';

  const container = document.getElementById('dashboard-content');

  function showLoading() {
    container.innerHTML = `<div class="loading"><div class="spinner"></div>Loading dashboard...</div>`;
  }

  function showError(msg) {
    container.innerHTML = `<div class="alert alert-error">⚠ ${msg}</div>`;
  }

  function formatDate(dateStr) {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
  }

  function renderWorkload(departments) {
    if (!departments || departments.length === 0) return '<p style="color:var(--text2);font-size:13px;">No data</p>';
    const max = Math.max(...departments.map(d => d.count || 0), 1);
    return departments.map(d => `
      <div class="workload-item">
        <div class="workload-header">
          <span class="workload-name">${d.name || d.department || 'Unknown'}</span>
          <span class="workload-count">${d.count || 0} complaints</span>
        </div>
        <div class="workload-bar-bg">
          <div class="workload-bar-fill" style="width:${Math.round((d.count || 0) / max * 100)}%"></div>
        </div>
      </div>
    `).join('');
  }

  function renderActivity(activities) {
    if (!activities || activities.length === 0) return '<div class="empty-state"><div class="empty-state-text">No recent activity</div></div>';
    return activities.map(a => `
      <div class="activity-item">
        <div class="activity-dot"></div>
        <div>
          <div class="activity-text">${a.description || a.action || 'Activity recorded'}</div>
          <div class="activity-time">${formatDate(a.createdAt || a.timestamp)}</div>
        </div>
      </div>
    `).join('');
  }

  showLoading();

try {
  const data = await fetchDashboard();

  const d = data.data || data;
  const totals = d.totals || {};
  const departments = d.departmentWorkload || d.departments || [];
  const activity = d.recentActivity || d.activity || [];

  container.innerHTML = `...`; // keep your existing HTML


  container.innerHTML = `
    <div class="stats-grid">
      <div class="stat-card pending">
        <div class="stat-label">Pending</div>
        <div class="stat-value">${totals.pending ?? 0}</div>
      </div>
      <div class="stat-card underReview">
        <div class="stat-label">Under Review</div>
        <div class="stat-value">${totals.underReview ?? 0}</div>
      </div>
      <div class="stat-card inProgress">
        <div class="stat-label">In Progress</div>
        <div class="stat-value">${totals.inProgress ?? 0}</div>
      </div>
      <div class="stat-card resolved">
        <div class="stat-label">Resolved</div>
        <div class="stat-value">${totals.resolved ?? 0}</div>
      </div>
    </div>

    <div class="grid-2">
      <div class="card">
        <div class="card-title">Department Workload</div>
        ${renderWorkload(departments)}
      </div>
      <div class="card">
        <div class="card-title">Recent Activity</div>
        ${renderActivity(activity)}
      </div>
    </div>
  `;

  } catch (err) {
      showError(err.message);
    }
});