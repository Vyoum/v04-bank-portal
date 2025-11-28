// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const API_ENDPOINTS = {
    REGISTER: `${API_BASE_URL}/api/auth/register`,
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    VERIFY_OTP: `${API_BASE_URL}/api/auth/verify-otp`,
    SEND_OTP: `${API_BASE_URL}/api/auth/send-otp`,
    LOGOUT: `${API_BASE_URL}/api/auth/logout`,
    HEALTH: `${API_BASE_URL}/api/auth/health`,
};

export default API_BASE_URL;
