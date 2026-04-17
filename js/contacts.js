// CONTACTS MODULE

let contactsData = [];

function initContacts(currentUser) {
  contactsData = currentUser.role === 'founder'
    ? [...DEMO_DATA.contacts]
    : DEMO_DATA.contacts.filter(c => c.created_by === currentUser.id);
  renderContacts(currentUser);
  setupContactFilters(currentUser);
}

function renderContacts(currentUser, filters = {}) {
  const container = document.getElementById('contacts-grid');
  if (!container) return;

  let items = [...contactsData];
  if (filters.search) {
    const s = filters.search.toLowerCase();
    items = items.filter(c => c.name.toLowerCase().includes(s) || (c.company||'').toLowerCase().includes(s));
  }
  if (filters.temp) items = items.filter(c => c.temperature === filters.temp);
  if (filters.assignee) items = items.filter(c => c.assigned_to === filters.assignee || c.created_by === filters.assignee);

  const totalEl = document.getElementById('contacts-total');
  if (totalEl) totalEl.textContent = items.length;
  const chaudEl = document.getElementById('contacts-chaud');
  if (chaudEl) chaudEl.textContent = items.filter(c => c.temperature === 'chaud').length;

  if (items.length === 0) {
    container.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><div class="empty-icon">📋</div><p>Aucun contact trouvé</p></div>`;
    return;
  }

  const today = new Date();
  container.innerHTML = items.map(c => {
    const followup = c.next_followup ? new Date(c.next_followup) : null;
    const isSoon = followup && (followup - today) < 1000 * 60 * 60 * 24 * 7;
    const followupStr = followup ? followup.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }) : '—';
    const owner = getProfileById(c.created_by);
    return `
    <div class="contact-card" onclick="openContactDetail('${c.id}')">
      <div class="flex items-center justify-between mb-2">
        <div>
          <div class="contact-name">${c.name}</div>
          <div class="contact-company">${c.company || '—'}</div>
        </div>
        <span class="badge badge-${c.temperature}">${formatTemp(c.temperature)}</span>
      </div>
      ${c.phone ? `<div class="text-sm text-muted mt-1">📞 ${c.phone}</div>` : ''}
      ${c.email ? `<div class="text-sm text-muted">✉️ ${c.email}</div>` : ''}
      <div class="contact-footer mt-3">
        <span class="followup-date ${isSoon ? 'soon' : ''}">🔔 Relance: ${followupStr}</span>
        ${owner ? `<div class="flex items-center gap-1 text-sm text-dim">${renderAvatar(owner, 18)} ${owner.name}</div>` : ''}
      </div>
    </div>`;
  }).join('');
}

function setupContactFilters(currentUser) {
  const searchEl = document.getElementById('contact-search');
  const tempEl = document.getElementById('contact-filter-temp');
  const assigneeEl = document.getElementById('contact-filter-assignee');

  if (assigneeEl && currentUser.role === 'founder') {
    assigneeEl.style.display = '';
    DEMO_DATA.profiles.forEach(p => {
      const opt = document.createElement('option');
      opt.value = p.id; opt.textContent = p.name;
      assigneeEl.appendChild(opt);
    });
  } else if (assigneeEl) {
    assigneeEl.style.display = 'none';
  }

  const getFilters = () => ({
    search: searchEl?.value || '',
    temp: tempEl?.value || '',
    assignee: assigneeEl?.value || ''
  });

  [searchEl, tempEl, assigneeEl].forEach(el => {
    if (el) el.addEventListener('input', () => renderContacts(currentUser, getFilters()));
    if (el && el.tagName === 'SELECT') el.addEventListener('change', () => renderContacts(currentUser, getFilters()));
  });
}

function openNewContact(currentUser) {
  const modal = document.getElementById('contact-modal');
  document.getElementById('contact-modal-title').textContent = 'Nouveau contact';
  document.getElementById('contact-form').reset();
  document.getElementById('contact-id').value = '';
  modal.classList.add('active');
}

function openContactDetail(id) {
  const c = contactsData.find(x => x.id === id);
  if (!c) return;
  const modal = document.getElementById('contact-modal');
  document.getElementById('contact-modal-title').textContent = c.name;
  document.getElementById('contact-id').value = c.id;
  document.getElementById('contact-name-input').value = c.name;
  document.getElementById('contact-company-input').value = c.company || '';
  document.getElementById('contact-phone-input').value = c.phone || '';
  document.getElementById('contact-email-input').value = c.email || '';
  document.getElementById('contact-address-input').value = c.address || '';
  document.getElementById('contact-temp-select').value = c.temperature;
  document.getElementById('contact-followup-input').value = c.next_followup || '';
  document.getElementById('contact-notes-input').value = c.notes || '';
  modal.classList.add('active');
}

function saveContact(currentUser) {
  const id = document.getElementById('contact-id').value;
  const data = {
    id: id || 'contact_' + Date.now(),
    name: document.getElementById('contact-name-input').value.trim(),
    company: document.getElementById('contact-company-input').value.trim(),
    phone: document.getElementById('contact-phone-input').value.trim(),
    email: document.getElementById('contact-email-input').value.trim(),
    address: document.getElementById('contact-address-input').value.trim(),
    temperature: document.getElementById('contact-temp-select').value,
    next_followup: document.getElementById('contact-followup-input').value,
    notes: document.getElementById('contact-notes-input').value.trim(),
    assigned_to: currentUser.id,
    created_by: currentUser.id
  };
  if (!data.name) { showToast('Le nom est requis', 'error'); return; }

  if (id) {
    const idx = contactsData.findIndex(c => c.id === id);
    if (idx !== -1) contactsData[idx] = data;
    const gi = DEMO_DATA.contacts.findIndex(c => c.id === id);
    if (gi !== -1) DEMO_DATA.contacts[gi] = data;
  } else {
    contactsData.unshift(data);
    DEMO_DATA.contacts.unshift(data);
  }

  closeModal('contact-modal');
  renderContacts(currentUser);
  showToast(id ? 'Contact mis à jour' : 'Contact créé', 'success');
}

function deleteContact(id, currentUser) {
  if (!confirm('Supprimer ce contact ?')) return;
  contactsData = contactsData.filter(c => c.id !== id);
  const idx = DEMO_DATA.contacts.findIndex(c => c.id === id);
  if (idx !== -1) DEMO_DATA.contacts.splice(idx, 1);
  closeModal('contact-modal');
  renderContacts(currentUser);
  showToast('Contact supprimé', 'success');
}

function formatTemp(t) {
  return { chaud: '🔴 Chaud', tiede: '🟡 Tiède', froid: '🔵 Froid' }[t] || t;
}
