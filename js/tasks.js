// TASKS MODULE

let tasksData = [];

function initTasks(currentUser) {
  tasksData = currentUser.role === 'founder'
    ? [...DEMO_DATA.tasks]
    : DEMO_DATA.tasks.filter(t => t.assigned_to === currentUser.id || t.created_by === currentUser.id);
  renderTasks(currentUser);
  setupTaskFilters(currentUser);
}

function renderTasks(currentUser, filters = {}) {
  const container = document.getElementById('tasks-list');
  if (!container) return;

  let filtered = [...tasksData];
  if (filters.search) {
    const s = filters.search.toLowerCase();
    filtered = filtered.filter(t => t.title.toLowerCase().includes(s) || (t.description||'').toLowerCase().includes(s));
  }
  if (filters.assignee) filtered = filtered.filter(t => t.assigned_to === filters.assignee);
  if (filters.status) filtered = filtered.filter(t => t.status === filters.status);
  if (filters.objective) filtered = filtered.filter(t => t.objective_id === filters.objective);

  // Sort: retard first, then urgente, then by deadline
  const statusOrder = { en_retard: 0, en_cours: 1, a_faire: 2, termine: 3 };
  filtered.sort((a, b) => (statusOrder[a.status] ?? 4) - (statusOrder[b.status] ?? 4));

  const lateCount = filtered.filter(t => t.status === 'en_retard').length;
  const lateEl = document.getElementById('tasks-late-count');
  if (lateEl) lateEl.textContent = lateCount;
  const totalEl = document.getElementById('tasks-total-count');
  if (totalEl) totalEl.textContent = filtered.length;

  if (filtered.length === 0) {
    container.innerHTML = `<tr><td colspan="7"><div class="empty-state"><div class="empty-icon">✅</div><p>Aucune tâche trouvée</p></div></td></tr>`;
    return;
  }

  container.innerHTML = filtered.map(task => {
    const assignee = getProfileById(task.assigned_to);
    const obj = DEMO_DATA.objectives.find(o => o.id === task.objective_id);
    const deadlineStr = task.deadline ? new Date(task.deadline).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }) : '—';
    const isLate = task.status === 'en_retard' || (task.deadline && new Date(task.deadline) < new Date() && task.status !== 'termine');
    return `
    <tr data-id="${task.id}">
      <td class="text-main">${task.title}</td>
      <td><span class="badge badge-${task.priority}">${formatPriority(task.priority)}</span></td>
      <td>
        <div class="flex items-center gap-2">
          ${assignee ? renderAvatar(assignee) : ''}
          <span>${assignee ? assignee.name : '—'}</span>
        </div>
      </td>
      <td><span class="text-sm text-muted">${obj ? obj.title : '—'}</span></td>
      <td class="${isLate ? 'text-red' : 'text-muted'}">${deadlineStr}</td>
      <td><span class="badge badge-${task.status}">${formatStatus(task.status)}</span></td>
      <td>
        <div class="flex gap-2">
          <button class="btn btn-icon btn-sm" onclick="openEditTask('${task.id}')">✏️</button>
          ${currentUser.role === 'founder' ? `<button class="btn btn-icon btn-sm" onclick="deleteTask('${task.id}')">🗑️</button>` : ''}
        </div>
      </td>
    </tr>`;
  }).join('');
}

function setupTaskFilters(currentUser) {
  const searchEl = document.getElementById('task-search');
  const assigneeEl = document.getElementById('task-filter-assignee');
  const statusEl = document.getElementById('task-filter-status');
  const objEl = document.getElementById('task-filter-objective');

  if (assigneeEl && currentUser.role === 'founder') {
    const founders = DEMO_DATA.profiles.filter(p => p.role === 'founder');
    founders.forEach(p => {
      const opt = document.createElement('option');
      opt.value = p.id; opt.textContent = p.name;
      assigneeEl.appendChild(opt);
    });
  }

  if (objEl) {
    DEMO_DATA.objectives.forEach(o => {
      const opt = document.createElement('option');
      opt.value = o.id; opt.textContent = o.title;
      objEl.appendChild(opt);
    });
  }

  const getFilters = () => ({
    search: searchEl?.value || '',
    assignee: assigneeEl?.value || '',
    status: statusEl?.value || '',
    objective: objEl?.value || ''
  });

  [searchEl, assigneeEl, statusEl, objEl].forEach(el => {
    if (el) el.addEventListener('input', () => renderTasks(currentUser, getFilters()));
    if (el && el.tagName === 'SELECT') el.addEventListener('change', () => renderTasks(currentUser, getFilters()));
  });
}

