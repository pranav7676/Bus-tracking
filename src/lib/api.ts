const API_BASE = 'http://localhost:5000/api';

function getToken(): string | null {
  return localStorage.getItem('smartbus_token');
}

function setToken(token: string): void {
  localStorage.setItem('smartbus_token', token);
}

function removeToken(): void {
  localStorage.removeItem('smartbus_token');
}

async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    console.log(`🔵 API Request: ${options.method || 'GET'} ${API_BASE}${endpoint}`);
    
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include',
    });

    console.log(`📨 Response Status: ${res.status}`);
    
    const data = await res.json();
    
    if (!res.ok) {
      console.error(`❌ API Error: ${data.message || 'Request failed'}`);
      throw new Error(data.message || 'Request failed');
    }
    
    console.log(`✅ API Success: ${JSON.stringify(data).substring(0, 100)}...`);
    return data;
  } catch (error: any) {
    if (error instanceof TypeError) {
      console.error(`🚫 Network Error (Failed to fetch): ${error.message}`);
      console.error(`⚠️  Make sure backend is running on http://localhost:5000`);
      throw new Error(`Network error: Backend may not be running. Check console.`);
    }
    throw error;
  }
}

export const api = {
  // Auth
  register: (data: { username: string; email: string; password: string }) =>
    apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(data) }),

  login: (data: { email: string; password: string }) =>
    apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
    
  getMe: () => apiRequest('/auth/me'),
  updateRole: (role: string) => apiRequest('/auth/me/role', { method: 'PATCH', body: JSON.stringify({ role }) }),

  // Profile
  getProfile: () => apiRequest('/profile'),

  createProfile: (data: any) =>
    apiRequest('/profile', { method: 'POST', body: JSON.stringify(data) }),

  updateProfile: (data: any) =>
    apiRequest('/profile', { method: 'PUT', body: JSON.stringify(data) }),

  // Bus
  getBuses: () => apiRequest('/bus'),
  
  createBus: (data: any) =>
    apiRequest('/bus', { method: 'POST', body: JSON.stringify(data) }),

  // Attendance
  getAttendance: () => apiRequest('/attendance'),
  
  markAttendance: (data: { busId: string, status?: string }) =>
    apiRequest('/attendance', { method: 'POST', body: JSON.stringify(data) }),

};

export { getToken, setToken, removeToken };
