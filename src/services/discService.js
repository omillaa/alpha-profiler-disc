import { supabase, isSupabaseConfigured } from "../lib/supabaseClient.js";
import { MOCK_HR_CANDIDATES } from "../data/discData.js";
import { calculateAssessmentResults } from "../utils/scoringEngine.js";

const LOCAL_STORAGE_KEY = "disc_app_candidates_db";

/**
 * Normaliza os dados vindos do Supabase (snake_case) para a aplicação (camelCase)
 */
function normalizeCandidateFromDB(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role || "Colaborador",
    company: row.company_name || "Alpha Psicologia LTDA",
    avatar: row.avatar_url || "",
    profileBadge: row.profile_badge || "Pendente",
    primaryKey: row.primary_key || "D",
    secondaryKey: row.secondary_key || "I",
    status: row.status || "Enviado",
    sendDate: row.send_date ? new Date(row.send_date).toLocaleDateString("pt-BR") : "Pendente",
    answerDate: row.answer_date ? new Date(row.answer_date).toLocaleDateString("pt-BR") : "Pendente",
    totals1: row.totals_r1 || { D: 0, I: 0, S: 0, C: 0 },
    totals2: row.totals_r2 || { D: 0, I: 0, S: 0, C: 0 },
    r1: row.r1_responses || {},
    r2: row.r2_responses || {}
  };
}

/* ============================================================
   AUTENTICAÇÃO DO SUPABASE (Sessão do RH)
   ============================================================ */

export async function signInWithEmail(email, password) {
  if (!isSupabaseConfigured) {
    const mockUser = { id: "user_rh_demo", email, name: email.split("@")[0], role: "rh_admin" };
    localStorage.setItem("disc_auth_user", JSON.stringify(mockUser));
    return { user: mockUser, error: null };
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { user: data?.user || null, error: error ? error.message : null };
}

export async function signUpWithEmail(email, password, fullName) {
  if (!isSupabaseConfigured) {
    const mockUser = { id: `user_${Date.now()}`, email, name: fullName, role: "rh_admin" };
    localStorage.setItem("disc_auth_user", JSON.stringify(mockUser));
    return { user: mockUser, error: null };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, role: "rh_admin" }
    }
  });

  return { user: data?.user || null, error: error ? error.message : null };
}

export async function signOutUser() {
  if (isSupabaseConfigured) {
    await supabase.auth.signOut();
  }
  localStorage.removeItem("disc_auth_user");
}

export async function getAuthUser() {
  if (isSupabaseConfigured) {
    const { data } = await supabase.auth.getUser();
    if (data?.user) return data.user;
  }
  const stored = localStorage.getItem("disc_auth_user");
  return stored ? JSON.parse(stored) : null;
}

/* ============================================================
   OPERACIONAL CRUD DE CANDIDATOS E PROFILER
   ============================================================ */

/**
 * 1. CONSULTAR CANDIDATOS (Com busca e filtro por perfil)
 */
export async function fetchCandidates(searchTerm = "", profileFilter = "TODOS") {
  if (isSupabaseConfigured) {
    try {
      let query = supabase.from("candidates").select("*").order("created_at", { ascending: false });

      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
      }

      if (profileFilter !== "TODOS") {
        query = query.or(`primary_key.eq.${profileFilter},profile_badge.ilike.%${profileFilter}%`);
      }

      const { data, error } = await query;
      if (error) throw error;

      return (data || []).map(normalizeCandidateFromDB);
    } catch (err) {
      console.warn("Erro ao consultar no Supabase. Usando armazenamento local fallback:", err.message);
    }
  }

  // Fallback Local Storage / Mock Data
  let localData = [];
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    localData = stored ? JSON.parse(stored) : MOCK_HR_CANDIDATES;
  } catch {
    localData = MOCK_HR_CANDIDATES;
  }

  return localData.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProfile =
      profileFilter === "TODOS" ||
      c.primaryKey === profileFilter ||
      c.profileBadge.includes(profileFilter);
    return matchesSearch && matchesProfile;
  });
}

/**
 * 2. CADASTRAR NOVO CANDIDATO / CONVITE
 */
