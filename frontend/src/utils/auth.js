export const TOKEN_KEY = "dmc_admin_token";
export const USER_KEY = "dmc_admin_user";

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const setAuth = (user, token) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const getAuthUser = () => {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
};

export const getPermissions = () => getAuthUser()?.permissions || [];

export const hasPermission = (permission) => {
  const user = getAuthUser();
  const permissions = user?.permissions || [];
  const roleName = user?.role?.name || user?.roleName;

  return roleName === "admin" || permissions.includes(permission);
};
