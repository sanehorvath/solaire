// ============================================================
// SOLAIRE — MODULES.JS
// ============================================================

function initObjectives() {
  const grid = document.getElementById('objectivesGrid');
  if (!grid) return;
  grid.innerHTML = DEMO_OBJECTIVES.map(o => `
    <div class="obj-card">
      <div class="obj-header">
        <span class="obj-title">${o.title}</span>
        <span class="obj-badge">${o.category}</span>
      </div>
      <div class="obj-meta">${o.owner} · Deadline ${fmtDate(o.deadline)}</div>
      <div class="progress-bar-wrap"><div class="progress-bar-fill" style="width:${o.progress}%"></div></div>
      <div class="obj-progress-label">${o.progress}%</div>
    </div>
  `).join('');
}

function initTasks(role, userName) {
  const cols = { todo: document.getElementById('colTodo'), 'in-progress': document.getElementById('colProgress'), done: document.getElementById('colDone') };
  if (!cols.todo) return;
  let tasks = role === 'commercial' ? DEMO_TASKS.filter(t => t.assignee === userName) : DEMO_TASKS;
  Object.values(cols).forEach(c => { if(c) c.innerHTML = ''; });
  tasks.forEach(t => {
    const el = document.createElement('div');
    el.className = 'task-card priority-' + t.priority;
    el.innerHTML = `<div class="task-title">${t.title}</div><div class="task-meta"><span>${t.assignee}</span><span>${fmtDate(t.due)}</span></div><div class="task-tags">${t.tags.map(g=>`<span class="tag">${g}</span>`).join('')}</div>`;
    if (cols[t.status]) cols[t.status].appendChild(el);
  });
}

function initCalendar(role, userName) {
  const list = document.getElementById('calendarList');
  if (!list) return;
  let events = role === 'commercial' ? DEMO_APPOINTMENTS.filter(e => e.assignee === userName) : DEMO_APPOINTMENTS;
  events = events.sort((a,b) => new Date(a.date) - new Date(b.date));
  list.innerHTML = events.map(e => `
    <div class="cal-item type-${e.type}">
      <div class="cal-date">${fmtDate(e.date)} ${e.time}</div>
      <div class="cal-title">${e.title}</div>
      <div class="cal-meta">${e.location} · ${e.assignee}</div>
    </div>
  `).join('') || '<p class="empty-state">Aucun événement</p>';
}

// SUPPLIERS
function initSuppliers(role) {
  if (!document.getElementById('suppliersTableBody')) return;
  renderSuppliers(role);
  const searchEl = document.getElementById('supplierSearch');
  if (searchEl) searchEl.addEventListener('input', () => renderSuppliers(role, searchEl.value));
  const addBtn = document.getElementById('addSupplierBtn');
  if (addBtn) addBtn.addEventListener('click', () => openModal('supplierModal'));
  const form = document.getElementById('supplierForm');
  if (form) form.addEventListener('submit', (e) => { e.preventDefault(); saveSupplier(role); });
  document.getElementById('supplierModalClose')?.addEventListener('click', () => closeModal('supplierModal'));
}
function renderSuppliers(role, query='') {
  const tbody = document.getElementById('suppliersTableBody');
  if (!tbody) return;
  let data = DEMO_SUPPLIERS;
  if (query) data = data.filter(s => JSON.stringify(s).toLowerCase().includes(query.toLowerCase()));
  tbody.innerHTML = data.map(s => `<tr>
    <td>${s.prenom} ${s.nom}</td>
    <td><strong>${s.societe}</strong></td>
    <td>${s.role}</td><td>${s.email}</td><td>${s.tel}</td><td>${s.pays}</td>
    <td><span class="badge-statut statut-${s.statut.toLowerCase().replace(/ /g,'')}">${s.statut}</span></td>
    <td><span class="badge-prio prio-${s.priorite.toLowerCase()}">${s.priorite}</span></td>
    <td class="notes-cell">${s.notes}</td>
  </tr>`).join('') || '<tr><td colspan="9" class="empty-state">Aucun fournisseur</td></tr>';
}
function saveSupplier(role) {
  const f = document.getElementById('supplierForm');
  DEMO_SUPPLIERS.push({ id:'s'+Date.now(), prenom:f.querySelector('[name=prenom]').value, nom:f.querySelector('[name=nom]').value, societe:f.querySelector('[name=societe]').value, role:f.querySelector('[name=role]').value, email:f.querySelector('[name=email]').value||'–', tel:f.querySelector('[name=tel]').value||'–', pays:f.querySelector('[name=pays]').value||'–', langue:f.querySelector('[name=langue]').value||'–', statut:f.querySelector('[name=statut]').value, priorite:f.querySelector('[name=priorite]').value, categorie:f.querySelector('[name=categorie]').value||'Divers', notes:f.querySelector('[name=notes]').value||'' });
  closeModal('supplierModal'); f.reset(); renderSuppliers(role); showToast('Fournisseur ajouté ✓');
  // Refresh invoice fournisseur dropdown if on same page
  const sel = document.getElementById('invFournisseur');
  if (sel) { sel.innerHTML = '<option value="">-- Sélectionner --</option>'+DEMO_SUPPLIERS.map(s=>`<option value="${s.id}" data-name="${s.societe}">${s.societe}</option>`).join(''); }
}

