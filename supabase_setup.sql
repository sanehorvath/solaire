-- ============================================================
-- SOLAIRE DASHBOARD — SUPABASE SETUP COMPLET
-- ============================================================

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('founder', 'commercial')),
  avatar_color TEXT DEFAULT '#F59E0B',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS objectives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL, description TEXT, deadline DATE,
  progress INT DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  status TEXT DEFAULT 'en_cours' CHECK (status IN ('en_cours', 'termine', 'bloque')),
  created_by UUID REFERENCES profiles(id), created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL, description TEXT,
  assigned_to UUID REFERENCES profiles(id), objective_id UUID REFERENCES objectives(id),
  priority TEXT DEFAULT 'normale' CHECK (priority IN ('basse', 'normale', 'haute', 'urgente')),
  deadline DATE,
  status TEXT DEFAULT 'a_faire' CHECK (status IN ('a_faire', 'en_cours', 'termine', 'en_retard')),
  created_by UUID REFERENCES profiles(id), created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL, date TIMESTAMPTZ NOT NULL, location TEXT, notes TEXT,
  assigned_to UUID REFERENCES profiles(id), created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL, company TEXT, phone TEXT, email TEXT, address TEXT,
  temperature TEXT DEFAULT 'froid' CHECK (temperature IN ('froid', 'tiede', 'chaud')),
  next_followup DATE, notes TEXT, documents JSONB DEFAULT '[]',
  assigned_to UUID REFERENCES profiles(id), created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL, poste TEXT NOT NULL, tranche TEXT NOT NULL CHECK (tranche IN ('T1', 'T2', 'T3')),
  categorie TEXT NOT NULL, fournisseur TEXT, description TEXT,
  montant_engage NUMERIC(12,2) DEFAULT 0, montant_paye NUMERIC(12,2) DEFAULT 0,
  ref_facture TEXT, notes TEXT,
  created_by UUID REFERENCES profiles(id), created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS budget_postes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poste TEXT NOT NULL, tranche TEXT NOT NULL, categorie TEXT NOT NULL,
  budget NUMERIC(12,2) NOT NULL, detail TEXT
);

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE objectives ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_postes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_read_all" ON profiles FOR SELECT USING (true);
CREATE POLICY "objectives_founders" ON objectives FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'founder'));
CREATE POLICY "tasks_founders" ON tasks FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'founder'));
CREATE POLICY "tasks_commercial_select" ON tasks FOR SELECT USING (assigned_to = auth.uid() OR created_by = auth.uid());
CREATE POLICY "tasks_commercial_insert" ON tasks FOR INSERT WITH CHECK (created_by = auth.uid());
CREATE POLICY "tasks_commercial_update" ON tasks FOR UPDATE USING (assigned_to = auth.uid() OR created_by = auth.uid());
CREATE POLICY "appointments_founders" ON appointments FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'founder'));
CREATE POLICY "appointments_commercial_select" ON appointments FOR SELECT USING (assigned_to = auth.uid() OR created_by = auth.uid());
CREATE POLICY "appointments_commercial_insert" ON appointments FOR INSERT WITH CHECK (created_by = auth.uid());
CREATE POLICY "appointments_commercial_update" ON appointments FOR UPDATE USING (assigned_to = auth.uid() OR created_by = auth.uid());
CREATE POLICY "contacts_founders" ON contacts FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'founder'));
CREATE POLICY "contacts_commercial_select" ON contacts FOR SELECT USING (created_by = auth.uid());
CREATE POLICY "contacts_commercial_insert" ON contacts FOR INSERT WITH CHECK (created_by = auth.uid());
CREATE POLICY "contacts_commercial_update" ON contacts FOR UPDATE USING (created_by = auth.uid());
CREATE POLICY "transactions_founders" ON transactions FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'founder'));
CREATE POLICY "transactions_commercial_read" ON transactions FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "budget_postes_read" ON budget_postes FOR SELECT USING (auth.uid() IS NOT NULL);

-- DEMO PROFILES
INSERT INTO profiles (id, email, name, role, avatar_color) VALUES
  ('11111111-1111-1111-1111-111111111111','sane@solaire.com','Sane','founder','#F59E0B'),
  ('22222222-2222-2222-2222-222222222222','matheo@solaire.com','Mathéo','founder','#3B82F6'),
  ('33333333-3333-3333-3333-333333333333','clement@solaire.com','Clément','founder','#8B5CF6'),
  ('44444444-4444-4444-4444-444444444444','hugo@solaire.com','Hugo','founder','#10B981'),
  ('55555555-5555-5555-5555-555555555555','lucas@solaire.com','Lucas','commercial','#EF4444'),
  ('66666666-6666-6666-6666-666666666666','sarah@solaire.com','Sarah','commercial','#EC4899')
ON CONFLICT (id) DO NOTHING;
