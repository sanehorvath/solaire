// ============================================================
// SOLAIRE — DATA.JS
// ============================================================

const DEMO_LOGINS = {
  'sane@solaire.com':    { pwd: 'demo1234', role: 'founder',    name: 'Sane' },
  'matheo@solaire.com':  { pwd: 'demo1234', role: 'founder',    name: 'Mathéo' },
  'clement@solaire.com': { pwd: 'demo1234', role: 'founder',    name: 'Clément' },
  'hugo@solaire.com':    { pwd: 'demo1234', role: 'founder',    name: 'Hugo' },
  'lucas@solaire.com':   { pwd: 'demo1234', role: 'commercial', name: 'Lucas' },
  'sarah@solaire.com':   { pwd: 'demo1234', role: 'commercial', name: 'Sarah' },
};

function authLogin(email, password) {
  const u = DEMO_LOGINS[email.toLowerCase()];
  if (!u || u.pwd !== password) return null;
  const session = { email, role: u.role, name: u.name };
  localStorage.setItem('solaire_session', JSON.stringify(session));
  return session;
}
function authLogout() { localStorage.removeItem('solaire_session'); }
function authGetSession() {
  try { return JSON.parse(localStorage.getItem('solaire_session')); } catch { return null; }
}

// ---- OBJECTIVES ----
const DEMO_OBJECTIVES = [
  { id:'obj1', title:'Déploiement 50 machines Pouquet', progress:24, category:'Développement', owner:'Sane', deadline:'2026-09-01' },
  { id:'obj2', title:'Valider ODM Bangkok (BT Spaceship)', progress:60, category:'Production', owner:'Mathéo', deadline:'2026-05-15' },
  { id:'obj3', title:'Lever fonds série seed', progress:10, category:'Finance', owner:'Sane', deadline:'2026-12-01' },
  { id:'obj4', title:'Signature contrat Aquatonale', progress:40, category:'Production', owner:'Clément', deadline:'2026-06-30' },
  { id:'obj5', title:'Onboard 3 hôtels pilotes', progress:15, category:'Commercial', owner:'Lucas', deadline:'2026-07-01' },
];

// ---- TASKS ----
const DEMO_TASKS = [
  { id:'t1', title:'Réunion confirmation BT Spaceship', status:'todo', priority:'high', assignee:'Mathéo', due:'2026-04-25', tags:['ODM'] },
  { id:'t2', title:'Envoyer devis modèle A à Pouquet', status:'in-progress', priority:'high', assignee:'Lucas', due:'2026-04-22', tags:['Commercial'] },
  { id:'t3', title:'Vérifier MOQ Aquatonale SPF50+', status:'todo', priority:'medium', assignee:'Clément', due:'2026-04-30', tags:['Production'] },
  { id:'t4', title:'Draft contrat FRANK Legal', status:'done', priority:'medium', assignee:'Sane', due:'2026-04-18', tags:['Legal'] },
  { id:'t5', title:'Préparer pitch investisseurs', status:'in-progress', priority:'high', assignee:'Sane', due:'2026-05-10', tags:['Finance'] },
  { id:'t6', title:'Commander prototypes kiosque UV', status:'todo', priority:'medium', assignee:'Hugo', due:'2026-05-05', tags:['Tech'] },
  { id:'t7', title:'Relance Fret Free Productions', status:'todo', priority:'low', assignee:'Lucas', due:'2026-05-01', tags:['Logistique'] },
  { id:'t8', title:'Mettre à jour CRM fournisseurs', status:'done', priority:'low', assignee:'Sarah', due:'2026-04-17', tags:['CRM'] },
];

// ---- CALENDAR ----
const DEMO_APPOINTMENTS = [
  { id:'ev1', title:'RDV BT Spaceship', date:'2026-04-25', time:'10:00', location:'Bangkok', type:'meeting', assignee:'Mathéo' },
  { id:'ev2', title:'Call Aquatonale FZC', date:'2026-04-28', time:'14:00', location:'Zoom', type:'call', assignee:'Clément' },
  { id:'ev3', title:'Réunion équipe Solaire', date:'2026-04-22', time:'09:00', location:'Bangkok', type:'internal', assignee:'Sane' },
  { id:'ev4', title:'Demo Pouquet Helios', date:'2026-05-03', time:'11:00', location:'Pouquet Beach Club', type:'demo', assignee:'Lucas' },
  { id:'ev5', title:'RDV HLB Thailand – compta', date:'2026-05-07', time:'15:00', location:'Bangkok', type:'meeting', assignee:'Sane' },
];

