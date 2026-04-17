// SUPABASE CONFIG — Remplacer après setup
const SUPABASE_URL = 'https://VOTRE_PROJECT_ID.supabase.co';
const SUPABASE_ANON_KEY = 'VOTRE_ANON_KEY';

// DEMO DATA
const DEMO_DATA = {
  profiles: [
    { id: '11111111-1111-1111-1111-111111111111', name: 'Sane', role: 'founder', avatar_color: '#F59E0B', email: 'sane@solaire.com' },
    { id: '22222222-2222-2222-2222-222222222222', name: 'Mathéo', role: 'founder', avatar_color: '#3B82F6', email: 'matheo@solaire.com' },
    { id: '33333333-3333-3333-3333-333333333333', name: 'Clément', role: 'founder', avatar_color: '#8B5CF6', email: 'clement@solaire.com' },
    { id: '44444444-4444-4444-4444-444444444444', name: 'Hugo', role: 'founder', avatar_color: '#10B981', email: 'hugo@solaire.com' },
    { id: '55555555-5555-5555-5555-555555555555', name: 'Lucas', role: 'commercial', avatar_color: '#EF4444', email: 'lucas@solaire.com' },
    { id: '66666666-6666-6666-6666-666666666666', name: 'Sarah', role: 'commercial', avatar_color: '#EC4899', email: 'sarah@solaire.com' }
  ],
  objectives: [
    { id: 'obj1', title: 'Finaliser dossier R&D T1', description: 'Valider tests SPF, obtenir certifications CE et G-Mark avant M4', deadline: '2024-08-01', progress: 35, status: 'en_cours' },
    { id: 'obj2', title: 'Lancement campagne influence MENA', description: 'Signer 5-7 macro-influenceurs et lancer les premiers contenus', deadline: '2024-11-15', progress: 10, status: 'en_cours' },
    { id: 'obj3', title: 'Ouverture bureau Dubai', description: 'Trouver et signer bureau vitrine + recruter assistante locale', deadline: '2024-07-01', progress: 60, status: 'en_cours' },
    { id: 'obj4', title: 'Production 50 machines T2', description: 'Superviser fabrication première série et valider QC', deadline: '2024-09-30', progress: 5, status: 'en_cours' },
    { id: 'obj5', title: 'Lever les 1.15M€', description: 'Finaliser la levée de fonds Tranche 1 avec investisseurs cibles', deadline: '2024-06-30', progress: 80, status: 'en_cours' }
  ],
  tasks: [
    { id: 't1', title: 'Contacter labo SPF en Suisse', description: 'Demander devis tests SPF in vivo — minimum 3 labos', assigned_to: '22222222-2222-2222-2222-222222222222', objective_id: 'obj1', priority: 'haute', deadline: '2024-05-20', status: 'en_cours', created_by: '11111111-1111-1111-1111-111111111111' },
    { id: 't2', title: 'Rédiger NDA fournisseurs machines', description: 'Template NDA à soumettre à tous les fournisseurs', assigned_to: '33333333-3333-3333-3333-333333333333', objective_id: 'obj1', priority: 'haute', deadline: '2024-05-15', status: 'termine', created_by: '11111111-1111-1111-1111-111111111111' },
    { id: 't3', title: 'Shortlist 7 macro-influenceurs', description: 'Identifier profils MENA + Europe avec audience hôtellerie/luxe', assigned_to: '44444444-4444-4444-4444-444444444444', objective_id: 'obj2', priority: 'normale', deadline: '2024-06-01', status: 'a_faire', created_by: '11111111-1111-1111-1111-111111111111' },
    { id: 't4', title: 'Visites bureaux Dubai Marina', description: 'Planifier 3-4 visites bureau vitrine zone Marina / JLT', assigned_to: '11111111-1111-1111-1111-111111111111', objective_id: 'obj3', priority: 'urgente', deadline: '2024-05-10', status: 'en_retard', created_by: '11111111-1111-1111-1111-111111111111' },
    { id: 't5', title: 'Préparer pitch deck investisseurs', description: 'Deck 15 slides avec financiers, marché, roadmap', assigned_to: '11111111-1111-1111-1111-111111111111', objective_id: 'obj5', priority: 'urgente', deadline: '2024-05-25', status: 'en_cours', created_by: '11111111-1111-1111-1111-111111111111' },
    { id: 't6', title: 'Valider maquettes packaging T2', description: 'Brief graphiste sur pack sunscreen + eau solaire', assigned_to: '33333333-3333-3333-3333-333333333333', objective_id: 'obj4', priority: 'normale', deadline: '2024-07-15', status: 'a_faire', created_by: '22222222-2222-2222-2222-222222222222' },
    { id: 't7', title: 'Sourcing fournisseur plastique UV', description: 'Comparer 3 fournisseurs emballage résistant UV', assigned_to: '22222222-2222-2222-2222-222222222222', objective_id: 'obj4', priority: 'basse', deadline: '2024-08-01', status: 'a_faire', created_by: '22222222-2222-2222-2222-222222222222' },
    { id: 't8', title: 'Déposer marque EU + UAE', description: 'Mandater cabinet pour dépôt EUIPO + WIPO Emirats', assigned_to: '33333333-3333-3333-3333-333333333333', objective_id: 'obj1', priority: 'haute', deadline: '2024-06-10', status: 'a_faire', created_by: '11111111-1111-1111-1111-111111111111' }
  ],
  appointments: [
    { id: 'a1', title: 'Meeting investisseur — Famille Al-Rashid', date: '2024-05-22T14:00:00', location: 'Dubai DIFC, Gate Building', notes: 'Présenter deck + projections T1-T3. Apporter échantillons.', assigned_to: '11111111-1111-1111-1111-111111111111' },
    { id: 'a2', title: 'RDV labo Dermscan Lyon', date: '2024-05-28T10:00:00', location: 'Dermscan, Lyon', notes: 'Devis tests SPF in vivo + patch test', assigned_to: '22222222-2222-2222-2222-222222222222' },
    { id: 'a3', title: 'Visite bureau Dubai Marina', date: '2024-05-30T11:30:00', location: 'JLT Tower B, Dubai', notes: 'Visiter 3 espaces avec agent Khalid', assigned_to: '11111111-1111-1111-1111-111111111111' },
    { id: 'a4', title: 'Appel macro-influenceuse @soraya_mena', date: '2024-06-03T16:00:00', location: 'Zoom', notes: 'Premier contact, présenter le projet', assigned_to: '44444444-4444-4444-4444-444444444444' },
    { id: 'a5', title: 'Salon Beautyworld Dubai', date: '2024-06-10T09:00:00', location: 'Dubai World Trade Centre', notes: 'Analyser stands concurrents', assigned_to: '33333333-3333-3333-3333-333333333333' },
    { id: 'a6', title: 'RDV client hôtel Atlantis', date: '2024-05-25T15:00:00', location: 'Atlantis The Palm, Dubai', notes: 'Présentation offre distribution machines', assigned_to: '55555555-5555-5555-5555-555555555555' },
    { id: 'a7', title: 'Démo machine hôtel Jumeirah', date: '2024-06-05T10:00:00', location: 'Jumeirah Beach Hotel', notes: 'Démo live machine + négociation contrat pilote', assigned_to: '66666666-6666-6666-6666-666666666666' }
  ],
  contacts: [
    { id: 'c1', name: 'Khalid Al-Mansouri', company: 'Jumeirah Group', phone: '+971 50 123 4567', email: 'k.almansouri@jumeirah.com', address: 'Dubai, Jumeirah Beach Rd', temperature: 'chaud', next_followup: '2024-05-28', notes: 'Très intéressé contrat pilote 5 machines. Attendre validation DG.', assigned_to: '55555555-5555-5555-5555-555555555555', created_by: '55555555-5555-5555-5555-555555555555' },
    { id: 'c2', name: 'Sophie Marchand', company: 'Club Med Maroc', phone: '+212 661 234 567', email: 's.marchand@clubmed.com', address: 'Casablanca, Boulevard Anfa', temperature: 'tiede', next_followup: '2024-06-10', notes: 'Intéressée mais budget Q3. Relancer après Beautyworld.', assigned_to: '55555555-5555-5555-5555-555555555555', created_by: '55555555-5555-5555-5555-555555555555' },
    { id: 'c3', name: 'Rania El-Zein', company: 'W Hotels Abu Dhabi', phone: '+971 55 987 6543', email: 'r.elzein@whotels.com', address: 'Abu Dhabi, Corniche', temperature: 'froid', next_followup: '2024-07-01', notes: 'Pas de budget cette année.', assigned_to: '66666666-6666-6666-6666-666666666666', created_by: '66666666-6666-6666-6666-666666666666' },
    { id: 'c4', name: 'Ahmed Benali', company: 'Rixos Hotels', phone: '+90 532 456 7890', email: 'a.benali@rixos.com', address: 'Istanbul, Levent', temperature: 'chaud', next_followup: '2024-05-30', notes: 'Veut signer 10 machines si certification GCC avant septembre.', assigned_to: '66666666-6666-6666-6666-666666666666', created_by: '66666666-6666-6666-6666-666666666666' },
    { id: 'c5', name: 'Marie Fontaine', company: 'Barrière Deauville', phone: '+33 6 78 90 12 34', email: 'm.fontaine@barriere.com', address: 'Deauville, Normandie', temperature: 'tiede', next_followup: '2024-06-20', notes: 'Dossier transmis au siège. En attente retour comité achat.', assigned_to: '55555555-5555-5555-5555-555555555555', created_by: '55555555-5555-5555-5555-555555555555' }
  ],
  transactions: [
    { id: 'tr1', date: '2024-04-15', poste: '3.1 Loyer & charges', tranche: 'T1', categorie: 'Bureau & Overheads', fournisseur: 'Regent Business Center Dubai', description: 'Loyer bureau vitrine JLT — dépôt + 3 mois', montant_engage: 8250, montant_paye: 8250, ref_facture: 'INV-RBC-2024-001', notes: 'Bail signé 12 mois' },
    { id: 'tr2', date: '2024-04-20', poste: '3.3 Matériel & frais généraux', tranche: 'T1', categorie: 'Bureau & Overheads', fournisseur: 'Apple Store Dubai Mall', description: 'MacBook Pro M3 x2 + iPads x2', montant_engage: 5200, montant_paye: 5200, ref_facture: 'INV-APPLE-20240420', notes: null },
    { id: 'tr3', date: '2024-04-25', poste: '2.1 Juriste / Cabinet', tranche: 'T1', categorie: 'Legal & IP', fournisseur: 'Cabinet Linklaters Dubai', description: 'Honoraires structuration juridique', montant_engage: 4500, montant_paye: 0, ref_facture: 'PROFORMA-LL-001', notes: 'Paiement à 30 jours' },
    { id: 'tr4', date: '2024-05-02', poste: '1.1 Ingénieur Machines', tranche: 'T1', categorie: 'R&D', fournisseur: 'TechMed Engineering', description: 'Acompte 30% — ingénierie machines dispensatrices', montant_engage: 15000, montant_paye: 15000, ref_facture: 'INV-TM-2024-042', notes: 'Solde à livraison maquette M3' },
    { id: 'tr5', date: '2024-05-10', poste: '3.2 Assistante + Board', tranche: 'T1', categorie: 'Bureau & Overheads', fournisseur: 'Interne', description: 'Salaires équipe avril — Sane, Mathéo, Clément, Hugo', montant_engage: 18000, montant_paye: 18000, ref_facture: 'PAIE-AVRIL-2024', notes: null }
  ],
  budget_postes: [
    {poste:'1.1 Ingénieur Machines',tranche:'T1',categorie:'R&D',budget:50000},
    {poste:'1.2 Formulateur Labo',tranche:'T1',categorie:'R&D',budget:50000},
    {poste:'1.3 Tests SPF / Réglementation',tranche:'T1',categorie:'R&D',budget:80000},
    {poste:'2.1 Juriste / Cabinet',tranche:'T1',categorie:'Legal & IP',budget:17500},
    {poste:'2.2 Étiquetage EU & GCC',tranche:'T1',categorie:'Legal & IP',budget:12500},
    {poste:'2.3 Brevet + Marques + Design',tranche:'T1',categorie:'Legal & IP',budget:20000},
    {poste:'3.1 Loyer & charges',tranche:'T1',categorie:'Bureau & Overheads',budget:27500},
    {poste:'3.2 Assistante + Board',tranche:'T1',categorie:'Bureau & Overheads',budget:75000},
    {poste:'3.3 Matériel & frais généraux',tranche:'T1',categorie:'Bureau & Overheads',budget:17500},
    {poste:'4.1 Graphisme pack',tranche:'T2',categorie:'Design & Branding',budget:13500},
    {poste:'4.2 Brand book & PLV',tranche:'T2',categorie:'Design & Branding',budget:6500},
    {poste:'5.1 Machines (50 units)',tranche:'T2',categorie:'Machines & Déploiement',budget:65000},
    {poste:'5.2 Logistique & Maintenance',tranche:'T2',categorie:'Machines & Déploiement',budget:50000},
    {poste:'5.3 Stockage',tranche:'T2',categorie:'Machines & Déploiement',budget:25000},
    {poste:'6.1 Sites e-commerce',tranche:'T2',categorie:'Site & Contenus',budget:20000},
    {poste:'6.2 Shooting photo & vidéo',tranche:'T2',categorie:'Site & Contenus',budget:30000},
    {poste:'6.3 Contenus UGC / Réels',tranche:'T2',categorie:'Site & Contenus',budget:10000},
    {poste:'7.1 Buffer / Imprévus',tranche:'T2',categorie:'Trésorerie',budget:30000},
    {poste:'8.1.1 Micro-influenceurs',tranche:'T3',categorie:'Influence',budget:15000},
    {poste:'8.1.2 Macro-influenceurs',tranche:'T3',categorie:'Influence',budget:65000},
    {poste:'8.1.3 Key Opinion Leaders',tranche:'T3',categorie:'Influence',budget:20000},
    {poste:'8.2.1 Droits partenariat',tranche:'T3',categorie:'Co-branding',budget:25000},
    {poste:'8.2.2 Branding physique',tranche:'T3',categorie:'Co-branding',budget:20000},
    {poste:'8.2.3 Machines intégration',tranche:'T3',categorie:'Co-branding',budget:15000},
    {poste:'8.2.4 Événement VIP Presse',tranche:'T3',categorie:'Co-branding',budget:15000},
    {poste:'8.2.5 Production contenus',tranche:'T3',categorie:'Co-branding',budget:10000},
    {poste:'8.2.6 Activation influence',tranche:'T3',categorie:'Co-branding',budget:10000},
    {poste:'8.2.7 Gestion + Contingence',tranche:'T3',categorie:'Co-branding',budget:5000},
    {poste:'8.3.1 Location espace',tranche:'T3',categorie:'Pop-up',budget:45000},
    {poste:'8.3.2 Scénographie',tranche:'T3',categorie:'Pop-up',budget:35000},
    {poste:'8.3.3 Staff & Ambassadors',tranche:'T3',categorie:'Pop-up',budget:20000},
    {poste:'8.3.4 Événements VIP',tranche:'T3',categorie:'Pop-up',budget:20000},
    {poste:'8.3.5 Production Contenus',tranche:'T3',categorie:'Pop-up',budget:10000},
    {poste:'8.3.6 Technologie & XP',tranche:'T3',categorie:'Pop-up',budget:10000},
    {poste:'8.3.7 Logistique + Juridique',tranche:'T3',categorie:'Pop-up',budget:10000},
    {poste:'8.4.1 Inscription & Stands',tranche:'T3',categorie:'Salons',budget:32000},
    {poste:'8.4.2 Design Stand',tranche:'T3',categorie:'Salons',budget:18000},
    {poste:'8.4.3 Transport Machines',tranche:'T3',categorie:'Salons',budget:8000},
    {poste:'8.4.4 Équipe & Déplacements',tranche:'T3',categorie:'Salons',budget:12000},
    {poste:'8.4.5 Supports & Échantillons',tranche:'T3',categorie:'Salons',budget:5000},
    {poste:'8.4.6 Contenus + Gestion',tranche:'T3',categorie:'Salons',budget:5000},
    {poste:'8.5.1 Digital billboards',tranche:'T3',categorie:'Affichage',budget:40000},
    {poste:'8.5.2 Malls & zones touristiques',tranche:'T3',categorie:'Affichage',budget:20000},
    {poste:'8.6.1 Agence PR MENA',tranche:'T3',categorie:'Presse',budget:40000},
    {poste:'8.6.2 Articles sponsorisés',tranche:'T3',categorie:'Presse',budget:20000}
  ]
};

function getDemoUser() { const s = localStorage.getItem('solaire_demo_user'); return s ? JSON.parse(s) : null; }
function setDemoUser(profile) { localStorage.setItem('solaire_demo_user', JSON.stringify(profile)); }
function clearDemoUser() { localStorage.removeItem('solaire_demo_user'); }
