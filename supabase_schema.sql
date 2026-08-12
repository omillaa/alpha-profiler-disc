-- ============================================================================
-- SÓLIDES PROFILER DISC — SCHEMAS & AUTENTICAÇÃO COMPLETA SUPABASE
-- ============================================================================
-- Executar no SQL Editor do Supabase para criar tabelas, autenticação, perfis e RLS.

-- 1. EXTENSÕES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 2. TABELAS DO SISTEMA
-- ============================================================================

-- A. EMPRESAS (ORGANIZAÇÕES DE RH)
CREATE TABLE IF NOT EXISTS public.companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255),
    plan VARCHAR(50) DEFAULT 'Enterprise',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- B. PERFIS DE USUÁRIOS DO RH (VINCULADO AO SUPABASE AUTH.USERS)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(50) DEFAULT 'rh_analyst', -- rh_admin, rh_analyst, gestor
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- C. COLABORADORES / CANDIDATOS (PROFILER)
CREATE TABLE IF NOT EXISTS public.candidates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(255) DEFAULT 'Colaborador',
    company_name VARCHAR(255) DEFAULT 'Alpha Psicologia LTDA',
    avatar_url TEXT,
    profile_badge VARCHAR(10) DEFAULT 'Pendente', -- Ex: CE, EC, PA, PC, PAE, DI
    primary_key VARCHAR(5), -- D, I, S, C
    secondary_key VARCHAR(5), -- D, I, S, C
    status VARCHAR(50) DEFAULT 'Enviado', -- Enviado, Em Andamento, Concluído
    send_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    answer_date TIMESTAMP WITH TIME ZONE,
    
    -- Respostas brutas (JSONB)
    r1_responses JSONB DEFAULT '{}'::jsonb, -- Rodada 1: Autopercepção
    r2_responses JSONB DEFAULT '{}'::jsonb, -- Rodada 2: Percepção Externa
    
    -- Totais quantitativos calculados (JSONB)
    totals_r1 JSONB DEFAULT '{"D":0,"I":0,"S":0,"C":0}'::jsonb,
    totals_r2 JSONB DEFAULT '{"D":0,"I":0,"S":0,"C":0}'::jsonb,
    gap_scores JSONB DEFAULT '{"D":0,"I":0,"S":0,"C":0}'::jsonb,
    situational_scores JSONB DEFAULT '{}'::jsonb,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    CONSTRAINT uq_company_candidate_email UNIQUE (company_id, email)
);

-- D. AVALIAÇÕES DETALHADAS E LAUDOS
CREATE TABLE IF NOT EXISTS public.assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID NOT NULL REFERENCES public.candidates(id) ON DELETE CASCADE,
    assessment_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    primary_profile_name VARCHAR(100) NOT NULL,
    secondary_profile_name VARCHAR(100),
    combination_name VARCHAR(150),
    combination_keywords TEXT,
    energy_score NUMERIC(4,2) DEFAULT 0.0,
    full_report_payload JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================================
-- 3. ÍNDICES DE PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_candidates_email ON public.candidates(email);
CREATE INDEX IF NOT EXISTS idx_candidates_status ON public.candidates(status);
CREATE INDEX IF NOT EXISTS idx_candidates_primary_key ON public.candidates(primary_key);
CREATE INDEX IF NOT EXISTS idx_candidates_profile_badge ON public.candidates(profile_badge);
CREATE INDEX IF NOT EXISTS idx_candidates_company_id ON public.candidates(company_id);
CREATE INDEX IF NOT EXISTS idx_assessments_candidate_id ON public.assessments(candidate_id);

-- ============================================================================
-- 4. TRIGGERS E FUNÇÃO DE CADASTRO AUTOMÁTICO DE USUÁRIO AUTH
-- ============================================================================

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER trg_candidates_updated_at BEFORE UPDATE ON public.candidates FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- FUNÇÃO TRIGGER QUE CRIA O PERFIL EM PUBLIC.PROFILES QUANDO O USUÁRIO FAZ LOGIN/CADASTRO NO SUPABASE AUTH
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    default_company_id UUID;
BEGIN
    SELECT id INTO default_company_id FROM public.companies LIMIT 1;

    INSERT INTO public.profiles (id, full_name, email, role, company_id)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1)),
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'role', 'rh_analyst'),
        default_company_id
    )
    ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger conectado à tabela nativa de autenticação do Supabase (auth.users)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- 5. VISÃO DE ANALYTICS DO RH
-- ============================================================================

CREATE OR REPLACE VIEW public.vw_hr_analytics AS
SELECT
    c.company_id,
    COUNT(c.id) AS total_candidates,
    COUNT(CASE WHEN c.status = 'Concluído' THEN 1 END) AS total_completed,
    COUNT(CASE WHEN c.status = 'Enviado' THEN 1 END) AS total_pending,
    MODE() WITHIN GROUP (ORDER BY c.primary_key) AS predominant_profile_key,
    ROUND(AVG(COALESCE((c.situational_scores->'energia'->>'score')::numeric, 0)), 1) AS avg_situational_energy
FROM public.candidates c
GROUP BY c.company_id;

-- ============================================================================
-- 6. POLÍTICAS DE SEGURANÇA (ROW LEVEL SECURITY - RLS)
-- ============================================================================

ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;