// CLIENTS
function initClients(role) {
  if (!document.getElementById('clientsTableBody')) return;
  renderClients(role);
  const searchEl = document.getElementById('clientSearch');
  if (searchEl) searchEl.addEventListener('input', () => renderClients(role, searchEl.value));
  document.getElementById('addClientBtn')?.addEventListener('click', () => openModal('clientModal'));
  document.getElementById('clientForm')?.addEventListener('submit', (e) => { e.preventDefault(); saveClient(role); });
  document.getElementById('clientModalClose')?.addEventListener('click', () => closeModal('clientModal'));
}
function renderClients(role, query='') {
  const tbody = document.getElementById('clientsTableBody');
  if (!tbody) return;
  let data = DEMO_CLIENTS;
  if (query) data = data.filter(c => JSON.stringify(c).toLowerCase().includes(query.toLowerCase()));
  tbody.innerHTML = data.map(c => `<tr>
    <td>${c.prenom} ${c.nom}</td>
    <td><strong>${c.societe}</strong></td>
    <td>${c.role}</td><td>${c.email}</td><td>${c.tel}</td><td>${c.pays}</td>
    <td><span class="badge-statut statut-${c.statut.toLowerCase().replace(/ /g,'')}">${c.statut}</span></td>
    <td><span class="badge-prio prio-${c.priorite.toLowerCase()}">${c.priorite}</span></td>
    <td class="notes-cell">${c.notes}</td>
  </tr>`).join('') || '<tr><td colspan="9" class="empty-state">Aucun client</td></tr>';
}
function saveClient(role) {
  const f = document.getElementById('clientForm');
  DEMO_CLIENTS.push({ id:'c'+Date.now(), prenom:f.querySelector('[name=prenom]').value, nom:f.querySelector('[name=nom]').value, societe:f.querySelector('[name=societe]').value, role:f.querySelector('[name=role]').value, email:f.querySelector('[name=email]').value||'–', tel:f.querySelector('[name=tel]').value||'–', pays:f.querySelector('[name=pays]').value||'–', langue:f.querySelector('[name=langue]').value||'–', statut:f.querySelector('[name=statut]').value, priorite:f.querySelector('[name=priorite]').value, categorie:f.querySelector('[name=categorie]').value||'Hospitality B2B', notes:f.querySelector('[name=notes]').value||'' });
  closeModal('clientModal'); f.reset(); renderClients(role); showToast('Client ajouté ✓');
}

