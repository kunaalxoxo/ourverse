export const USERS = [
  {
    username: 'kunaal',
    password: '1234',
    displayName: 'Kunaal',
    partner: 'gudduu',
    emoji: '💙',
    color: 'from-blue-400 to-purple-500',
  },
  {
    username: 'gudduu',
    password: 'theworldsmostprettiestgirl',
    displayName: 'Gudduu',
    partner: 'kunaal',
    emoji: '💗',
    color: 'from-pink-400 to-rose-500',
  },
];

export function login(username: string, password: string) {
  const user = USERS.find(
    (u) => u.username === username.toLowerCase() && u.password === password
  );
  return user || null;
}

export function getStoredUser() {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('ourverse_user');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function storeUser(user: typeof USERS[0]) {
  localStorage.setItem('ourverse_user', JSON.stringify(user));
}

export function logout() {
  localStorage.removeItem('ourverse_user');
}
