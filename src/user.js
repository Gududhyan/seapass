export const getUser = () => {
  try { return JSON.parse(localStorage.getItem("seapass_user")); } catch { return null; }
};