// INVOICES
function initInvoices(role, userName) {
  if (!document.getElementById('invoicesContainer')) return;
  renderInvoices(role, userName);
  const sel = document.getElementById('invFournisseur');
  if (sel) sel.innerHTML = '<option value="">-- Sélectionner --</option>'+DEMO_SUPPLIERS.map(s=>`<option value="${s.id}" data-name="${s.societe}">${s.societe}</option>`).join('');
  const postesSel = document.getElementById('invPoste');
  if (postesSel) postesSel.innerHTML = '<option value="">-- Sélectionner --</option>'+ALL_POSTES.map(p=>`<option value="${p}">${p}</option>`).join('');
  document.getElementById('addInvoiceBtn')?.addEventListener('click', () => openModal('invoiceModal'));
  document.getElementById('invoiceForm')?.addEventListener('submit', (e) => { e.preventDefault(); saveInvoice(role, userName); });
  document.getElementById('invoiceModalClose')?.addEventListener('click', () => closeModal('invoiceModal'));
  document.getElementById('invoiceFilter')?.addEventListener('change', (e) => renderInvoices(role, userName, e.target.value));
}
function renderInvoices(role, userName, filter='all') {
  const tbody = document.getElementById('invoicesTableBody');
  const archTbody = document.getElementById('archivedInvoicesTableBody');
  if (!tbody) return;
  let active = DEMO_INVOICES.filter(i => !i.archived);
  let archived = DEMO_INVOICES.filter(i => i.archived);
  if (role === 'commercial') { active = active.filter(i=>i.assignee===userName); archived = archived.filter(i=>i.assignee===userName); }
  if (filter !== 'all') active = active.filter(i=>i.statut===filter);
  tbody.innerHTML = active.map(i => `<tr>
    <td><strong>${i.ref}</strong></td><td>${i.fournisseur}</td><td>${i.description}</td>
    <td class="amount">${fmt(i.montant)}</td>
    <td><span class="statut-inv statut-inv-${i.statut.replace(/ /g,'-')}">${i.statut}</span></td>
    <td>${fmtDate(i.date)}</td><td>${fmtDate(i.echeance)}</td><td>${i.poste||'–'}</td>
    <td class="actions-cell">
      <button class="btn-sm btn-archive" onclick="archiveInvoice('${i.id}','${role}','${userName}')">Archiver</button>
      <button class="btn-sm btn-cycle" onclick="cycleInvoiceStatut('${i.id}','${role}','${userName}')">↻</button>
    </td>
  </tr>`).join('') || '<tr><td colspan="9" class="empty-state">Aucune facture</td></tr>';
  if (archTbody) archTbody.innerHTML = archived.map(i => `<tr class="archived-row">
    <td>${i.ref}</td><td>${i.fournisseur}</td><td>${i.description}</td>
    <td class="amount">${fmt(i.montant)}</td>
    <td><span class="statut-inv statut-inv-archivée">archivée</span></td>
    <td>${fmtDate(i.date)}</td><td>${fmtDate(i.echeance)}</td><td>${i.poste||'–'}</td>
    <td><button class="btn-sm" onclick="unarchiveInvoice('${i.id}','${role}','${userName}')">Restaurer</button></td>
  </tr>`).join('') || '<tr><td colspan="9" class="empty-state">Aucune facture archivée</td></tr>';
  renderSupplierSpend(role, userName);
  if (role === 'founder') renderBudget();
  updateInvoiceStats(role, userName);
}
function updateInvoiceStats(role, userName) {
  let inv = DEMO_INVOICES.filter(i=>!i.archived);
  if (role==='commercial') inv = inv.filter(i=>i.assignee===userName);
  const total = inv.reduce((s,i)=>s+i.montant,0);
  const paid = inv.filter(i=>i.statut==='payée').reduce((s,i)=>s+i.montant,0);
  const late = inv.filter(i=>i.statut==='en retard').reduce((s,i)=>s+i.montant,0);
  const pending = inv.filter(i=>i.statut==='en cours').reduce((s,i)=>s+i.montant,0);
  const setEl = (id, v) => { const el = document.getElementById(id); if(el) el.textContent = v; };
  setEl('invStatTotal', fmt(total));
  setEl('invStatPaid', fmt(paid));
  setEl('invStatLate', fmt(late));
  setEl('invStatPending', fmt(pending));
}
function saveInvoice(role, userName) {
  const f = document.getElementById('invoiceForm');
  const selEl = document.getElementById('invFournisseur');
  const selOpt = selEl?.options[selEl.selectedIndex];
  DEMO_INVOICES.push({ id:'inv'+Date.now(), ref:f.querySelector('[name=ref]').value, fournisseur_id:selEl?.value||'', fournisseur:selOpt?.dataset.name||'', description:f.querySelector('[name=description]').value, montant:parseFloat(f.querySelector('[name=montant]').value)||0, statut:f.querySelector('[name=statut]').value, date:f.querySelector('[name=date]').value, echeance:f.querySelector('[name=echeance]').value, poste:f.querySelector('[name=poste]').value, tranche:f.querySelector('[name=tranche]').value, archived:false, assignee:userName });
  closeModal('invoiceModal'); f.reset(); renderInvoices(role, userName); showToast('Facture ajoutée ✓');
}
function archiveInvoice(id, role, userName) {
  const inv = DEMO_INVOICES.find(i=>i.id===id);
  if (inv) { inv.archived=true; inv.statut='archivée'; }
  renderInvoices(role, userName); showToast('Facture archivée');
}
function unarchiveInvoice(id, role, userName) {
  const inv = DEMO_INVOICES.find(i=>i.id===id);
  if (inv) { inv.archived=false; inv.statut='payée'; }
  renderInvoices(role, userName); showToast('Facture restaurée');
}
function cycleInvoiceStatut(id, role, userName) {
  const cycles = ['en cours','en retard','payée'];
  const inv = DEMO_INVOICES.find(i=>i.id===id);
  if (!inv) return;
  const idx = cycles.indexOf(inv.statut);
  inv.statut = cycles[(idx+1)%cycles.length];
  renderInvoices(role, userName);
}
function renderSupplierSpend(role, userName) {
  const container = document.getElementById('supplierSpendChart');
  if (!container) return;
  let invoices = DEMO_INVOICES.filter(i=>!i.archived);
  if (role==='commercial') invoices = invoices.filter(i=>i.assignee===userName);
  const bySupplier = {};
  invoices.forEach(i=>{ bySupplier[i.fournisseur] = (bySupplier[i.fournisseur]||0) + i.montant; });
  const sorted = Object.entries(bySupplier).sort((a,b)=>b[1]-a[1]).slice(0,8);
  const max = sorted[0]?.[1]||1;
  container.innerHTML = sorted.map(([name,amt]) => `
    <div class="spend-row">
      <div class="spend-label">${name}</div>
      <div class="spend-bar-wrap"><div class="spend-bar" style="width:${(amt/max*100).toFixed(1)}%"></div></div>
      <div class="spend-amount">${fmt(amt)}</div>
    </div>
  `).join('') || '<p class="empty-state">Aucune donnée</p>';
}