export async function createCandidateInvite(inviteData) {
  const newCandidate = {
    name: inviteData.name,
    email: inviteData.email,
    role: inviteData.role || "Colaborador",
    company_name: inviteData.company || "Alpha Psicologia LTDA",
    status: "Enviado",
    profile_badge: "Pendente",
    primary_key: "D",
    secondary_key: "I",
    send_date: new Date().toISOString()
  };

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.from("candidates").insert([newCandidate]).select().single();
      if (error) throw error;
      return normalizeCandidateFromDB(data);
    } catch (err) {
      console.warn("Erro ao salvar convite no Supabase:", err.message);
    }
  }

  // Fallback Local Storage
  const fallbackItem = {
    id: `cand_${Date.now()}`,
    name: inviteData.name,
    email: inviteData.email,
    role: inviteData.role || "Colaborador",
    company: inviteData.company || "Alpha Psicologia LTDA",
    avatar: "",
    profileBadge: "Pendente",
    primaryKey: "D",
    secondaryKey: "I",
    status: "Enviado",
    sendDate: new Date().toLocaleDateString("pt-BR"),
    answerDate: "Pendente",
    totals1: { D: 20, I: 20, S: 20, C: 20 },
    totals2: { D: 20, I: 20, S: 20, C: 20 }
  };

  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  const currentList = stored ? JSON.parse(stored) : MOCK_HR_CANDIDATES;
  const updatedList = [fallbackItem, ...currentList];
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedList));

  return fallbackItem;
}

/**
 * 3. EXCLUIR CANDIDATO
 */
export async function deleteCandidate(candidateId) {
  if (isSupabaseConfigured) {
    try {
      const { error } = await supabase.from("candidates").delete().eq("id", candidateId);
      if (error) throw error;
      return true;
    } catch (err) {
      console.warn("Erro ao excluir candidato no Supabase:", err.message);
    }
  }

  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  const currentList = stored ? JSON.parse(stored) : MOCK_HR_CANDIDATES;
  const updatedList = currentList.filter((c) => c.id !== candidateId);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedList));
  return true;
}

/**
 * 4. SALVAR RESULTADO DE TESTE RESPOSTO E ATUALIZAR STATUS NO BANCO
 */
export async function saveAssessmentResult(r1Responses, r2Responses, userInfo) {
  const results = calculateAssessmentResults(r1Responses, r2Responses, userInfo);
  const badge = `${results.primaryKey}${results.secondaryKey}`;
  const nowIso = new Date().toISOString();

  if (isSupabaseConfigured) {
    try {
      const payload = {
        name: userInfo.name,
        email: userInfo.email,
        company_name: userInfo.company,
        role: userInfo.role,
        status: "Concluído",
        profile_badge: badge,
        primary_key: results.primaryKey,
        secondary_key: results.secondaryKey,
        answer_date: nowIso,
        r1_responses: r1Responses,
        r2_responses: r2Responses,
        totals_r1: results.totals1,
        totals_r2: results.totals2,
        gap_scores: results.gap,
        situational_scores: results.situational
      };

      // Busca primeiro se o candidato com este email já existe no Supabase
      const { data: existing } = await supabase
        .from("candidates")
        .select("id")
        .eq("email", userInfo.email)
        .maybeSingle();

      let candData = null;

      if (existing && existing.id) {
        // UPDATE se já existir
        const { data, error } = await supabase
          .from("candidates")
          .update(payload)
          .eq("id", existing.id)
          .select()
          .single();
        if (error) throw error;
        candData = data;
      } else {
        // INSERT se for um novo candidato
        const { data, error } = await supabase
          .from("candidates")
          .insert([payload])
          .select()
          .single();
        if (error) throw error;
        candData = data;
      }

      // Salva o laudo completo na tabela de laudos (assessments)
      if (candData && candData.id) {
        await supabase.from("assessments").insert([
          {
            candidate_id: candData.id,
            primary_profile_name: results.primaryProfile.name,
            secondary_profile_name: results.secondaryProfile ? results.secondaryProfile.name : null,
            combination_name: results.combination ? results.combination.name : null,
            combination_keywords: results.combination ? results.combination.keywords : null,
            energy_score: results.situational.energia?.score || 0,
            full_report_payload: results
          }
        ]);
      }

      return normalizeCandidateFromDB(candData);
    } catch (err) {
      console.warn("Erro ao salvar avaliação no Supabase:", err.message);
    }
  }

  // Fallback Local Storage
  const newCand = {
    id: `cand_${Date.now()}`,
    name: userInfo.name,
    email: userInfo.email,
    company: userInfo.company,
    role: userInfo.role,
    avatar: "",
    profileBadge: badge,
    primaryKey: results.primaryKey,
    secondaryKey: results.secondaryKey,
    sendDate: userInfo.date || new Date().toLocaleDateString("pt-BR"),
    answerDate: userInfo.date || new Date().toLocaleDateString("pt-BR"),
    status: "Concluído",
    totals1: results.totals1,
    totals2: results.totals2,
    r1: r1Responses,
    r2: r2Responses
  };

  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  const currentList = stored ? JSON.parse(stored) : MOCK_HR_CANDIDATES;
  const updatedList = [newCand, ...currentList];
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedList));

  return newCand;
}
