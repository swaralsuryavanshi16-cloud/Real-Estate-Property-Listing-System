import api from "./axios";

// ================= LOGIN =================

export const login = (data) =>
  api.post("/auth/login", data);

// ============== OLD REGISTER ==============

export const register = (data) =>
  api.post("/auth/register", data);

// ============== SEND OTP ==================

export const sendOTP = (email) =>
  api.post("/auth/send-otp", { email });

// ============== VERIFY OTP ================

export const verifyOTP = (data) =>
  api.post("/auth/verify-otp", data);

// ============== PROFILE ===================

export const getMe = () =>
  api.get("/auth/me");

export const updateProfile = (data) =>
  api.put("/auth/updateprofile", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const changePassword = (data) =>
  api.put("/auth/changepassword", data);

// ============== LOGOUT ====================

export const logout = () =>
  api.get("/auth/logout");