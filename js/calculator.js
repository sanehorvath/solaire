// CALCULATOR / BUDGET FINANCIER MODULE

let transactionsData = [];

function initCalculator(currentUser) {
  transactionsData = [...DEMO_DATA.transactions];
  renderCalculatorOverview();
  renderTransactions(currentUser);
  setupCalcFilters(currentUser);
  setupPostesDropdown();
}

function getBudgetStats() {
  const totalBudget = 1150000;
  const totalEngage = transactionsData.reduce((s, t) => s + (t.montant_engage || 0), 0);
  const totalPaye = transactionsData.reduce((s, t) => s + (t.montant_paye || 0), 0);

  const byTranche = { T1: { budget: 350000, engage: 0, paye: 0 }, T2: { budget: 250000, engage: 0, paye: 0 }, T3: { budget: 550000, engage: 0, paye: 0 } };
  transactionsData.forEach(t => {
    if (byTranche[t.tranche]) {
      byTranche[t.tranche].engage += t.montant_engage || 0;
      byTranche[t.tranche].paye += t.montant_paye || 0;
    }
  });
  return { totalBudget, totalEngage, totalPaye, byTranche };
}

function renderCalculatorOverview() {
  const s = getBudgetStats();
  const fmt = n => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);
  const pct = (a, b) => b > 0 ? Math.round(a / b * 100) : 0;

  const el = id => document.getElementById(id);
  if (el('calc-budget-total')) el('calc-budget-total').textContent = fmt(s.totalBudget);
  if (el('calc-engage-total')) el('calc-engage-total').textContent = fmt(s.totalEngage);
  if (el('calc-paye-total')) el('calc-paye-total').textContent = fmt(s.totalPaye);
  if (el('calc-reste-total')) el('calc-reste-total').textContent = fmt(s.totalBudget - s.totalEngage);

  ['T1', 'T2', 'T3'].forEach(t => {
    const tr = s.byTranche[t];
    const p = pct(tr.engage, tr.budget);
    const pBar = document.getElementById(`calc-bar-${t}`);
    if (pBar) pBar.style.width = p + '%';
    const pTxt = document.getElementById(`calc-pct-${t}`);
    if (pTxt) pTxt.textContent = p + '%';
    const engEl = document.getElementById(`calc-engage-${t}`);
    if (engEl) engEl.textContent = fmt(tr.engage);
    const payEl = document.getElementById(`calc-paye-${t}`);
    if (payEl) payEl.textContent = fmt(tr.paye);
    const restEl = document.getElementById(`calc-reste-${t}`);
    if (restEl) restEl.textContent = fmt(tr.budget - tr.engage);
  });
}

function renderTransactions(currentUser, filters = {}) {
  const container = document.getElementById('transactions-list');
  if (!container) return;

  let items = [...transactionsData];
  if (filters.tranche) items = items.filter(t => t.tranche === filters.tranche);
  if (filters.search) {
    const s = filters.search.toLowerCase();
    items = items.filter(t => (t.fournisseur||'').toLowerCase().includes(s) || t.poste.toLowerCase().includes(s) || (t.description||'').toLowerCase().includes(s));
  }
  items.sort((a, b) => new Date(b.date) - new Date(a.date));

  const fmt = n => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n || 0);

  if (items.length === 0) {
    container.innerHTML = `<tr><td colspan="9"><div class="empty-state"><div class="empty-icon">💳</div><p>Aucune transaction</p></div></td></tr>`;
    return;
  }

  container.innerHTML = items.map(t => `
    <tr data-id="${t.id}">
      <td class="text-muted">${t.date ? new Date(t.date).toLocaleDateString('fr-FR') : '—'}</td>
      <td class="text-main">${t.poste}</td>
      <td><span class="badge badge-en_cours" style="font-size:10px">${t.tranche}</span></td>
      <td class="text-muted">${t.categorie}</td>
      <td class="text-muted">${t.fournisseur || '—'}</td>
      <td class="text-main">${fmt(t.montant_engage)}</td>
      <td class="text-green">${fmt(t.montant_paye)}</td>
      <td class="text-muted text-sm">${t.ref_facture || '—'}</td>
      <td>
        <div class="flex gap-2">
          <button class="btn btn-icon btn-sm" onclick="openEditTransaction('${t.id}')">✏️</button>
          <button class="btn btn-icon btn-sm" onclick="deleteTransaction('${t.id}')">🗑️</button>
        </div>
      </td>
    </tr>`).join('');
}

