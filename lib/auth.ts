

export async function checkUserSession() {
  const response = await fetch("/api/auth/check-session", {
    method: "GET",
    credentials: "include",
  });
  const data = await response.json();
  if (!response.ok) {
    return null;
  }
  return data;
}

export const handleLogoutFunction = async () => {

  const response = await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include",
  });
  if (!response.ok) {
    return false;
  }
  return true;
};