function openNewTask(currentUser) {
  const modal = document.getElementById('task-modal');
  const form = document.getElementById('task-form');
  document.getElementById('task-modal-title').textContent = 'Nouvelle tâche';
  form.reset();
  document.getElementById('task-id').value = '';

  const assigneeEl = document.getElementById('task-assignee');
  assigneeEl.innerHTML = '<option value="">— Assigner à —</option>';
  const targets = currentUser.role === 'founder'
    ? DEMO_DATA.profiles.filter(p => p.role === 'founder')
    : [currentUser];
  targets.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.id; opt.textContent = p.name;
    assigneeEl.appendChild(opt);
  });

  const objEl = document.getElementById('task-objective');
  objEl.innerHTML = '<option value="">— Objectif lié —</option>';
  DEMO_DATA.objectives.forEach(o => {
    const opt = document.createElement('option');
    opt.value = o.id; opt.textContent = o.title;
    objEl.appendChild(opt);
  });

  modal.classList.add('active');
}

function openEditTask(id) {
  const task = tasksData.find(t => t.id === id);
  if (!task) return;
  const modal = document.getElementById('task-modal');
  document.getElementById('task-modal-title').textContent = 'Modifier la tâche';
  document.getElementById('task-id').value = task.id;
  document.getElementById('task-title-input').value = task.title;
  document.getElementById('task-desc').value = task.description || '';
  document.getElementById('task-priority').value = task.priority;
  document.getElementById('task-deadline').value = task.deadline || '';
  document.getElementById('task-status-select').value = task.status;

  const assigneeEl = document.getElementById('task-assignee');
  assigneeEl.innerHTML = '<option value="">— Assigner à —</option>';
  DEMO_DATA.profiles.filter(p => p.role === 'founder').forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.id; opt.textContent = p.name;
    if (p.id === task.assigned_to) opt.selected = true;
    assigneeEl.appendChild(opt);
  });

  const objEl = document.getElementById('task-objective');
  objEl.innerHTML = '<option value="">— Objectif lié —</option>';
  DEMO_DATA.objectives.forEach(o => {
    const opt = document.createElement('option');
    opt.value = o.id; opt.textContent = o.title;
    if (o.id === task.objective_id) opt.selected = true;
    objEl.appendChild(opt);
  });

  modal.classList.add('active');
}

function saveTask(currentUser) {
  const id = document.getElementById('task-id').value;
  const data = {
    id: id || 'task_' + Date.now(),
    title: document.getElementById('task-title-input').value.trim(),
    description: document.getElementById('task-desc').value.trim(),
    assigned_to: document.getElementById('task-assignee').value,
    objective_id: document.getElementById('task-objective').value,
    priority: document.getElementById('task-priority').value,
    deadline: document.getElementById('task-deadline').value,
    status: document.getElementById('task-status-select').value,
    created_by: currentUser.id
  };
  if (!data.title) { showToast('Le titre est requis', 'error'); return; }

  if (id) {
    const idx = tasksData.findIndex(t => t.id === id);
    if (idx !== -1) tasksData[idx] = data;
    const globalIdx = DEMO_DATA.tasks.findIndex(t => t.id === id);
    if (globalIdx !== -1) DEMO_DATA.tasks[globalIdx] = data;
  } else {
    tasksData.unshift(data);
    DEMO_DATA.tasks.unshift(data);
  }

  closeModal('task-modal');
  renderTasks(currentUser);
  showToast(id ? 'Tâche mise à jour' : 'Tâche créée', 'success');
}

function deleteTask(id) {
  if (!confirm('Supprimer cette tâche ?')) return;
  tasksData = tasksData.filter(t => t.id !== id);
  const idx = DEMO_DATA.tasks.findIndex(t => t.id === id);
  if (idx !== -1) DEMO_DATA.tasks.splice(idx, 1);
  renderTasks(getDemoUser());
  showToast('Tâche supprimée', 'success');
}

function formatStatus(s) {
  return { a_faire: 'À faire', en_cours: 'En cours', termine: 'Terminé', en_retard: 'En retard' }[s] || s;
}
function formatPriority(p) {
  return { basse: 'Basse', normale: 'Normale', haute: 'Haute', urgente: 'Urgente' }[p] || p;
}
