// OBJECTIVES MODULE

let objectivesData = [];

function initObjectives(currentUser) {
  objectivesData = [...DEMO_DATA.objectives];
  renderObjectives(currentUser);
}

function renderObjectives(currentUser) {
  const container = document.getElementById('objectives-list');
  if (!container) return;

  const items = [...objectivesData];
  const avgProgress = items.length ? Math.round(items.reduce((s, o) => s + o.progress, 0) / items.length) : 0;
  const el = document.getElementById('obj-avg-progress');
  if (el) el.textContent = avgProgress + '%';
  const countEl = document.getElementById('obj-total');
  if (countEl) countEl.textContent = items.length;

  if (items.length === 0) {
    container.innerHTML = `<div class="empty-state"><div class="empty-icon">🎯</div><p>Aucun objectif défini</p></div>`;
    return;
  }

  container.innerHTML = items.map(obj => {
    const linkedTasks = DEMO_DATA.tasks.filter(t => t.objective_id === obj.id);
    const doneTasks = linkedTasks.filter(t => t.status === 'termine').length;
    const lateTasks = linkedTasks.filter(t => t.status === 'en_retard').length;
    const deadline = obj.deadline ? new Date(obj.deadline).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }) : '—';
    const statusColor = { en_cours: 'var(--blue)', termine: 'var(--green)', bloque: 'var(--red)' }[obj.status] || 'var(--text3)';

    return `
    <div class="obj-card">
      <div class="obj-header">
        <div>
          <div class="obj-title">${obj.title}</div>
          <div class="obj-desc mt-1">${obj.description || ''}</div>
        </div>
        <div class="flex gap-2 items-center">
          <span class="badge" style="background:${statusColor}20;color:${statusColor}">${formatObjStatus(obj.status)}</span>
          <button class="btn btn-icon btn-sm" onclick="openEditObjective('${obj.id}')">✏️</button>
        </div>
      </div>
      <div class="obj-progress-label">
        <span>Avancement</span>
        <span style="color:var(--accent)">${obj.progress}%</span>
      </div>
      <div class="progress-bar mb-3">
        <div class="progress-fill" style="width:${obj.progress}%"></div>
      </div>
      <div class="flex gap-4 text-sm text-muted">
        <span>📅 Deadline : ${deadline}</span>
        <span>📋 ${doneTasks}/${linkedTasks.length} tâches terminées</span>
        ${lateTasks > 0 ? `<span class="text-red">⚠️ ${lateTasks} en retard</span>` : ''}
      </div>
    </div>`;
  }).join('');
}

function openNewObjective() {
  const modal = document.getElementById('obj-modal');
  document.getElementById('obj-modal-title').textContent = 'Nouvel objectif';
  document.getElementById('obj-form').reset();
  document.getElementById('obj-id').value = '';
  document.getElementById('obj-progress-input').value = 0;
  modal.classList.add('active');
}

function openEditObjective(id) {
  const obj = objectivesData.find(o => o.id === id);
  if (!obj) return;
  const modal = document.getElementById('obj-modal');
  document.getElementById('obj-modal-title').textContent = 'Modifier l\'objectif';
  document.getElementById('obj-id').value = obj.id;
  document.getElementById('obj-title-input').value = obj.title;
  document.getElementById('obj-desc-input').value = obj.description || '';
  document.getElementById('obj-deadline-input').value = obj.deadline || '';
  document.getElementById('obj-progress-input').value = obj.progress;
  document.getElementById('obj-status-select').value = obj.status;
  modal.classList.add('active');
}

function saveObjective(currentUser) {
  const id = document.getElementById('obj-id').value;
  const data = {
    id: id || 'obj_' + Date.now(),
    title: document.getElementById('obj-title-input').value.trim(),
    description: document.getElementById('obj-desc-input').value.trim(),
    deadline: document.getElementById('obj-deadline-input').value,
    progress: parseInt(document.getElementById('obj-progress-input').value) || 0,
    status: document.getElementById('obj-status-select').value,
    created_by: currentUser.id
  };
  if (!data.title) { showToast('Le titre est requis', 'error'); return; }

  if (id) {
    const idx = objectivesData.findIndex(o => o.id === id);
    if (idx !== -1) objectivesData[idx] = data;
    const gi = DEMO_DATA.objectives.findIndex(o => o.id === id);
    if (gi !== -1) DEMO_DATA.objectives[gi] = data;
  } else {
    objectivesData.unshift(data);
    DEMO_DATA.objectives.unshift(data);
  }

  closeModal('obj-modal');
  renderObjectives(currentUser);
  showToast(id ? 'Objectif mis à jour' : 'Objectif créé', 'success');
}

function formatObjStatus(s) {
  return { en_cours: 'En cours', termine: 'Terminé', bloque: 'Bloqué' }[s] || s;
}
