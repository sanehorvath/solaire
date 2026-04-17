// CALENDAR MODULE

let calData = [];

function initCalendar(currentUser) {
  calData = currentUser.role === 'founder'
    ? [...DEMO_DATA.appointments]
    : DEMO_DATA.appointments.filter(a => a.assigned_to === currentUser.id || a.created_by === currentUser.id);
  renderCalendar(currentUser);
}

function renderCalendar(currentUser, searchVal = '') {
  const container = document.getElementById('calendar-list');
  if (!container) return;

  let items = [...calData];
  if (searchVal) {
    const s = searchVal.toLowerCase();
    items = items.filter(a => a.title.toLowerCase().includes(s) || (a.location||'').toLowerCase().includes(s));
  }
  items.sort((a, b) => new Date(a.date) - new Date(b.date));

  document.getElementById('cal-total-count').textContent = items.length;

  if (items.length === 0) {
    container.innerHTML = `<div class="empty-state"><div class="empty-icon">📅</div><p>Aucun rendez-vous trouvé</p></div>`;
    return;
  }

  container.innerHTML = items.map(appt => {
    const dt = new Date(appt.date);
    const day = dt.toLocaleDateString('fr-FR', { day: '2-digit' });
    const month = dt.toLocaleDateString('fr-FR', { month: 'short' }).toUpperCase();
    const time = dt.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    const assignee = getProfileById(appt.assigned_to);
    const isPast = dt < new Date();
    return `
    <div class="cal-event ${isPast ? 'opacity-50' : ''}" onclick="openEditAppt('${appt.id}')">
      <div class="cal-date">
        <div class="cal-day">${day}</div>
        <div class="cal-month">${month}</div>
      </div>
      <div class="cal-info">
        <div class="cal-title">${appt.title}</div>
        <div class="cal-meta">
          <span>⏰ ${time}</span>
          ${appt.location ? `<span>📍 ${appt.location}</span>` : ''}
          <span>${assignee ? `${renderAvatar(assignee, 18)} ${assignee.name}` : '—'}</span>
        </div>
        ${appt.notes ? `<div class="text-sm text-dim mt-1">${appt.notes}</div>` : ''}
      </div>
      <div class="flex gap-2">
        ${currentUser.role === 'founder' ? `<button class="btn btn-icon btn-sm" onclick="event.stopPropagation();deleteAppt('${appt.id}')">🗑️</button>` : ''}
      </div>
    </div>`;
  }).join('');
}

function openNewAppt(currentUser) {
  const modal = document.getElementById('appt-modal');
  document.getElementById('appt-modal-title').textContent = 'Nouveau rendez-vous';
  document.getElementById('appt-form').reset();
  document.getElementById('appt-id').value = '';

  const assigneeEl = document.getElementById('appt-assignee');
  assigneeEl.innerHTML = '<option value="">— Assigner à —</option>';
  const targets = currentUser.role === 'founder'
    ? DEMO_DATA.profiles.filter(p => p.role === 'founder')
    : [currentUser];
  targets.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.id; opt.textContent = p.name;
    assigneeEl.appendChild(opt);
  });

  modal.classList.add('active');
}

function openEditAppt(id) {
  const appt = calData.find(a => a.id === id);
  if (!appt) return;
  const modal = document.getElementById('appt-modal');
  document.getElementById('appt-modal-title').textContent = 'Modifier le RDV';
  document.getElementById('appt-id').value = appt.id;
  document.getElementById('appt-title-input').value = appt.title;
  document.getElementById('appt-date').value = appt.date ? appt.date.slice(0, 16) : '';
  document.getElementById('appt-location').value = appt.location || '';
  document.getElementById('appt-notes-input').value = appt.notes || '';

  const assigneeEl = document.getElementById('appt-assignee');
  assigneeEl.innerHTML = '<option value="">— Assigner à —</option>';
  DEMO_DATA.profiles.filter(p => p.role === 'founder').forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.id; opt.textContent = p.name;
    if (p.id === appt.assigned_to) opt.selected = true;
    assigneeEl.appendChild(opt);
  });

  modal.classList.add('active');
}

function saveAppt(currentUser) {
  const id = document.getElementById('appt-id').value;
  const data = {
    id: id || 'appt_' + Date.now(),
    title: document.getElementById('appt-title-input').value.trim(),
    date: document.getElementById('appt-date').value,
    location: document.getElementById('appt-location').value.trim(),
    notes: document.getElementById('appt-notes-input').value.trim(),
    assigned_to: document.getElementById('appt-assignee').value,
    created_by: currentUser.id
  };
  if (!data.title) { showToast('Le titre est requis', 'error'); return; }

  if (id) {
    const idx = calData.findIndex(a => a.id === id);
    if (idx !== -1) calData[idx] = data;
    const gi = DEMO_DATA.appointments.findIndex(a => a.id === id);
    if (gi !== -1) DEMO_DATA.appointments[gi] = data;
  } else {
    calData.unshift(data);
    DEMO_DATA.appointments.unshift(data);
  }

  closeModal('appt-modal');
  renderCalendar(currentUser);
  showToast(id ? 'RDV mis à jour' : 'RDV créé', 'success');
}

function deleteAppt(id) {
  if (!confirm('Supprimer ce rendez-vous ?')) return;
  calData = calData.filter(a => a.id !== id);
  const idx = DEMO_DATA.appointments.findIndex(a => a.id === id);
  if (idx !== -1) DEMO_DATA.appointments.splice(idx, 1);
  renderCalendar(getDemoUser());
  showToast('RDV supprimé', 'success');
}