// BUDGET
function initBudget() {
  if (!document.getElementById('budgetContainer')) return;
  renderBudget();
}
function renderBudget() {
  const container = document.getElementById('budgetContainer');
  if (!container) return;
  const fromInv = getBudgetFromInvoices();
  let totalBudget=0, totalEngaged=0, totalPaid=0;
  container.innerHTML = BUDGET_CATEGORIES.map(cat => {
    const rows = cat.postes.map(poste => {
      const bt = poste.budget_t1 + poste.budget_t2 + poste.budget_t3;
      const inv = fromInv[poste.label]||{engaged:0,paid:0};
      const restant = bt - inv.engaged;
      const pct = bt>0 ? Math.min(100, inv.engaged/bt*100) : 0;
      totalBudget+=bt; totalEngaged+=inv.engaged; totalPaid+=inv.paid;
      return `<tr>
        <td>${poste.label}</td>
        <td class="amount">${fmt(poste.budget_t1)}</td>
        <td class="amount">${fmt(poste.budget_t2)}</td>
        <td class="amount">${fmt(poste.budget_t3)}</td>
        <td class="amount"><strong>${fmt(bt)}</strong></td>
        <td class="amount engaged">${fmt(inv.engaged)}</td>
        <td class="amount paid">${fmt(inv.paid)}</td>
        <td class="amount ${restant<0?'over-budget':''}">${fmt(restant)}</td>
        <td><div class="budget-progress-wrap"><div class="budget-progress-fill ${pct>=90?'over':pct>=70?'warn':''}" style="width:${pct}%"></div></div><span class="budget-pct">${pct.toFixed(0)}%</span></td>
      </tr>`;
    }).join('');
    return `<tr class="budget-cat-header"><td colspan="9">📂 ${cat.categorie}</td></tr>${rows}`;
  }).join('');
  const summary = document.getElementById('budgetSummary');
  if (summary) {
    const restant = totalBudget-totalEngaged;
    summary.innerHTML = `
      <div class="budget-kpi"><span>Budget total</span><strong>${fmt(totalBudget)}</strong></div>
      <div class="budget-kpi"><span>Engagé</span><strong class="engaged">${fmt(totalEngaged)}</strong></div>
      <div class="budget-kpi"><span>Payé</span><strong class="paid">${fmt(totalPaid)}</strong></div>
      <div class="budget-kpi"><span>Restant</span><strong class="${restant<0?'over-budget':''}">${fmt(restant)}</strong></div>
    `;
  }
}