// ---- SUPPLIERS ----
let DEMO_SUPPLIERS = [
  { id:'s1', prenom:'Sittidej', nom:'Somprakit', societe:'B.T. Spaceship', role:'Sales & Marketing Director', email:'–', tel:'+66 82 229 4646', pays:'Bangkok, TH', langue:'TH/EN', statut:'Actif', priorite:'Haute', categorie:'ODM & Manufacturing', notes:'ODM Bangkok principal. Devis reçu 9 avr (valide 23 avr). Réunion confirmée 8 avr.' },
  { id:'s2', prenom:'Renna', nom:'A.', societe:'Aquatonale FZC', role:'Sales Manager', email:'sales@aquatonale.ae', tel:'–', pays:'Sharjah, UAE', langue:'EN/AR', statut:'Actif', priorite:'Haute', categorie:'ODM & Manufacturing', notes:'Devis SCL091025 — Sun Water SPF50 120ml / 9.38 AED. MOQ 1,250. Clarifier SPF50+ PA++++ next-gen filters.' },
  { id:'s3', prenom:'Kalea', nom:'–', societe:'Guangzhou Youthtour Plastic Co.', role:'Account Manager', email:'–', tel:'+86 186 6398 2276', pays:'Guangzhou, CN', langue:'ZH/EN', statut:'Actif', priorite:'Moyenne', categorie:'Packaging & Équipement', notes:'Flacons & emballages packaging.' },
  { id:'s4', prenom:'Meng', nom:'Wang', societe:'TCN / Changsha Zhonggu', role:'Account Manager', email:'–', tel:'–', pays:'Changsha, CN', langue:'ZH/EN', statut:'Actif', priorite:'Haute', categorie:'Packaging & Équipement', notes:'Machines Helios kiosque — fournisseur principal.' },
  { id:'s5', prenom:'Dan', nom:'–', societe:'UV Equipment Specialist', role:'Partenaire technologique kiosque', email:'–', tel:'–', pays:'–', langue:'EN', statut:'Actif', priorite:'Moyenne', categorie:'Packaging & Équipement', notes:'Technologie UV kiosque Helios.' },
  { id:'s6', prenom:'–', nom:'–', societe:'MaxMax / LDP LLC', role:'Fournisseur caméra UV', email:'–', tel:'–', pays:'USA', langue:'EN', statut:'En veille', priorite:'Basse', categorie:'Packaging & Équipement', notes:'Caméra UV pour kiosque.' },
  { id:'s7', prenom:'–', nom:'–', societe:'Fret Free Productions', role:'Fabricant enclosure kiosque', email:'info@fretfreeproductions.com', tel:'–', pays:'Bangkok, TH', langue:'EN', statut:'Actif', priorite:'Moyenne', categorie:'Packaging & Équipement', notes:'Enclosure/boîtier kiosque Helios.' },
  { id:'s8', prenom:'Paul', nom:'Ashburn', societe:'HLB Thailand', role:'Partner', email:'paul.a@hlbthailand.com', tel:'+66 81 499 5707', pays:'Bangkok, TH', langue:'EN', statut:'Actif', priorite:'Haute', categorie:'Legal & Corporate', notes:'Comptabilité & structuration Thaïlande.' },
  { id:'s9', prenom:'Wimontri', nom:'Kaewprachum', societe:'FRANK Legal & Tax Ltd.', role:'Secretary', email:'porramutt@franklegaltax.com', tel:'+66 (0) 2 026 3284', pays:'Bangkok, TH', langue:'TH/EN', statut:'Actif', priorite:'Haute', categorie:'Legal & Corporate', notes:'Conseil juridique & BOI structuration.' },
  { id:'s10', prenom:'Lewis', nom:'–', societe:'Un Hour', role:'CEO', email:'–', tel:'+44 7402 262171', pays:'Bangkok', langue:'EN', statut:'En veille', priorite:'Basse', categorie:'Divers', notes:'Contact divers — à qualifier.' },
  { id:'s11', prenom:'–', nom:'–', societe:'Lumson', role:'–', email:'–', tel:'–', pays:'Italie', langue:'EN', statut:'En veille', priorite:'Basse', categorie:'Packaging & Équipement', notes:'Flacon + pompe intégrés.' },
  { id:'s12', prenom:'–', nom:'–', societe:'Aptar', role:'–', email:'–', tel:'–', pays:'FR/Global', langue:'FR/EN', statut:'En veille', priorite:'Basse', categorie:'Packaging & Équipement', notes:'Fournisseur pompe premium.' },
];

