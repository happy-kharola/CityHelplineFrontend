

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