-- Permissões para COMPANIES
CREATE POLICY "Permitir leitura de empresas" ON public.companies FOR SELECT USING (true);
CREATE POLICY "Permitir inserção de empresas" ON public.companies FOR INSERT WITH CHECK (true);

-- Permissões para PROFILES (Usuários Autenticados)
CREATE POLICY "Permitir leitura de perfis" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Permitir alteracao de perfil próprio" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Permissões para CANDIDATES
CREATE POLICY "Permitir leitura de candidatos" ON public.candidates FOR SELECT USING (true);
CREATE POLICY "Permitir inserção de candidatos" ON public.candidates FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir atualização de candidatos" ON public.candidates FOR UPDATE USING (true);
CREATE POLICY "Permitir exclusão de candidatos" ON public.candidates FOR DELETE USING (true);

-- Permissões para ASSESSMENTS
CREATE POLICY "Permitir leitura de laudos" ON public.assessments FOR SELECT USING (true);
CREATE POLICY "Permitir inserção de laudos" ON public.assessments FOR INSERT WITH CHECK (true);

-- ============================================================================
-- 7. SEED DATA INICIAL DE TESTE
-- ============================================================================

DO $$
DECLARE
    v_company_id UUID;
BEGIN
    INSERT INTO public.companies (name, domain)
    VALUES ('Alpha Psicologia LTDA', 'alphapsicologia.com.br')
    ON CONFLICT DO NOTHING;

    SELECT id INTO v_company_id FROM public.companies WHERE name = 'Alpha Psicologia LTDA' LIMIT 1;

    INSERT INTO public.candidates (
        company_id, name, email, role, company_name, avatar_url, profile_badge, primary_key, secondary_key, status, send_date, answer_date, totals_r1, totals_r2
    ) VALUES
    (v_company_id, 'Aline Cristina da Silva', 'alinecristina38345@gmail.com', 'Analista de RH', 'Alpha Psicologia LTDA', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', 'CE', 'C', 'E', 'Concluído', '2025-12-11 10:00:00+00', '2025-12-11 11:30:00+00', '{"D": 12, "I": 18, "S": 22, "C": 38}'::jsonb, '{"D": 10, "I": 16, "S": 20, "C": 34}'::jsonb),
    (v_company_id, 'Vanilza Felipe de Paula', 'vanilzapaula225@gmail.com', 'Coordenadora Operacional', 'Alpha Psicologia LTDA', NULL, 'EC', 'E', 'C', 'Concluído', '2026-01-12 09:00:00+00', '2026-01-12 10:15:00+00', '{"D": 14, "I": 16, "S": 36, "C": 28}'::jsonb, '{"D": 12, "I": 14, "S": 32, "C": 26}'::jsonb),
    (v_company_id, 'Abdias Anderson de Oliveira', 'abdiascontabeis@hotmail.com', 'Contador Sênior', 'Alpha Psicologia LTDA', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 'PA', 'P', 'A', 'Concluído', '2025-10-15 14:00:00+00', '2025-10-15 15:45:00+00', '{"D": 34, "I": 28, "S": 16, "C": 12}'::jsonb, '{"D": 30, "I": 26, "S": 14, "C": 10}'::jsonb),
    (v_company_id, 'Abraão Vitório da Silva', 'abraaovitorio04@gmail.com', 'Desenvolvedor Full Stack', 'Alpha Psicologia LTDA', NULL, 'PC', 'P', 'C', 'Concluído', '2026-04-18 08:30:00+00', '2026-04-18 09:50:00+00', '{"D": 26, "I": 14, "S": 18, "C": 32}'::jsonb, '{"D": 24, "I": 12, "S": 16, "C": 30}'::jsonb),
    (v_company_id, 'Adalberto Alves da Costa', 'secretario.semec@ribeiroodasneves.mg.gov.br', 'Secretário Executivo', 'Prefeitura Municipal', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', 'EC', 'E', 'C', 'Concluído', '2025-08-21 11:00:00+00', '2025-08-21 12:20:00+00', '{"D": 10, "I": 22, "S": 34, "C": 26}'::jsonb, '{"D": 10, "I": 20, "S": 30, "C": 24}'::jsonb),
    (v_company_id, 'Ademir Roberto Neto', 'ademiroberto@hotmail.com', 'Gerente Comercial', 'Alpha Psicologia LTDA', NULL, 'CE', 'C', 'E', 'Concluído', '2025-10-30 13:00:00+00', '2025-10-30 14:10:00+00', '{"D": 20, "I": 18, "S": 24, "C": 32}'::jsonb, '{"D": 18, "I": 16, "S": 22, "C": 30}'::jsonb),
    (v_company_id, 'Adileia Pereira de Souza Miranda', 'adileiapereira62@gmail.com', 'Consultora Organizacional', 'Alpha Psicologia LTDA', NULL, 'PAE', 'P', 'A', 'Concluído', '2025-12-11 16:00:00+00', '2025-12-11 17:00:00+00', '{"D": 32, "I": 30, "S": 22, "C": 10}'::jsonb, '{"D": 30, "I": 28, "S": 20, "C": 10}'::jsonb)
    ON CONFLICT (company_id, email) DO NOTHING;
END $$;
