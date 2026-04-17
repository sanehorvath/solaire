// AUTH MODULE — Demo mode (no real Supabase needed for beta)

const DEMO_LOGINS = {
  'sane@solaire.com': { password: 'demo1234', userId: '11111111-1111-1111-1111-111111111111' },
  'matheo@solaire.com': { password: 'demo1234', userId: '22222222-2222-2222-2222-222222222222' },
  'clement@solaire.com': { password: 'demo1234', userId: '33333333-3333-3333-3333-333333333333' },
  'hugo@solaire.com': { password: 'demo1234', userId: '44444444-4444-4444-4444-444444444444' },
  'lucas@solaire.com': { password: 'demo1234', userId: '55555555-5555-5555-5555-555555555555' },
  'sarah@solaire.com': { password: 'demo1234', userId: '66666666-6666-6666-6666-666666666666' }
};

function authLogin(email, password) {
  const entry = DEMO_LOGINS[email.toLowerCase()];
  if (!entry || entry.password !== password) return null;
  const profile = DEMO_DATA.profiles.find(p => p.id === entry.userId);
  if (profile) setDemoUser(profile);
  return profile;
}

function authLogout() {
  clearDemoUser();
  window.location.href = 'index.html';
}

function requireAuth(requiredRole = null) {
  const user = getDemoUser();
  if (!user) { window.location.href = 'index.html'; return null; }
  if (requiredRole && user.role !== requiredRole) { window.location.href = 'index.html'; return null; }
  return user;
}

function getAvatarInitials(name) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

function getProfileById(id) {
  return DEMO_DATA.profiles.find(p => p.id === id) || null;
}

function getProfileName(id) {
  const p = getProfileById(id);
  return p ? p.name : '—';
}

function renderAvatar(profile, size = 30) {
  if (!profile) return '';
  return `<div class="avatar" style="width:${size}px;height:${size}px;background:${profile.avatar_color}20;color:${profile.avatar_color};font-size:${Math.round(size*0.4)}px">${getAvatarInitials(profile.name)}</div>`;
}