// CALCULATOR
function initCalculator() {
  if (!document.getElementById('calculatorContainer')) return;
  const destSel = document.getElementById('calcDestination');
  if (destSel) {
    destSel.innerHTML = Object.entries(CALC_DESTINATIONS).map(([k,v])=>`<option value="${k}">${v.label}</option>`).join('');
    destSel.addEventListener('change', loadDestinationParams);
  }
  loadDestinationParams();
  document.getElementById('runCalculator')?.addEventListener('click', runCalculator);
}
function loadDestinationParams() {
  const destSel = document.getElementById('calcDestination');
  if (!destSel) return;
  const dest = CALC_DESTINATIONS[destSel.value];
  if (!dest) return;
  const p = dest.params;
  const fields = { calcFreq:p.frequentation, calcAdoption:p.tauxAdoption, calcHaute:p.hauteSaison, calcEpaule:p.saisonEpaule, calcPrixBrum:p.prixBrumisation, calcCoutMachine:p.coutMachineBKK, calcCoutRefill:p.coutRefillLabo5L, calcNayax:p.fraisNayax, calcNbMachines:p.nbMachines, calcAbonA:p.abonnementA, calcRefillA:p.prixRefillA, calcOffertA:p.refillsOffertsMoisA, calcAbonB:p.abonnementB, calcPrixRefillB:p.prixRefillEtablB, calcPrixMachineE:p.prixVenteMachineE, calcRefillE:p.prixVenteRefillE, calcMaintenanceE:p.maintenanceAnnuelleE, calcMixA:40, calcMixB:20, calcMixD:30, calcMixE:10 };
  Object.entries(fields).forEach(([id,val])=>{ const el=document.getElementById(id); if(el) el.value=val; });
}
function runCalculator() {
  const destSel = document.getElementById('calcDestination');
  if (!destSel) return;
  const g = id => parseFloat(document.getElementById(id)?.value)||0;
  const p = { frequentation:g('calcFreq'), tauxAdoption:g('calcAdoption'), joursMois:25, hauteSaison:g('calcHaute'), saisonEpaule:g('calcEpaule'), prixBrumisation:g('calcPrixBrum'), consommationMl:30, coutMachineBKK:g('calcCoutMachine'), coutRefillLabo5L:g('calcCoutRefill'), fraisNayax:g('calcNayax'), nbMachines:g('calcNbMachines'), abonnementA:g('calcAbonA'), prixRefillA:g('calcRefillA'), refillsOffertsMoisA:g('calcOffertA'), abonnementB:g('calcAbonB'), prixRefillEtablB:g('calcPrixRefillB'), partEtablB:50, prixVenteMachineE:g('calcPrixMachineE'), prixVenteRefillE:g('calcRefillE'), maintenanceAnnuelleE:g('calcMaintenanceE'), commissionSolaireE:8 };
  const r = calcHelios(p);
  const mixResult = calcMix({ destination:destSel.value, pctA:g('calcMixA'), pctB:g('calcMixB'), pctD:g('calcMixD'), pctE:g('calcMixE') }, p.nbMachines);
  const out = document.getElementById('calcResults');
  if (!out) return;
  out.innerHTML = `
    <div class="calc-section">
      <h3>📊 Indicateurs clés</h3>
      <div class="calc-kpis">
        <div class="calc-kpi"><span>Passages/jour</span><strong>${fmtNum(r.passagesJour,1)}</strong></div>
        <div class="calc-kpi"><span>Passages/an</span><strong>${fmtNum(r.passagesAnnuels,0)}</strong></div>
        <div class="calc-kpi"><span>Refills annuels 5L</span><strong>${r.refillsAnnuels}</strong></div>
        <div class="calc-kpi"><span>CA brut/an</span><strong>${fmt(r.caBrut)}</strong></div>
        <div class="calc-kpi"><span>CA net (après Nayax)</span><strong>${fmt(r.caNet)}</strong></div>
        <div class="calc-kpi"><span>Coût refills labo/an</span><strong>${fmt(r.coutRefillsLabo)}</strong></div>
      </div>
    </div>
    <div class="calc-section">
      <h3>🔄 Comparatif modèles — 1 machine/an</h3>
      <div class="models-grid">
        <div class="model-card model-a"><div class="model-label">Modèle A — Service offert</div><div class="model-profit">${fmt(r.modelA.profitSolaire)}</div><div class="model-sub">Solaire/machine/an</div><div class="model-detail">Abons: ${fmt(r.modelA.caAbonnements)} · Refills: ${fmt(r.modelA.caRefills)}</div></div>
        <div class="model-card model-b"><div class="model-label">Modèle B — Partage 50/50</div><div class="model-profit">${fmt(r.modelB.profitSolaire)}</div><div class="model-sub">Solaire/machine/an</div><div class="model-detail">Établissement: ${fmt(r.modelB.profitEtabl)}/an</div></div>
        <div class="model-card model-d"><div class="model-label">Modèle D — 100% Solaire</div><div class="model-profit">${fmt(r.modelD.profitSolaire)}</div><div class="model-sub">Solaire/machine/an</div><div class="model-detail">CA net − coût labo</div></div>
        <div class="model-card model-e"><div class="model-label">Modèle E — Vente machine</div><div class="model-profit">${fmt(r.modelE.profitSolaireY1)}</div><div class="model-sub">Solaire/machine — Année 1</div><div class="model-detail">Année 2+: ${fmt(r.modelE.profitSolaireY2)} · Marge: ${fmt(r.modelE.margeMachine)}</div></div>
      </div>
    </div>
    <div class="calc-section">
      <h3>🚀 Projection ${p.nbMachines} machines</h3>
      <div class="calc-kpis">
        <div class="calc-kpi"><span>Modèle A × ${p.nbMachines}</span><strong>${fmt(r.modelA.profitMachines)}</strong></div>
        <div class="calc-kpi"><span>Modèle B × ${p.nbMachines}</span><strong>${fmt(r.modelB.profitMachines)}</strong></div>
        <div class="calc-kpi"><span>Modèle D × ${p.nbMachines}</span><strong>${fmt(r.modelD.profitMachines)}</strong></div>
        <div class="calc-kpi"><span>Modèle E × ${p.nbMachines} (Y1)</span><strong>${fmt(r.modelE.profitMachinesY1)}</strong></div>
      </div>
    </div>
    ${mixResult ? `<div class="calc-section"><h3>🎯 Simulateur de mix</h3><div class="mix-result">
      <div class="mix-row"><span>Modèle A (${g('calcMixA')}%) — ${mixResult.nbA} machines</span><strong>${fmt(mixResult.profitA)}</strong></div>
      <div class="mix-row"><span>Modèle B (${g('calcMixB')}%) — ${mixResult.nbB} machines</span><strong>${fmt(mixResult.profitB)}</strong></div>
      <div class="mix-row"><span>Modèle D (${g('calcMixD')}%) — ${mixResult.nbD} machines</span><strong>${fmt(mixResult.profitD)}</strong></div>
      <div class="mix-row"><span>Modèle E (${g('calcMixE')}%) — ${mixResult.nbE} machines</span><strong>${fmt(mixResult.profitE)}</strong></div>
      <div class="mix-row mix-total"><span>PROFIT TOTAL MIX</span><strong>${fmt(mixResult.total)}</strong></div>
      <div class="mix-target ${mixResult.total>=500000?'target-ok':'target-ko'}">${mixResult.total>=500000?'✓ Objectif €500K atteint':'✗ Objectif €500K non atteint'}</div>
    </div></div>` : ''}
  `;
  out.style.display = 'block';
}