function setupCalcFilters(currentUser) {
  const searchEl = document.getElementById('calc-search');
  const trancheEl = document.getElementById('calc-filter-tranche');
  const getFilters = () => ({ search: searchEl?.value || '', tranche: trancheEl?.value || '' });
  if (searchEl) searchEl.addEventListener('input', () => renderTransactions(currentUser, getFilters()));
  if (trancheEl) trancheEl.addEventListener('change', () => renderTransactions(currentUser, getFilters()));
}

function setupPostesDropdown() {
  const posteEl = document.getElementById('trans-poste');
  if (!posteEl) return;
  posteEl.innerHTML = '<option value="">— Sélectionner un poste —</option>';
  DEMO_DATA.budget_postes.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.poste;
    opt.dataset.tranche = p.tranche;
    opt.dataset.categorie = p.categorie;
    opt.textContent = `[${p.tranche}] ${p.poste}`;
    posteEl.appendChild(opt);
  });
  posteEl.addEventListener('change', () => {
    const opt = posteEl.selectedOptions[0];
    const trancheEl = document.getElementById('trans-tranche');
    const catEl = document.getElementById('trans-categorie');
    if (trancheEl) trancheEl.value = opt?.dataset.tranche || '';
    if (catEl) catEl.value = opt?.dataset.categorie || '';
  });
}

function openNewTransaction(currentUser) {
  const modal = document.getElementById('trans-modal');
  document.getElementById('trans-modal-title').textContent = 'Nouvelle transaction';
  document.getElementById('trans-form').reset();
  document.getElementById('trans-id').value = '';
  modal.classList.add('active');
}

function openEditTransaction(id) {
  const t = transactionsData.find(x => x.id === id);
  if (!t) return;
  const modal = document.getElementById('trans-modal');
  document.getElementById('trans-modal-title').textContent = 'Modifier la transaction';
  document.getElementById('trans-id').value = t.id;
  document.getElementById('trans-date').value = t.date || '';
  document.getElementById('trans-poste').value = t.poste;
  document.getElementById('trans-tranche').value = t.tranche;
  document.getElementById('trans-categorie').value = t.categorie;
  document.getElementById('trans-fournisseur').value = t.fournisseur || '';
  document.getElementById('trans-description').value = t.description || '';
  document.getElementById('trans-engage').value = t.montant_engage || '';
  document.getElementById('trans-paye').value = t.montant_paye || '';
  document.getElementById('trans-ref').value = t.ref_facture || '';
  document.getElementById('trans-notes').value = t.notes || '';
  modal.classList.add('active');
}

function saveTransaction(currentUser) {
  const id = document.getElementById('trans-id').value;
  const data = {
    id: id || 'tr_' + Date.now(),
    date: document.getElementById('trans-date').value,
    poste: document.getElementById('trans-poste').value,
    tranche: document.getElementById('trans-tranche').value,
    categorie: document.getElementById('trans-categorie').value,
    fournisseur: document.getElementById('trans-fournisseur').value.trim(),
    description: document.getElementById('trans-description').value.trim(),
    montant_engage: parseFloat(document.getElementById('trans-engage').value) || 0,
    montant_paye: parseFloat(document.getElementById('trans-paye').value) || 0,
    ref_facture: document.getElementById('trans-ref').value.trim(),
    notes: document.getElementById('trans-notes').value.trim(),
    created_by: currentUser.id
  };
  if (!data.poste || !data.date) { showToast('Poste et date sont requis', 'error'); return; }

  if (id) {
    const idx = transactionsData.findIndex(t => t.id === id);
    if (idx !== -1) transactionsData[idx] = data;
  } else {
    transactionsData.unshift(data);
  }

  closeModal('trans-modal');
  renderCalculatorOverview();
  renderTransactions(currentUser);
  showToast(id ? 'Transaction mise à jour' : 'Transaction ajoutée', 'success');
}

function deleteTransaction(id) {
  if (!confirm('Supprimer cette transaction ?')) return;
  transactionsData = transactionsData.filter(t => t.id !== id);
  renderCalculatorOverview();
  renderTransactions(getDemoUser());
  showToast('Transaction supprimée', 'success');
}
