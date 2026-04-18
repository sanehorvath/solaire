// ============================================================
// SOLAIRE — UTILS.JS
// ============================================================

// ---- THEME ----
function initTheme() {
  const saved = localStorage.getItem('solaire_theme') || 'dark';
  applyTheme(saved);
}
function applyTheme(theme) {
  if (theme === 'light') {
    document.body.classList.add('light');
  } else {
    document.body.classList.remove('light');
  }
  localStorage.setItem('solaire_theme', theme);
  const btn = document.getElementById('themeToggle');
  if (btn) btn.textContent = theme === 'light' ? '🌙' : '☀️';
}
function toggleTheme() {
  const current = localStorage.getItem('solaire_theme') || 'dark';
  applyTheme(current === 'dark' ? 'light' : 'dark');
}

// ---- FORMAT ----
function fmt(n) {
  if (n == null || isNaN(n)) return '–';
  return new Intl.NumberFormat('fr-FR', { style:'currency', currency:'EUR', maximumFractionDigits:0 }).format(n);
}
function fmtDate(str) {
  if (!str) return '–';
  const d = new Date(str);
  return d.toLocaleDateString('fr-FR', { day:'2-digit', month:'2-digit', year:'numeric' });
}
function fmtNum(n, decimals=0) {
  if (n == null || isNaN(n)) return '–';
  return n.toLocaleString('fr-FR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

// ---- MODAL ----
function closeModal(id) {
  const m = document.getElementById(id);
  if (m) m.classList.remove('active');
}
function openModal(id) {
  const m = document.getElementById(id);
  if (m) m.classList.add('active');
}

// ---- TOAST ----
function showToast(msg, type='success') {
  let t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.className = 'toast ' + type + ' show';
  setTimeout(() => t.classList.remove('show'), 3000);
}

// ---- BUDGET FROM INVOICES ----
// Returns { [posteLabel]: { engaged: number, paid: number, byTranche: { T1, T2, T3 } } }
function getBudgetFromInvoices() {
  const result = {};
  const activeInvoices = DEMO_INVOICES.filter(inv => !inv.archived);
  for (const inv of activeInvoices) {
    if (!inv.poste) continue;
    if (!result[inv.poste]) {
      result[inv.poste] = { engaged: 0, paid: 0, byTranche: { T1:0, T2:0, T3:0 } };
    }
    const entry = result[inv.poste];
    const tranche = inv.tranche || 'T1';
    if (inv.statut === 'payée') {
      entry.paid += inv.montant;
      entry.engaged += inv.montant;
    } else if (inv.statut !== 'archivée') {
      entry.engaged += inv.montant;
    }
    if (entry.byTranche[tranche] !== undefined) {
      entry.byTranche[tranche] += inv.montant;
    }
  }
  return result;
}

// ---- HELIOS CALCULATOR ENGINE ----
function calcHelios(p) {
  // Passages
  const passagesJour = p.frequentation * (p.tauxAdoption / 100);
  const passagesHaute = passagesJour * p.joursMois * p.hauteSaison;
  const passagesEpaule = passagesJour * p.joursMois * p.saisonEpaule * 0.5;
  const passagesAnnuels = passagesHaute + passagesEpaule;
  const volumeLitres = passagesAnnuels * (p.consommationMl / 1000);
  const refillsAnnuels = Math.ceil(volumeLitres / 5);
  const moisActifs = p.hauteSaison + p.saisonEpaule;

  // CA
  const caBrut = passagesAnnuels * p.prixBrumisation;
  const caNet = caBrut * (1 - p.fraisNayax / 100);

  // Coût refills labo annuel
  const coutRefillsLabo = refillsAnnuels * p.coutRefillLabo5L;

  // Modèle A
  const refillsFacturesA = Math.max(0, refillsAnnuels - p.refillsOffertsMoisA * moisActifs);
  const caAbonnementsA = p.abonnementA * moisActifs;
  const caRefillsA = refillsFacturesA * p.prixRefillA;
  const profitSolaireA = caAbonnementsA + caRefillsA - coutRefillsLabo;

  // Modèle B
  const partSolaireB = caNet * 0.5;
  const partEtablB = caNet * 0.5;
  const caAbonnementsB = p.abonnementB * moisActifs;
  const caRefillsB = refillsAnnuels * p.prixRefillEtablB;
  const profitEtablB = partEtablB - caAbonnementsB - caRefillsB;
  const profitSolaireB = partSolaireB + caAbonnementsB + caRefillsB - coutRefillsLabo;

  // Modèle D
  const profitSolaireD = caNet - coutRefillsLabo;

  // Modèle E
  const revenusClients90 = caNet * 0.92; // hors commission 8%
  const commissionSolaire = caNet * (p.commissionSolaireE / 100);
  const refillsVendusE = refillsAnnuels * p.prixVenteRefillE;
  const coutRefillsVendusE = coutRefillsLabo;
  const margeRefillsE = refillsVendusE - coutRefillsVendusE;
  const margeMachineE = p.prixVenteMachineE - p.coutMachineBKK;
  const profitSolaireE_Y1 = margeMachineE + p.maintenanceAnnuelleE + margeRefillsE + commissionSolaire;
  const profitSolaireE_Y2 = p.maintenanceAnnuelleE + margeRefillsE + commissionSolaire;
  const profitEtablE = revenusClients90 - refillsVendusE - p.maintenanceAnnuelleE;

  return {
    passagesJour, passagesHaute, passagesEpaule, passagesAnnuels,
    volumeLitres, refillsAnnuels, moisActifs, caBrut, caNet, coutRefillsLabo,
    modelA: {
      profitSolaire: profitSolaireA,
      profitMachines: profitSolaireA * p.nbMachines,
      caAbonnements: caAbonnementsA, caRefills: caRefillsA,
    },
    modelB: {
      profitSolaire: profitSolaireB,
      profitMachines: profitSolaireB * p.nbMachines,
      profitEtabl: profitEtablB,
    },
    modelD: {
      profitSolaire: profitSolaireD,
      profitMachines: profitSolaireD * p.nbMachines,
    },
    modelE: {
      profitSolaireY1: profitSolaireE_Y1,
      profitSolaireY2: profitSolaireE_Y2,
      profitMachinesY1: profitSolaireE_Y1 * p.nbMachines,
      profitEtabl: profitEtablE,
      margeMachine: margeMachineE,
      maintenanceAnnuelle: p.maintenanceAnnuelleE,
      margeRefills: margeRefillsE,
      commission: commissionSolaire,
    },
  };
}

// Mix simulator
function calcMix(r, nbMachinesTotal) {
  const dest = CALC_DESTINATIONS[r.destination];
  if (!dest) return null;
  const p = { ...dest.params, nbMachines: nbMachinesTotal };
  const calc = calcHelios(p);
  const nbA = Math.round(nbMachinesTotal * r.pctA / 100);
  const nbB = Math.round(nbMachinesTotal * r.pctB / 100);
  const nbD = Math.round(nbMachinesTotal * r.pctD / 100);
  const nbE = nbMachinesTotal - nbA - nbB - nbD;
  const profitA = calc.modelA.profitSolaire * nbA;
  const profitB = calc.modelB.profitSolaire * nbB;
  const profitD = calc.modelD.profitSolaire * nbD;
  const profitE = calc.modelE.profitSolaireY1 * nbE;
  return { nbA, nbB, nbD, nbE, profitA, profitB, profitD, profitE, total: profitA+profitB+profitD+profitE };
}
