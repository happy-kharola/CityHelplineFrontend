

export function getToken() {
  return localStorage.getItem("token");
}

export function checkAuth() {
  if (!getToken()) window.location.href = "../pages/login.html";
}

export function logoutUser() {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  window.location.href = "../pages/login.html";
}

export function buildHeaders() {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

export function checkAdminAccess() {
  const token = getToken();
  if (!token) {
    window.location.href = './unauthorized.html';
    return false;
  }
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.role !== 'admin') {
      window.location.href = './unauthorized.html';
      return false;
    }
    return payload;
  } catch {
    window.location.href = './unauthorized.html';
    return false;
  }
}