// ---- CLIENTS ----
let DEMO_CLIENTS = [
  { id:'c1', prenom:'Jean-Baptiste', nom:'Pouquet', societe:'Pouquet Beach Club', role:'Directeur', email:'jb@pouquet.fr', tel:'+66 81 234 5678', pays:'Koh Samui, TH', langue:'FR', statut:'Actif', priorite:'Haute', categorie:'Hospitality B2B', notes:'Destination pilote Helios. 50 machines. Saison nov→avr.' },
  { id:'c2', prenom:'Marc', nom:'Durand', societe:'Aqua Resort Phuket', role:'GM', email:'marc.d@aquaresort.com', tel:'+66 89 765 4321', pays:'Phuket, TH', langue:'FR/EN', statut:'Prospect', priorite:'Haute', categorie:'Hospitality B2B', notes:'Intéressé par déploiement modèle B.' },
  { id:'c3', prenom:'Sophie', nom:'Marchand', societe:'Blue Lagoon Koh Phangan', role:'Owner', email:'sophie@bluelagoon.co.th', tel:'+66 82 111 2233', pays:'Koh Phangan, TH', langue:'FR', statut:'Prospect', priorite:'Moyenne', categorie:'Hospitality B2B', notes:'Premier contact via réseau.' },
  { id:'c4', prenom:'David', nom:'Lim', societe:'Marina Bay Hotel BKK', role:'F&B Director', email:'david.lim@marina.th', tel:'+66 2 345 6789', pays:'Bangkok, TH', langue:'EN', statut:'Prospect', priorite:'Moyenne', categorie:'Hospitality B2B', notes:'Cherche solution sunscreen premium pour beach club rooftop.' },
  { id:'c5', prenom:'Nathalie', nom:'Bouvet', societe:'Eden Beach Koh Chang', role:'Gérante', email:'nat@edenkohchang.com', tel:'+66 83 445 5566', pays:'Koh Chang, TH', langue:'FR', statut:'En veille', priorite:'Basse', categorie:'Hospitality B2B', notes:'Saison creuse — à recontacter oct 2026.' },
];

// ---- INVOICES ----
let DEMO_INVOICES = [
  { id:'inv1', ref:'FAC-2026-001', fournisseur_id:'s4', fournisseur:'TCN / Changsha Zhonggu', description:'Acompte machines Helios x10', montant:8500, statut:'payée', date:'2026-02-15', echeance:'2026-03-15', poste:'Machines & équipements', tranche:'T1', archived:false, assignee:'Sane' },
  { id:'inv2', ref:'FAC-2026-002', fournisseur_id:'s1', fournisseur:'B.T. Spaceship', description:'Prototype formule ODM #1', montant:3200, statut:'payée', date:'2026-03-01', echeance:'2026-03-31', poste:'R&D Formulation', tranche:'T1', archived:false, assignee:'Mathéo' },
  { id:'inv3', ref:'FAC-2026-003', fournisseur_id:'s9', fournisseur:'FRANK Legal & Tax Ltd.', description:'Frais structuration juridique BOI', montant:4500, statut:'en cours', date:'2026-04-01', echeance:'2026-04-30', poste:'Juridique & Structure', tranche:'T2', archived:false, assignee:'Sane' },
  { id:'inv4', ref:'FAC-2026-004', fournisseur_id:'s8', fournisseur:'HLB Thailand', description:'Comptabilité Q1 2026', montant:1800, statut:'en retard', date:'2026-03-15', echeance:'2026-04-15', poste:'Comptabilité', tranche:'T1', archived:false, assignee:'Sane' },
  { id:'inv5', ref:'FAC-2026-005', fournisseur_id:'s7', fournisseur:'Fret Free Productions', description:'Maquette enclosure kiosque v1', montant:2200, statut:'en cours', date:'2026-04-10', echeance:'2026-05-10', poste:'Machines & équipements', tranche:'T2', archived:false, assignee:'Lucas' },
  { id:'inv6', ref:'FAC-2026-006', fournisseur_id:'s2', fournisseur:'Aquatonale FZC', description:'MOQ initial Sun Water SPF50 1250 unités', montant:12000, statut:'en cours', date:'2026-04-15', echeance:'2026-05-15', poste:'R&D Formulation', tranche:'T2', archived:false, assignee:'Clément' },
];

