import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useUserStore = defineStore("user", () => {
  const userId = ref(Number(localStorage.getItem("userId")) || null);
  const prestaId = ref(Number(localStorage.getItem("prestaId")) || null);
  const isConnected = ref(localStorage.getItem("isConnected") === "true");
  const role = ref(localStorage.getItem("userRole") || null);
  const token = ref(localStorage.getItem("jwt") || null);
  let logoutTimeout = null;

  if (token.value) {
    try {
      const payload = JSON.parse(atob(token.value.split('.')[1]));
      const exp = payload.exp * 1000;
      const delay = exp - Date.now();

      if (delay <= 0) {
        logout();
      } else {
        runLogoutTimer(delay);
      }
    } catch {
      logout();
    }
  }

  function setUser(id) {
    userId.value = id;
    isConnected.value = true;
  }

  function setRole(r) {
    role.value = r;
  }

  function setToken(t) {
    token.value = t;
    localStorage.setItem("jwt", t);

    try {
      const payload = JSON.parse(atob(t.split('.')[1]));
      const exp = payload.exp * 1000;
      const delay = exp - Date.now();

      if (delay > 0) runLogoutTimer(delay);
      else logout();
    } catch {
      logout();
    }
  }

  function logout() {
    userId.value = null;
    isConnected.value = false;
    role.value = null;
    token.value = null;
    prestaId.value = null;

    localStorage.removeItem("userId");
    localStorage.removeItem("isConnected");
    localStorage.removeItem("userRole");
    localStorage.removeItem("prestaId");
    localStorage.removeItem("jwt");

    if (logoutTimeout) clearTimeout(logoutTimeout);
  }

  function runLogoutTimer(timer) {
    if (logoutTimeout) clearTimeout(logoutTimeout);

    logoutTimeout = setTimeout(() => {
      logout();
      alert("Session expirée, vous avez été déconnecté.");
    }, timer);
  }


  watch(userId, (v) => {
    if (v !== null) localStorage.setItem("userId", v);
    else localStorage.removeItem("userId");
  });

  watch(isConnected, (v) => {
    if (v) localStorage.setItem("isConnected", v);
    else localStorage.removeItem("isConnected");
  });

  watch(token, (v) => {
    if (v) localStorage.setItem("jwt", v);
    else localStorage.removeItem("jwt");
  });
  watch(prestaId, (v) => localStorage.setItem("prestaId", v));
  watch(role, (v) => localStorage.setItem("userRole", v));

  return {
    userId,
    isConnected,
    prestaId,
    role,
    token,
    setUser,
    setRole,
    setToken,
    logout,
  };
});
