const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('eduquest_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const api = {
  // Auth API
  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return res.json();
  },

  async register(data) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async guestLogin(grade = 10, role = 'student') {
    const res = await fetch(`${API_BASE}/auth/guest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ grade, role }),
    });
    return res.json();
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async updateProfile(data) {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Subjects & Curriculum API
  async getSubjects(grade) {
    const url = grade ? `${API_BASE}/subjects?grade=${grade}` : `${API_BASE}/subjects`;
    const res = await fetch(url, { headers: getAuthHeaders() });
    return res.json();
  },

  async getChapterDetail(grade, subjectId, chapterId) {
    const res = await fetch(`${API_BASE}/subjects/${grade}/${subjectId}/${chapterId}`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  // Quiz API
  async getQuiz(quizId) {
    const res = await fetch(`${API_BASE}/quizzes/${quizId}`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async submitQuiz(quizId, answers) {
    const res = await fetch(`${API_BASE}/quizzes/${quizId}/submit`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ answers }),
    });
    return res.json();
  },

  async createQuiz(quizData) {
    const res = await fetch(`${API_BASE}/quizzes`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(quizData),
    });
    return res.json();
  },

  // Leaderboard & Badges API
  async getLeaderboard(grade) {
    const url = grade ? `${API_BASE}/leaderboard?grade=${grade}` : `${API_BASE}/leaderboard`;
    const res = await fetch(url, { headers: getAuthHeaders() });
    return res.json();
  },

  async getAllBadges() {
    const res = await fetch(`${API_BASE}/leaderboard/badges`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  // E-Books & PDF Library API
  async getBooks(grade, subjectId, q) {
    const params = new URLSearchParams();
    if (grade) params.append('grade', grade);
    if (subjectId && subjectId !== 'all') params.append('subjectId', subjectId);
    if (q) params.append('q', q);

    const res = await fetch(`${API_BASE}/books?${params.toString()}`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async addBook(bookData) {
    const res = await fetch(`${API_BASE}/books`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(bookData),
    });
    return res.json();
  },

  async deleteBook(id) {
    const res = await fetch(`${API_BASE}/books/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return res.json();
  },
};