// ---- BUDGET POSTES (labels must match invoice poste values) ----
const BUDGET_CATEGORIES = [
  { id:'b1', categorie:'R&D & Formulation', postes:[
    { id:'b1a', label:'R&D Formulation', budget_t1:10000, budget_t2:15000, budget_t3:8000 },
    { id:'b1b', label:'Tests & certifications', budget_t1:5000, budget_t2:5000, budget_t3:3000 },
  ]},
  { id:'b2', categorie:'Machines & Production', postes:[
    { id:'b2a', label:'Machines & équipements', budget_t1:20000, budget_t2:30000, budget_t3:25000 },
    { id:'b2b', label:'Packaging & flacons', budget_t1:8000, budget_t2:12000, budget_t3:10000 },
    { id:'b2c', label:'Logistique & fret', budget_t1:5000, budget_t2:7000, budget_t3:6000 },
  ]},
  { id:'b3', categorie:'Juridique & Finance', postes:[
    { id:'b3a', label:'Juridique & Structure', budget_t1:6000, budget_t2:4000, budget_t3:2000 },
    { id:'b3b', label:'Comptabilité', budget_t1:2400, budget_t2:2400, budget_t3:2400 },
    { id:'b3c', label:'Assurances', budget_t1:1500, budget_t2:1500, budget_t3:1500 },
  ]},
  { id:'b4', categorie:'Marketing & Commercial', postes:[
    { id:'b4a', label:'Marketing & branding', budget_t1:8000, budget_t2:12000, budget_t3:10000 },
    { id:'b4b', label:'Déplacements & démos', budget_t1:4000, budget_t2:6000, budget_t3:5000 },
  ]},
  { id:'b5', categorie:'Opérations', postes:[
    { id:'b5a', label:'Loyer & bureaux', budget_t1:3600, budget_t2:3600, budget_t3:3600 },
    { id:'b5b', label:'Outils & SaaS', budget_t1:2400, budget_t2:2400, budget_t3:2400 },
    { id:'b5c', label:'Divers opérationnel', budget_t1:3000, budget_t2:3000, budget_t3:3000 },
  ]},
];

// All unique poste labels (for invoice dropdown)
const ALL_POSTES = BUDGET_CATEGORIES.flatMap(c => c.postes.map(p => p.label));

// ---- CALCULATEUR HELIOS ----
const CALC_DESTINATIONS = {
  pouquet: {
    label: 'Pouquet Beach Club (Koh Samui)',
    params: {
      frequentation: 350, tauxAdoption: 15,
      joursMois: 25, hauteSaison: 6, saisonEpaule: 2,
      prixBrumisation: 1.67, consommationMl: 30,
      coutMachineBKK: 1340, coutRefillLabo5L: 65, fraisNayax: 3,
      abonnementA: 750, prixRefillA: 192, refillsOffertsMoisA: 1,
      abonnementB: 200, prixRefillEtablB: 70, partEtablB: 50,
      prixVenteMachineE: 3500, prixVenteRefillE: 141,
      maintenanceAnnuelleE: 615, commissionSolaireE: 8,
      nbMachines: 50,
    }
  }
};
