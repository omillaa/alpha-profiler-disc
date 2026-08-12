import React, { useState, useEffect, useMemo } from "react";
import {
  Info,
  ArrowRight,
  ArrowLeft,
  Compass,
  Plus,
  Minus,
  Sparkles,
  Download,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  User,
  Building,
  Briefcase,
  Calendar,
  Layers,
  BarChart3,
  FileText,
  Target,
  Activity,
  Zap,
  Check,
  Search,
  Mail,
  Send,
  Trash2,
  Eye,
  Filter,
  Users,
  PieChart,
  ShieldCheck,
  ChevronRight,
  PlusCircle,
  X,
  Menu,
  Database,
  Lock,
  LogOut,
  LogIn,
  ShieldAlert
} from "lucide-react";

import {
  DISC_BLOCKS,
  SITUATIONAL,
  ROUND1_ORDER,
  ROUND2_ORDER,
  PROFILE_KEYS,
  PROFILE_NAMES,
  PROFILE_COLORS,
  PROFILE_GRADIENTS,
  MOCK_HR_CANDIDATES
} from "./data/discData.js";

import { calculateAssessmentResults } from "./utils/scoringEngine.js";
import { downloadExecutivePDF } from "./utils/pdfGenerator.js";
import {
  fetchCandidates,
  createCandidateInvite,
  deleteCandidate,
  saveAssessmentResult,
  signInWithEmail,
  signUpWithEmail,
  signOutUser,
  getAuthUser
} from "./services/discService.js";
import { isSupabaseConfigured } from "./lib/supabaseClient.js";

/* ============================================================
   DESIGN SYSTEM TOKENS & FLUID RESPONSIVE STYLES
   ============================================================ */
const FONT_IMPORT =
  "@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Outfit:wght@500;600;700;800&family=JetBrains+Mono:wght@500;600;700&display=swap');";

const BRAND_DARK = "#0F172A";       // Slate 900
const BRAND_PURPLE = "#5B79DD";     // Alpha Indigo Blue
const BRAND_PRIMARY = "#4F46E5";    // Indigo 600
const BRAND_SURFACE = "#F8FAFC";    // Slate 50
const CARD_BG = "#FFFFFF";          // Pure White
const BORDER_COLOR = "#E2E8F0";     // Slate 200
const TEXT_MUTED = "#64748B";       // Slate 500

const COLOR_MAIS = "#10B981";       // Vibrant Emerald
const BG_MAIS = "#ECFDF5";
const BORDER_MAIS = "#A7F3D0";

const COLOR_MENOS = "#EF4444";      // Vibrant Red
const BG_MENOS = "#FEF2F2";
const BORDER_MENOS = "#FECDD3";

/* CSS RULES FOR FLUID FULL-WIDTH RESPONSIVENESS */
const RESPONSIVE_CSS = `
  ${FONT_IMPORT}

  html, body, #root {
    margin: 0;
    padding: 0;
    width: 100%;
    min-height: 100vh;
    background: ${BRAND_SURFACE};
  }

  * {
    box-sizing: border-box;
  }

  .grid-4-col {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }
  @media (max-width: 1100px) {
    .grid-4-col {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  @media (max-width: 600px) {
    .grid-4-col {
      grid-template-columns: 1fr;
    }
  }

  .grid-2-col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 18px;
  }
  @media (max-width: 768px) {
    .grid-2-col {
      grid-template-columns: 1fr;
    }
  }

  .grid-2-1-col {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 18px;
  }
  @media (max-width: 768px) {
    .grid-2-1-col {
      grid-template-columns: 1fr;
    }
  }

  .flex-responsive-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  @media (max-width: 768px) {
    .flex-responsive-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 14px;
    }
  }

  .table-responsive-container {
    width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .adjective-row-responsive {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 22px;
    border-radius: 16px;
    margin-bottom: 12px;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }
  @media (max-width: 600px) {
    .adjective-row-responsive {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
    }
    .adjective-row-actions {
      width: 100%;
      justify-content: flex-end;
    }
  }

  .header-responsive-nav {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  @media (max-width: 768px) {
    .header-responsive-nav {
      flex-wrap: wrap;
    }
  }
`;

/* ============================================================
   TOOLTIP COMPONENT
   ============================================================ */
function Tooltip({ text }) {
  const [open, setOpen] = useState(false);
  if (!text) return null;

  return (
    <span style={{ position: "relative", display: "inline-flex", marginLeft: 6 }}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        style={{
          color: "#94A3B8",
          display: "inline-flex",
          alignItems: "center",
          justify: "center",
          background: "#F1F5F9",
          border: "none",
          cursor: "pointer",
          width: 20,
          height: 20,
          borderRadius: 999,
          transition: "all 0.15s"
        }}
        aria-label="Ver definição"
      >
        <Info size={13} />
      </button>
      {open && (
        <span
          style={{
            position: "absolute",
            bottom: "140%",
            left: "50%",
            transform: "translateX(-50%)",
            background: BRAND_DARK,
            color: "#FFFFFF",
            fontSize: 12,
            lineHeight: 1.5,
            padding: "10px 14px",
            borderRadius: 10,
            width: 240,
            zIndex: 100,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            boxShadow: "0 10px 25px -5px rgba(15, 23, 42, 0.25)",
            pointerEvents: "none",
            fontWeight: 500
          }}
        >
          {text}
        </span>
      )}
    </span>
  );
}

/* ============================================================
   RESPONSIVE ADJECTIVE CHOICE ROW
   ============================================================ */
function AdjectiveChoiceRow({ text, tooltip, isMais, isMenos, onSelectMais, onSelectMenos }) {
  const isSelected = isMais || isMenos;
  const rowBg = isMais ? BG_MAIS : isMenos ? BG_MENOS : CARD_BG;
  const rowBorder = isMais ? BORDER_MAIS : isMenos ? BORDER_MENOS : BORDER_COLOR;

  return (
    <div
      className="adjective-row-responsive"
      style={{
        border: `1.5px solid ${rowBorder}`,
        background: rowBg,
        boxShadow: isSelected ? "0 4px 12px rgba(0,0,0,0.03)" : "none"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, flexWrap: "wrap" }}>
        <span
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 16,
            fontWeight: isSelected ? 700 : 500,
            color: isMais ? COLOR_MAIS : isMenos ? COLOR_MENOS : BRAND_DARK,
            letterSpacing: "-0.01em"
          }}
        >
          {text}
        </span>
        <Tooltip text={tooltip} />

        {isMais && (
          <span
            style={{
              background: COLOR_MAIS,
              color: "#FFFFFF",
              fontSize: 11,
              fontWeight: 700,
              padding: "2px 8px",
              borderRadius: 999,
              fontFamily: "'Plus Jakarta Sans', sans-serif"
            }}
          >
            + MAIS TE DEFINE
          </span>
        )}

        {isMenos && (
          <span
            style={{
              background: COLOR_MENOS,
              color: "#FFFFFF",
              fontSize: 11,
              fontWeight: 700,
              padding: "2px 8px",
              borderRadius: 999,
              fontFamily: "'Plus Jakarta Sans', sans-serif"
            }}
          >
            - MENOS TE DEFINE
          </span>
        )}
      </div>

      <div className="adjective-row-actions" style={{ display: "flex", gap: 10 }}>
        <button
          type="button"
          onClick={onSelectMais}
          aria-pressed={isMais}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "9px 16px",
            borderRadius: 12,
            border: `1.5px solid ${isMais ? COLOR_MAIS : BORDER_COLOR}`,
            background: isMais ? COLOR_MAIS : CARD_BG,
            color: isMais ? "#FFFFFF" : TEXT_MUTED,
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 700,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            transition: "all 0.15s ease"
          }}
        >
          <Plus size={15} /> {isMais ? "MAIS" : "MAIS"}
        </button>

        <button
          type="button"
          onClick={onSelectMenos}
          aria-pressed={isMenos}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "9px 16px",
            borderRadius: 12,
            border: `1.5px solid ${isMenos ? COLOR_MENOS : BORDER_COLOR}`,
            background: isMenos ? COLOR_MENOS : CARD_BG,
            color: isMenos ? "#FFFFFF" : TEXT_MUTED,
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 700,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            transition: "all 0.15s ease"
          }}
        >
          <Minus size={15} /> {isMenos ? "MENOS" : "MENOS"}
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   HR AUTHENTICATION GATEKEEPER (TELA DE LOGIN DO SISTEMA)
   ============================================================ */
function HRAuthGatekeeperScreen({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    if (!email || !password) {
      setErrorMsg("Por favor, informe seu e-mail corporativo e sua senha.");
      return;
    }

    setSubmitting(true);
    if (isSignup) {
      const { user, error } = await signUpWithEmail(email, password, name || "Gestor RH");
      setSubmitting(false);
      if (error) setErrorMsg(error);
      else onLoginSuccess(user);
    } else {
      const { user, error } = await signInWithEmail(email, password);
      setSubmitting(false);
      if (error) setErrorMsg(error);
      else onLoginSuccess(user);
    }
  };

  return (
    <div style={{ width: "100%", maxWidth: 440, margin: "60px auto", padding: "0 20px" }}>
      <div style={{ background: CARD_BG, borderRadius: 24, border: `1px solid ${BORDER_COLOR}`, padding: "40px 32px", boxShadow: "0 20px 40px -10px rgba(0,0,0,0.06)", textAlign: "center" }}>
        <div style={{ width: 60, height: 60, borderRadius: 20, background: `${BRAND_PURPLE}15`, color: BRAND_PURPLE, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
          <Lock size={28} />
        </div>

        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 26, fontWeight: 800, color: BRAND_DARK, margin: "0 0 8px" }}>
          {isSignup ? "Criar Conta de Gestão RH" : "Autenticação de Acesso RH"}
        </h2>
        <p style={{ fontSize: 14, color: TEXT_MUTED, lineHeight: 1.55, margin: "0 0 24px" }}>
          Acesse a plataforma corporativa para gerenciar mapeamentos comportamentais, aplicar testes e baixar laudos.
        </p>

        {errorMsg && (
          <div style={{ background: BG_MENOS, border: `1px solid ${BORDER_MENOS}`, color: COLOR_MENOS, padding: "12px 14px", borderRadius: 12, fontSize: 13, fontWeight: 600, marginBottom: 18, textAlign: "left" }}>
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ textAlign: "left" }}>
          {isSignup && (
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: BRAND_DARK, marginBottom: 6 }}>Nome Completo do Gestor</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Dra. Mariana Costa"
                style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: `1.5px solid ${BORDER_COLOR}`, fontSize: 14, outline: "none" }}
              />
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: BRAND_DARK, marginBottom: 6 }}>E-mail Corporativo</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu.email@empresa.com.br"
              style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: `1.5px solid ${BORDER_COLOR}`, fontSize: 14, outline: "none" }}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: BRAND_DARK, marginBottom: 6 }}>Senha de Acesso</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: `1.5px solid ${BORDER_COLOR}`, fontSize: 14, outline: "none" }}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: 12,
              border: "none",
              background: BRAND_PURPLE,
              color: "#FFFFFF",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 15,
              fontWeight: 800,
              cursor: submitting ? "default" : "pointer",
              boxShadow: "0 10px 20px -5px rgba(91, 121, 221, 0.35)",
              marginBottom: 16
            }}
          >
            {submitting ? "Autenticando..." : isSignup ? "Cadastrar Gestor RH" : "Entrar no Sistema"}
          </button>
        </form>

        <div style={{ borderTop: `1px solid ${BORDER_COLOR}`, paddingTop: 18, marginTop: 8 }}>
          <button
            onClick={() => { setIsSignup(!isSignup); setErrorMsg(""); }}
            style={{ background: "none", border: "none", color: BRAND_PRIMARY, fontSize: 13, fontWeight: 700, cursor: "pointer" }}
          >
            {isSignup ? "Já possui conta? Fazer Login" : "Criar Nova Conta de RH no Supabase"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   MAIN SYSTEM CONTROLLER & NAVIGATION
   ============================================================ */
export default function DiscPrototype() {
  const [appMode, setAppMode] = useState("hr_dashboard");
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [profileFilter, setProfileFilter] = useState("TODOS");

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [authUser, setAuthUser] = useState(null);
  const [inviteForm, setInviteForm] = useState({ name: "", email: "", company: "Alpha Psicologia LTDA", role: "Colaborador" });

  const [idx1, setIdx1] = useState(0);
  const [idx2, setIdx2] = useState(0);
  const [r1, setR1] = useState({});
  const [r2, setR2] = useState({});
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [activeTab, setActiveTab] = useState(1);

  const [userInfo, setUserInfo] = useState({
    name: "Ana Silva",
    email: "ana.silva@empresa.com.br",
    company: "Alpha Psicologia LTDA",
    role: "Gerente de Produtos",
    date: new Date().toLocaleDateString("pt-BR")
  });

  // Checar usuário autenticado ao iniciar
  useEffect(() => {
    getAuthUser().then((user) => setAuthUser(user));
  }, []);

  // Carregar dados de candidatos (do Supabase ou Local Fallback) somente quando autenticado
  const loadCandidates = async () => {
    if (!authUser && isSupabaseConfigured) return;
    setLoading(true);
    const data = await fetchCandidates(searchTerm, profileFilter);
    setCandidates(data);
    setLoading(false);
  };

  useEffect(() => {
    if (authUser || !isSupabaseConfigured) {
      loadCandidates();
    }
  }, [searchTerm, profileFilter, authUser]);

  async function handleLogout() {
    await signOutUser();
    setAuthUser(null);
    setSelectedCandidate(null);
    setCandidates([]);
  }

  const keyForR1 = (item) => (item.type === "disc" ? `d${item.i}` : `s_${item.key}`);
  const keyForR2 = (item) => `d${item.i}`;

  const currentItem1 = ROUND1_ORDER[idx1];
  const currentItem2 = ROUND2_ORDER[idx2];

  const currentAdjectives = (round, item) => {
    if (item.type === "sit") return SITUATIONAL[item.key].adjectives;
    return DISC_BLOCKS[item.i].adjectives;
  };

  function selectAnswer(round, key, field, value) {
    const setter = round === 1 ? setR1 : setR2;
    setter((prev) => {
      const existing = prev[key] || {};
      const next = { ...existing, [field]: existing[field] === value ? undefined : value };
      if (field === "mais" && next.menos === value) next.menos = undefined;
      if (field === "menos" && next.mais === value) next.mais = undefined;
      return { ...prev, [key]: next };
    });
  }

  const currentResults = useMemo(() => {
    if (selectedCandidate) {
      return calculateAssessmentResults(selectedCandidate.r1 || {}, selectedCandidate.r2 || {}, {
        name: selectedCandidate.name,
        company: selectedCandidate.company,
        role: selectedCandidate.role,
        date: selectedCandidate.answerDate
      });
    }
    if (appMode === "test_results") {
      return calculateAssessmentResults(r1, r2, userInfo);
    }
    return null;
  }, [appMode, selectedCandidate, r1, r2, userInfo]);

  async function handleSendInvite(e) {
    e.preventDefault();
    if (!inviteForm.name || !inviteForm.email) return;

    const created = await createCandidateInvite(inviteForm);
    setShowInviteModal(false);
    setInviteForm({ name: "", email: "", company: "Alpha Psicologia LTDA", role: "Colaborador" });
    alert(`Convite do Profiler cadastrado para ${created.email}!`);
    loadCandidates();
  }

  async function handleDeleteCandidate(candidateId, candidateName) {
    if (window.confirm(`Deseja realmente remover a avaliação de ${candidateName}?`)) {
      await deleteCandidate(candidateId);
      loadCandidates();
    }
  }

  async function handleFinishAssessment() {
    await saveAssessmentResult(r1, r2, userInfo);
    await loadCandidates();
    setAppMode("test_results");
  }

  async function handleDownloadPDF() {
    setIsGeneratingPDF(true);
    const targetName = selectedCandidate ? selectedCandidate.name : userInfo.name;
    await downloadExecutivePDF(targetName);
    setIsGeneratingPDF(false);
  }

  return (
    <Shell>
      {/* 100% EDGE-TO-EDGE FLUID TOP HEADER */}
      <header
        style={{
          width: "100%",
          background: BRAND_PURPLE,
          color: "#FFFFFF",
          padding: "16px 32px",
          display: "flex",
          alignItems: "center",
          justify: "space-between",
          gap: 24,
          boxSizing: "border-box",
          boxShadow: "0 4px 14px rgba(91, 121, 221, 0.25)"
        }}
      >
        {/* LOGO */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              cursor: "pointer"
            }}
            onClick={() => {
              if (authUser) {
                setSelectedCandidate(null);
                setAppMode("hr_dashboard");
              }
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "#FFFFFF",
                color: BRAND_PURPLE,
                display: "flex",
                alignItems: "center",
                justify: "center",
                fontWeight: 800,
                fontSize: 18
              }}
            >
              A
            </div>

            <span
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 22,
                fontWeight: 800,
                letterSpacing: "-0.02em",
                whiteSpace: "nowrap"
              }}
            >
              Alpha{" "}
              <span style={{ opacity: 0.85, fontWeight: 500 }}>
                Profiler DISC
              </span>
            </span>
          </div>

          {/* MENU EXCLUSIVO PARA USUÁRIOS AUTENTICADOS */}
          {authUser && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button
                onClick={() => {
                  setSelectedCandidate(null);
                  setAppMode("hr_dashboard");
                }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 16px",
                  borderRadius: 10,
                  border: "none",
                  background:
                    appMode === "hr_dashboard"
                      ? "rgba(255,255,255,0.25)"
                      : "transparent",
                  color: "#FFFFFF",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                  whiteSpace: "nowrap"
                }}
              >
                <Users size={15} /> Painel do RH (Gestão)
              </button>

              <button
                onClick={() => {
                  setSelectedCandidate(null);
                  setAppMode("test_welcome");
                }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 16px",
                  borderRadius: 10,
                  border: "none",
                  background: appMode.startsWith("test_")
                    ? "rgba(255,255,255,0.25)"
                    : "transparent",
                  color: "#FFFFFF",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                  whiteSpace: "nowrap"
                }}
              >
                <PlusCircle size={15} /> Aplicar Mapeamento DISC
              </button>
            </div>
          )}
        </div>

        {/* STATUS DO SUPABASE E BOTÃO DE SAIR */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12
          }}
        >
          {/* Badge de status do Supabase */}
          <div
            title={isSupabaseConfigured ? "Banco de Dados Supabase Ativo e Conectado" : "Modo Local Fallback"}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: isSupabaseConfigured ? "#ECFDF5" : "rgba(255, 255, 255, 0.2)",
              color: isSupabaseConfigured ? "#059669" : "#FFFFFF",
              padding: "5px 12px",
              borderRadius: 999,
              fontSize: 11,
              fontWeight: 700,
              fontFamily: "'JetBrains Mono', monospace"
            }}
          >
            <Database size={12} />
            {isSupabaseConfigured ? "Supabase Conectado" : "Modo Local"}
          </div>

          {authUser && (
            <div
              style={{
                textAlign: "right",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 13,
                lineHeight: 1.4
              }}
            >
              <div style={{ fontWeight: 700 }}>Alpha Psicologia LTDA</div>
              <div style={{ fontSize: 11, opacity: 0.85 }}>{authUser.email}</div>
            </div>
          )}

          {authUser ? (
            <button
              onClick={handleLogout}
              title="Encerrar Sessão"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 16px",
                borderRadius: 999,
                border: "none",
                background: "#EF4444",
                color: "#FFFFFF",
                fontWeight: 800,
                fontSize: 13,
                cursor: "pointer",
                boxShadow: "0 4px 10px rgba(0,0,0,0.15)"
              }}
            >
              <LogOut size={15} /> Sair
            </button>
          ) : (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "rgba(255,255,255,0.2)",
                color: "#FFFFFF",
                padding: "6px 14px",
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 700
              }}
            >
              <Lock size={13} /> Acesso Autenticado
            </div>
          )}
        </div>
      </header>

      {/* ============================================================
         SISTEMA PROTEGIDO (ENTRADA ÚNICA VIA LOGIN/CADASTRO)
         ============================================================ */}
      {!authUser ? (
        /* SE NÃO ESTIVER AUTENTICADO: TELA ÚNICA DE LOGIN/CADASTRO DO RH */
        <HRAuthGatekeeperScreen onLoginSuccess={(user) => { setAuthUser(user); setAppMode("hr_dashboard"); loadCandidates(); }} />
      ) : (
        /* SE ESTIVER AUTENTICADO: NAVEGAÇÃO COMPLETA LIBERADA */
        <>
          {/* MÓDULO 1: DASHBOARD DE GESTÃO DO RH */}
          {appMode === "hr_dashboard" && !selectedCandidate && (
            <div style={{ width: "100%", maxWidth: "1600px", margin: "0 auto", padding: "32px 32px 60px" }}>
              {/* Dashboard Header Title */}
              <div className="flex-responsive-header" style={{ marginBottom: 28 }}>
                <div>
                  <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 30, fontWeight: 800, color: BRAND_DARK, margin: 0 }}>
                    Profiler — Gestão de Mapeamentos Comportamentais
                  </h1>
                  <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 15, color: TEXT_MUTED, margin: "6px 0 0" }}>
                    Alpha Psicologia LTDA • Sessão ativa como <strong>{authUser.email}</strong>.
                  </p>
                </div>

                <div style={{ display: "flex", gap: 12 }}>
                  <button
                    onClick={() => setAppMode("test_welcome")}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "12px 20px",
                      borderRadius: 12,
                      border: `1.5px solid ${BORDER_COLOR}`,
                      background: CARD_BG,
                      color: BRAND_DARK,
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: 14,
                      fontWeight: 700,
                      cursor: "pointer"
                    }}
                  >
                    <PlusCircle size={16} color={BRAND_PRIMARY} /> Aplicar Teste DISC
                  </button>

                  <button
                    onClick={() => setShowInviteModal(true)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "12px 24px",
                      borderRadius: 12,
                      border: "none",
                      background: BRAND_PURPLE,
                      color: "#FFFFFF",
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: 14,
                      fontWeight: 700,
                      cursor: "pointer",
                      boxShadow: "0 10px 20px -5px rgba(91, 121, 221, 0.35)",
                      whiteSpace: "nowrap"
                    }}
                  >
                    <Send size={16} /> Enviar Convite E-mail
                  </button>
                </div>
              </div>

              {/* Analytics Cards Grid */}
              <div className="grid-4-col" style={{ marginBottom: 28 }}>
                <div style={{ background: CARD_BG, borderRadius: 20, border: `1px solid ${BORDER_COLOR}`, padding: "24px", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.02)" }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: TEXT_MUTED, textTransform: "uppercase" }}>TOTAL DE RESULTADOS</span>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 34, fontWeight: 800, color: BRAND_DARK, margin: "4px 0" }}>
                    {candidates.length}
                  </div>
                  <span style={{ fontSize: 12, color: COLOR_MAIS, fontWeight: 600 }}>100% dos relatórios gerados</span>
                </div>

                <div style={{ background: CARD_BG, borderRadius: 20, border: `1px solid ${BORDER_COLOR}`, padding: "24px", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.02)" }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: TEXT_MUTED, textTransform: "uppercase" }}>PERFIL PREDOMINANTE</span>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 24, fontWeight: 800, color: PROFILE_COLORS.S, margin: "4px 0" }}>
                    Estabilidade (S)
                  </div>
                  <span style={{ fontSize: 12, color: TEXT_MUTED }}>42% do time corporativo</span>
                </div>

                <div style={{ background: CARD_BG, borderRadius: 20, border: `1px solid ${BORDER_COLOR}`, padding: "24px", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.02)" }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: TEXT_MUTED, textTransform: "uppercase" }}>MÉDIA DA ENERGIA</span>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 34, fontWeight: 800, color: BRAND_PRIMARY, margin: "4px 0" }}>
                    +2.4
                  </div>
                  <span style={{ fontSize: 12, color: COLOR_MAIS, fontWeight: 600 }}>Energia situacional elevada</span>
                </div>

                <div style={{ background: CARD_BG, borderRadius: 20, border: `1px solid ${BORDER_COLOR}`, padding: "24px", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.02)" }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: TEXT_MUTED, textTransform: "uppercase" }}>STATUS CONCLUÍDOS</span>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 34, fontWeight: 800, color: COLOR_MAIS, margin: "4px 0" }}>
                    {candidates.filter(c => c.status === "Concluído").length} / {candidates.length}
                  </div>
                  <span style={{ fontSize: 12, color: TEXT_MUTED }}>Prontos para análise de RH</span>
                </div>
              </div>

              {/* Search Bar & Profile Filters */}
              <div style={{ background: CARD_BG, borderRadius: 20, border: `1px solid ${BORDER_COLOR}`, padding: "20px 24px", marginBottom: 28, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.03)" }}>
                <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 16, flexWrap: "wrap" }}>
                  <div style={{ flex: 1, minWidth: 280, position: "relative" }}>
                    <Search size={18} color={TEXT_MUTED} style={{ position: "absolute", left: 14, top: 12 }} />
                    <input
                      type="text"
                      placeholder="Pesquisar por nome ou e-mail do colaborador..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "11px 16px 11px 44px",
                        borderRadius: 12,
                        border: `1.5px solid ${BORDER_COLOR}`,
                        fontSize: 14,
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        outline: "none"
                      }}
                    />
                  </div>

                  <div style={{ fontSize: 13, fontWeight: 700, color: TEXT_MUTED, fontFamily: "'JetBrains Mono', monospace" }}>
                    {candidates.length} RESULTADOS
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: TEXT_MUTED, marginRight: 4 }}>FILTRAR PERFIL:</span>
                  {["TODOS", "D", "I", "S", "C", "CE", "EC", "PA", "PC"].map((pf) => (
                    <button
                      key={pf}
                      onClick={() => setProfileFilter(pf)}
                      style={{
                        padding: "6px 16px",
                        borderRadius: 999,
                        border: `1.5px solid ${profileFilter === pf ? BRAND_PURPLE : BORDER_COLOR}`,
                        background: profileFilter === pf ? BRAND_PURPLE : "#F8FAFC",
                        color: profileFilter === pf ? "#FFFFFF" : TEXT_MUTED,
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: "pointer",
                        fontFamily: "'Plus Jakarta Sans', sans-serif"
                      }}
                    >
                      {pf === "TODOS" ? "Todos os Perfis" : pf}
                    </button>
                  ))}
                </div>
              </div>

              {/* SÓLIDES PROFILER CANDIDATES DATA TABLE */}
              <div className="table-responsive-container" style={{ background: CARD_BG, borderRadius: 20, border: `1px solid ${BORDER_COLOR}`, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.03)" }}>
                <table style={{ width: "100%", minWidth: 800, borderCollapse: "collapse", textAlign: "left", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  <thead>
                    <tr style={{ background: "#F8FAFC", borderBottom: `1.5px solid ${BORDER_COLOR}`, color: TEXT_MUTED, fontSize: 11, fontWeight: 800, letterSpacing: "0.05em" }}>
                      <th style={{ padding: "16px 24px" }}>COLABORADOR / NOME E E-MAIL</th>
                      <th style={{ padding: "16px 24px" }}>CARGO / EMPRESA</th>
                      <th style={{ padding: "16px 24px", textAlign: "center" }}>PERFIL PROFILER (COMBINAÇÃO)</th>
                      <th style={{ padding: "16px 24px" }}>DATA DE ENVIO</th>
                      <th style={{ padding: "16px 24px" }}>DATA DE RESPOSTA</th>
                      <th style={{ padding: "16px 24px", textAlign: "right" }}>AÇÕES DO RH</th>
                    </tr>
                  </thead>
                  <tbody>
                    {candidates.map((cand) => {
                      const pColor = PROFILE_COLORS[cand.primaryKey] || BRAND_PURPLE;

                      return (
                        <tr key={cand.id} style={{ borderBottom: `1px solid ${BORDER_COLOR}`, transition: "background 0.15s" }}>
                          {/* Name & Email with Avatar */}
                          <td style={{ padding: "16px 24px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                              {cand.avatar ? (
                                <img src={cand.avatar} alt={cand.name} style={{ width: 42, height: 42, borderRadius: 999, objectFit: "cover" }} />
                              ) : (
                                <div style={{ width: 42, height: 42, borderRadius: 999, background: pColor, color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 15 }}>
                                  {cand.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                                </div>
                              )}
                              <div>
                                <div style={{ fontSize: 14, fontWeight: 700, color: BRAND_DARK }}>{cand.name}</div>
                                <div style={{ fontSize: 12, color: BRAND_PRIMARY, display: "flex", alignItems: "center", gap: 4 }}>
                                  <Mail size={12} /> {cand.email}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Role & Company */}
                          <td style={{ padding: "16px 24px" }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: BRAND_DARK }}>{cand.role}</div>
                            <div style={{ fontSize: 12, color: TEXT_MUTED }}>{cand.company}</div>
                          </td>

                          {/* PROFILE BADGE — COMBINED ACRONYM */}
                          <td style={{ padding: "16px 24px", textAlign: "center" }}>
                            <span
                              title={`Perfil Combinado: ${cand.profileBadge} (${PROFILE_NAMES[cand.primaryKey]} + ${PROFILE_NAMES[cand.secondaryKey] || 'DISC'})`}
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                minWidth: 42,
                                height: 38,
                                borderRadius: 999,
                                background: `${pColor}1A`,
                                color: pColor,
                                fontWeight: 800,
                                fontSize: 13,
                                fontFamily: "'JetBrains Mono', monospace",
                                border: `1.5px solid ${pColor}`,
                                padding: "0 10px"
                              }}
                            >
                              {cand.profileBadge}
                            </span>
                          </td>

                          {/* Send Date */}
                          <td style={{ padding: "16px 24px", fontSize: 13, color: TEXT_MUTED }}>
                            {cand.sendDate}
                          </td>

                          {/* Response Date */}
                          <td style={{ padding: "16px 24px", fontSize: 13, color: TEXT_MUTED }}>
                            {cand.answerDate}
                          </td>

                          {/* Action Buttons */}
                          <td style={{ padding: "16px 24px", textAlign: "right" }}>
                            <div style={{ display: "inline-flex", gap: 6 }}>
                              <button
                                onClick={() => { setSelectedCandidate(cand); }}
                                title="Ver Relatório"
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: 6,
                                  padding: "7px 12px",
                                  borderRadius: 8,
                                  border: `1px solid ${BORDER_COLOR}`,
                                  background: "#FFFFFF",
                                  color: BRAND_DARK,
                                  fontSize: 12,
                                  fontWeight: 700,
                                  cursor: "pointer"
                                }}
                              >
                                <Eye size={14} color={BRAND_PRIMARY} /> Ver Relatório
                              </button>

                              <button
                                onClick={async () => {
                                  setSelectedCandidate(cand);
                                  setTimeout(async () => {
                                    await downloadExecutivePDF(cand.name);
                                  }, 300);
                                }}
                                title="Baixar PDF"
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: 6,
                                  padding: "7px 12px",
                                  borderRadius: 8,
                                  border: "none",
                                  background: BRAND_PURPLE,
                                  color: "#FFFFFF",
                                  fontSize: 12,
                                  fontWeight: 700,
                                  cursor: "pointer"
                                }}
                              >
                                <Download size={14} /> PDF
                              </button>

                              <button
                                onClick={() => handleDeleteCandidate(cand.id, cand.name)}
                                title="Excluir Registro"
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  justify: "center",
                                  width: 32,
                                  height: 32,
                                  borderRadius: 8,
                                  border: `1px solid ${BORDER_COLOR}`,
                                  background: "#FFFFFF",
                                  color: COLOR_MENOS,
                                  cursor: "pointer"
                                }}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* MÓDULO 2: TEST TAKER FLOW (ROTA AUTENTICADA DE APLICAÇÃO DE TESTE) */}
          {appMode === "test_welcome" && (
            <div style={{ width: "100%", maxWidth: 720, margin: "40px auto", padding: "0 20px" }}>
              <div style={{ textAlign: "center", marginBottom: 32 }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#EEF2FF", color: BRAND_PRIMARY, padding: "6px 16px", borderRadius: 999, fontSize: 13, fontWeight: 700, marginBottom: 14 }}>
                  <Compass size={16} /> AVALIAÇÃO COMPORTAMENTAL PROFILER
                </span>
                <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 34, fontWeight: 800, color: BRAND_DARK, marginBottom: 12 }}>
                  Aplicar Mapeamento DISC
                </h1>
                <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 16, color: TEXT_MUTED }}>
                  Insira os dados do colaborador para iniciar a resposta em 2 rodadas.
                </p>
              </div>

              <div style={{ background: CARD_BG, borderRadius: 24, border: `1px solid ${BORDER_COLOR}`, padding: 32, marginBottom: 28, boxShadow: "0 20px 25px -5px rgba(0,0,0,0.04)" }}>
                <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 19, fontWeight: 700, color: BRAND_DARK, marginBottom: 20 }}>
                  Dados do Respondente
                </h3>

                <div className="grid-2-col">
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: BRAND_DARK, marginBottom: 6 }}>Nome Completo</label>
                    <input type="text" value={userInfo.name} onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })} style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: `1.5px solid ${BORDER_COLOR}`, fontSize: 15 }} />
                  </div>

                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: BRAND_DARK, marginBottom: 6 }}>E-mail Profissional</label>
                    <input type="email" value={userInfo.email} onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })} style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: `1.5px solid ${BORDER_COLOR}`, fontSize: 15 }} />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: BRAND_DARK, marginBottom: 6 }}>Empresa</label>
                    <input type="text" value={userInfo.company} onChange={(e) => setUserInfo({ ...userInfo, company: e.target.value })} style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: `1.5px solid ${BORDER_COLOR}`, fontSize: 15 }} />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: BRAND_DARK, marginBottom: 6 }}>Cargo / Função</label>
                    <input type="text" value={userInfo.role} onChange={(e) => setUserInfo({ ...userInfo, role: e.target.value })} style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: `1.5px solid ${BORDER_COLOR}`, fontSize: 15 }} />
                  </div>
                </div>
              </div>

              <div style={{ textAlign: "center" }}>
                <PrimaryButton onClick={() => setAppMode("test_round1")}>
                  Iniciar Rodada 1 <ArrowRight size={18} />
                </PrimaryButton>
              </div>
            </div>
          )}

          {/* TEST ROUND 1 */}
          {appMode === "test_round1" && (
            <div style={{ width: "100%", maxWidth: 720, margin: "32px auto", padding: "0 20px 60px" }}>
              <div style={{ marginBottom: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 700, color: BRAND_PRIMARY }}>
                    RODADA 1 DE 2 • AUTOPERCEPÇÃO
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: BRAND_DARK }}>
                    Bloco {idx1 + 1} de {ROUND1_ORDER.length} ({Math.round(((idx1 + 1) / ROUND1_ORDER.length) * 100)}%)
                  </span>
                </div>
                <div style={{ width: "100%", height: 8, background: "#E2E8F0", borderRadius: 999, overflow: "hidden" }}>
                  <div style={{ width: `${Math.round(((idx1 + 1) / ROUND1_ORDER.length) * 100)}%`, height: "100%", background: BRAND_PRIMARY, transition: "width 0.3s" }} />
                </div>
              </div>

              <div style={{ background: CARD_BG, borderRadius: 24, border: `1px solid ${BORDER_COLOR}`, padding: 32, boxShadow: "0 20px 25px -5px rgba(0,0,0,0.04)" }}>
                <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 24, fontWeight: 800, color: BRAND_DARK, marginBottom: 8 }}>
                  Marque os adjetivos que melhor te representam
                </h2>
                <p style={{ fontSize: 14, color: TEXT_MUTED, marginBottom: 24 }}>
                  Escolha obrigatoriamente <strong>1 adjetivo para MAIS (+)</strong> e <strong>1 para MENOS (-)</strong>.
                </p>

                {currentAdjectives(1, currentItem1).map((adj, i) => {
                  const ans = r1[keyForR1(currentItem1)] || {};
                  return (
                    <AdjectiveChoiceRow
                      key={i}
                      text={adj.text}
                      tooltip={adj.tooltip}
                      isMais={ans.mais === i}
                      isMenos={ans.menos === i}
                      onSelectMais={() => selectAnswer(1, keyForR1(currentItem1), "mais", i)}
                      onSelectMenos={() => selectAnswer(1, keyForR1(currentItem1), "menos", i)}
                    />
                  );
                })}

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 28 }}>
                  <button type="button" onClick={idx1 > 0 ? () => setIdx1((n) => n - 1) : undefined} disabled={idx1 === 0} style={{ background: "none", border: "none", color: idx1 > 0 ? BRAND_DARK : "#CBD5E1", cursor: idx1 > 0 ? "pointer" : "default", fontWeight: 700, fontSize: 14 }}>
                    ← Bloco Anterior
                  </button>

                  <PrimaryButton
                    onClick={() => {
                      if (idx1 + 1 < ROUND1_ORDER.length) setIdx1((n) => n + 1);
                      else setAppMode("test_transition");
                    }}
                    disabled={!(r1[keyForR1(currentItem1)]?.mais !== undefined && r1[keyForR1(currentItem1)]?.menos !== undefined)}
                  >
                    Próximo Bloco <ArrowRight size={18} />
                  </PrimaryButton>
                </div>
              </div>
            </div>
          )}

          {/* TRANSITION SCREEN */}
          {appMode === "test_transition" && (
            <div style={{ width: "100%", maxWidth: 640, margin: "80px auto", textAlign: "center", padding: "0 20px" }}>
              <Sparkles size={40} color={BRAND_PRIMARY} style={{ marginBottom: 16 }} />
              <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 30, fontWeight: 800, color: BRAND_DARK, marginBottom: 14 }}>
                Primeira Etapa Concluída!
              </h2>
              <p style={{ fontSize: 16, color: TEXT_MUTED, lineHeight: 1.6, marginBottom: 32 }}>
                Agora na <strong>Rodada 2</strong>, reavalie os 25 blocos sob o ponto de vista da <em>expectativa externa (como os outros esperam que você seja)</em>.
              </p>
              <PrimaryButton onClick={() => setAppMode("test_round2")}>
                Iniciar Rodada 2 <ArrowRight size={18} />
              </PrimaryButton>
            </div>
          )}

          {/* TEST ROUND 2 */}
          {appMode === "test_round2" && (
            <div style={{ width: "100%", maxWidth: 720, margin: "32px auto", padding: "0 20px 60px" }}>
              <div style={{ marginBottom: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 700, color: "#6B5B95" }}>
                    RODADA 2 DE 2 • PERCEPÇÃO EXTERNA
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: BRAND_DARK }}>
                    Bloco {idx2 + 1} de {ROUND2_ORDER.length} ({Math.round(((idx2 + 1) / ROUND2_ORDER.length) * 100)}%)
                  </span>
                </div>
                <div style={{ width: "100%", height: 8, background: "#E2E8F0", borderRadius: 999, overflow: "hidden" }}>
                  <div style={{ width: `${Math.round(((idx2 + 1) / ROUND2_ORDER.length) * 100)}%`, height: "100%", background: "#6B5B95", transition: "width 0.3s" }} />
                </div>
              </div>

              <div style={{ background: CARD_BG, borderRadius: 24, border: `1px solid ${BORDER_COLOR}`, padding: 32, boxShadow: "0 20px 25px -5px rgba(0,0,0,0.04)" }}>
                <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 24, fontWeight: 800, color: BRAND_DARK, marginBottom: 8 }}>
                  Marque como os outros pensam que você deveria ser
                </h2>
                <p style={{ fontSize: 14, color: TEXT_MUTED, marginBottom: 24 }}>
                  O que <strong>MAIS esperam que você seja (+)</strong> e o que <strong>MENOS esperam que você seja (-)</strong>.
                </p>

                {currentAdjectives(2, currentItem2).map((adj, i) => {
                  const ans = r2[keyForR2(currentItem2)] || {};
                  return (
                    <AdjectiveChoiceRow
                      key={i}
                      text={adj.text}
                      tooltip={adj.tooltip}
                      isMais={ans.mais === i}
                      isMenos={ans.menos === i}
                      onSelectMais={() => selectAnswer(2, keyForR2(currentItem2), "mais", i)}
                      onSelectMenos={() => selectAnswer(2, keyForR2(currentItem2), "menos", i)}
                    />
                  );
                })}

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 28 }}>
                  <button type="button" onClick={idx2 > 0 ? () => setIdx2((n) => n - 1) : undefined} disabled={idx2 === 0} style={{ background: "none", border: "none", color: idx2 > 0 ? BRAND_DARK : "#CBD5E1", cursor: idx2 > 0 ? "pointer" : "default", fontWeight: 700, fontSize: 14 }}>
                    ← Bloco Anterior
                  </button>

                  <PrimaryButton
                    onClick={() => {
                      if (idx2 + 1 < ROUND2_ORDER.length) setIdx2((n) => n + 1);
                      else {
                        setAppMode("test_loading");
                        setTimeout(() => handleFinishAssessment(), 1200);
                      }
                    }}
                    disabled={!(r2[keyForR2(currentItem2)]?.mais !== undefined && r2[keyForR2(currentItem2)]?.menos !== undefined)}
                  >
                    {idx2 + 1 === ROUND2_ORDER.length ? "Finalizar & Gerar Relatório" : "Próximo Bloco"} <ArrowRight size={18} />
                  </PrimaryButton>
                </div>
              </div>
            </div>
          )}

          {/* LOADING SCREEN */}
          {appMode === "test_loading" && (
            <div style={{ textAlign: "center", padding: "140px 20px" }}>
              <div style={{ width: 48, height: 48, border: `4px solid ${BORDER_COLOR}`, borderTopColor: BRAND_PURPLE, borderRadius: "50%", margin: "0 auto 24px", animation: "spin 0.8s linear infinite" }} />
              <style>{"@keyframes spin { to { transform: rotate(360deg); } }"}</style>
              <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 24, fontWeight: 700, color: BRAND_DARK }}>
                Consolidando Mapeamento Profiler...
              </h3>
            </div>
          )}

          {/* MÓDULO 3: VISUALIZADOR DE LAUDO EXECUTIVO (WEB & PDF) */}
          {(appMode === "test_results" || selectedCandidate) && currentResults && (
            <div style={{ width: "100%" }}>
              {/* Top Action Bar */}
              <div style={{ position: "sticky", top: 0, zIndex: 200, background: "rgba(255, 255, 255, 0.95)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${BORDER_COLOR}`, padding: "14px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <button onClick={() => { setSelectedCandidate(null); setAppMode("hr_dashboard"); }} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, border: `1px solid ${BORDER_COLOR}`, background: CARD_BG, cursor: "pointer", fontSize: 13, fontWeight: 700 }}>
                    ← Voltar ao Painel RH
                  </button>
                  <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 18, fontWeight: 800, color: BRAND_DARK }}>
                    Relatório Profiler — {currentResults.userInfo.name}
                  </span>
                </div>

                <div style={{ display: "flex", gap: 12 }}>
                  <button
                    onClick={handleDownloadPDF}
                    disabled={isGeneratingPDF}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "9px 22px",
                      borderRadius: 10,
                      border: "none",
                      background: BRAND_PURPLE,
                      color: "#FFFFFF",
                      cursor: isGeneratingPDF ? "default" : "pointer",
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: 13,
                      fontWeight: 700,
                      boxShadow: "0 4px 12px rgba(91, 121, 221, 0.25)"
                    }}
                  >
                    <Download size={15} /> {isGeneratingPDF ? "Gerando PDF..." : "Baixar Relatório PDF"}
                  </button>
                </div>
              </div>

              {/* Web View Page Tabs */}
              <div style={{ width: "100%", maxWidth: "1200px", margin: "24px auto 12px", padding: "0 24px" }}>
                <div style={{ display: "flex", gap: 8, background: "#E2E8F0", padding: 6, borderRadius: 16, overflowX: "auto" }}>
                  {[
                    { id: 1, label: "Pág 1: Perfil Combinado" },
                    { id: 2, label: "Pág 2: Análise Detalhada" },
                    { id: 3, label: "Pág 3: Subfatores" },
                    { id: 4, label: "Pág 4: Gráficos & Gap" },
                    { id: 5, label: "Pág 5: Indicadores Situacionais" },
                    { id: 6, label: "Pág 6: Plano de Ação Metas" }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      style={{
                        flex: 1,
                        padding: "10px 16px",
                        borderRadius: 10,
                        border: "none",
                        background: activeTab === tab.id ? CARD_BG : "transparent",
                        color: activeTab === tab.id ? BRAND_DARK : TEXT_MUTED,
                        fontSize: 13,
                        fontWeight: activeTab === tab.id ? 700 : 600,
                        cursor: "pointer",
                        whiteSpace: "nowrap"
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* WEB VIEW CONTENT DISPLAY */}
              <div style={{ width: "100%", maxWidth: "1200px", margin: "0 auto", padding: "10px 24px 60px" }}>
                {activeTab === 1 && (
                  <WebPageFrame pageNum={1} title="Capa Executiva & Perfil Combinado">
                    <VibrantHeaderMetadata info={currentResults.userInfo} />
                    <VibrantMainProfileHero
                      primaryProfile={currentResults.primaryProfile}
                      primaryKey={currentResults.primaryKey}
                      secondaryProfile={currentResults.secondaryProfile}
                      secondaryKey={currentResults.secondaryKey}
                      combination={currentResults.combination}
                    />
                    <VibrantMethodologyIntro />
                  </WebPageFrame>
                )}

                {activeTab === 2 && (
                  <WebPageFrame pageNum={2} title="Análise Aprofundada do Perfil Principal">
                    <VibrantProfileDeepDive profile={currentResults.primaryProfile} primaryKey={currentResults.primaryKey} />
                  </WebPageFrame>
                )}

                {activeTab === 3 && (
                  <WebPageFrame pageNum={3} title="Análise da Combinação (Subfatores)">
                    <VibrantCombinationDeepDive combination={currentResults.combination} primaryKey={currentResults.primaryKey} secondaryKey={currentResults.secondaryKey} />
                  </WebPageFrame>
                )}

                {activeTab === 4 && (
                  <WebPageFrame pageNum={4} title="Gráficos de Perfil e Análise de Gap">
                    <VibrantChartsSection totals1={currentResults.totals1} totals2={currentResults.totals2} gap={currentResults.gap} maxAbs={Math.max(1, ...PROFILE_KEYS.map((p) => Math.max(Math.abs(currentResults.totals1[p]), Math.abs(currentResults.totals2[p]))))} />
                  </WebPageFrame>
                )}

                {activeTab === 5 && (
                  <WebPageFrame pageNum={5} title="Detalhamento dos 7 Indicadores Situacionais">
                    <VibrantSituationalSection situational={currentResults.situational} />
                  </WebPageFrame>
                )}

                {activeTab === 6 && (
                  <WebPageFrame pageNum={6} title="Plano de Ação Integrado & Matriz de Metas">
                    <VibrantIntegratedPlanSection plan={currentResults.integratedPlan} profileName={currentResults.primaryProfile.name} />
                  </WebPageFrame>
                )}
              </div>

              {/* HIDDEN PRINT / PDF CONTAINERS FOR PERFECT 6-PAGE EXPORT */}
              <div style={{ position: "absolute", left: "-9999px", top: 0, width: "210mm" }}>
                <PDFPageContainer id="pdf-page-1">
                  <VibrantHeaderMetadata info={currentResults.userInfo} />
                  <VibrantMainProfileHero
                    primaryProfile={currentResults.primaryProfile}
                    primaryKey={currentResults.primaryKey}
                    secondaryProfile={currentResults.secondaryProfile}
                    secondaryKey={currentResults.secondaryKey}
                    combination={currentResults.combination}
                  />
                  <VibrantMethodologyIntro />
                </PDFPageContainer>

                <PDFPageContainer id="pdf-page-2">
                  <VibrantProfileDeepDive profile={currentResults.primaryProfile} primaryKey={currentResults.primaryKey} />
                </PDFPageContainer>

                <PDFPageContainer id="pdf-page-3">
                  <VibrantCombinationDeepDive combination={currentResults.combination} primaryKey={currentResults.primaryKey} secondaryKey={currentResults.secondaryKey} />
                </PDFPageContainer>

                <PDFPageContainer id="pdf-page-4">
                  <VibrantChartsSection totals1={currentResults.totals1} totals2={currentResults.totals2} gap={currentResults.gap} maxAbs={Math.max(1, ...PROFILE_KEYS.map((p) => Math.max(Math.abs(currentResults.totals1[p]), Math.abs(currentResults.totals2[p]))))} />
                </PDFPageContainer>

                <PDFPageContainer id="pdf-page-5">
                  <VibrantSituationalSection situational={currentResults.situational} />
                </PDFPageContainer>

                <PDFPageContainer id="pdf-page-6">
                  <VibrantIntegratedPlanSection plan={currentResults.integratedPlan} profileName={currentResults.primaryProfile.name} />
                </PDFPageContainer>
              </div>
            </div>
          )}

          {/* INVITE NEW CANDIDATE MODAL */}
          {showInviteModal && (
            <div style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(6px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
              <div style={{ background: CARD_BG, borderRadius: 24, padding: 32, width: 460, maxWidth: "100%", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                  <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 20, fontWeight: 800, color: BRAND_DARK, margin: 0 }}>
                    Enviar Convite do Profiler DISC
                  </h3>
                  <button onClick={() => setShowInviteModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: TEXT_MUTED }}>
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSendInvite}>
                  <div style={{ marginBottom: 14 }}>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: BRAND_DARK, marginBottom: 4 }}>Nome do Colaborador</label>
                    <input
                      type="text"
                      required
                      value={inviteForm.name}
                      onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
                      placeholder="Ex: João Roberto Santos"
                      style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${BORDER_COLOR}`, fontSize: 14 }}
                    />
                  </div>

                  <div style={{ marginBottom: 14 }}>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: BRAND_DARK, marginBottom: 4 }}>E-mail para Envio</label>
                    <input
                      type="email"
                      required
                      value={inviteForm.email}
                      onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                      placeholder="joao.santos@empresa.com.br"
                      style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${BORDER_COLOR}`, fontSize: 14 }}
                    />
                  </div>

                  <div style={{ marginBottom: 20 }}>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: BRAND_DARK, marginBottom: 4 }}>Cargo / Função</label>
                    <input
                      type="text"
                      value={inviteForm.role}
                      onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value })}
                      placeholder="Ex: Analista de Vendas"
                      style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${BORDER_COLOR}`, fontSize: 14 }}
                    />
                  </div>

                  <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
                    <button type="button" onClick={() => setShowInviteModal(false)} style={{ padding: "10px 18px", borderRadius: 10, border: `1px solid ${BORDER_COLOR}`, background: "none", fontWeight: 700, cursor: "pointer", fontSize: 14 }}>
                      Cancelar
                    </button>
                    <button type="submit" style={{ padding: "10px 22px", borderRadius: 10, border: "none", background: BRAND_PURPLE, color: "#FFFFFF", fontWeight: 700, cursor: "pointer", fontSize: 14 }}>
                      Enviar Link por E-mail
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}
    </Shell>
  );
}

/* ============================================================
   REPORT SECTION COMPONENTS
   ============================================================ */

function VibrantHeaderMetadata({ info }) {
  return (
    <div style={{ borderBottom: `2px solid ${BORDER_COLOR}`, paddingBottom: 16, marginBottom: 20 }}>
      <div className="flex-responsive-header">
        <div>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 800, color: BRAND_PURPLE, letterSpacing: "0.1em" }}>
            SÓLIDES PROFILER • SISTEMA DE GESTÃO DE RH
          </span>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 22, fontWeight: 800, color: BRAND_DARK, margin: "2px 0 0" }}>
            Relatório de Perfil Comportamental DISC
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "auto auto", gap: "6px 20px", fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, color: BRAND_DARK }}>
          <span><strong>Respondente:</strong> {info.name}</span>
          <span><strong>Empresa:</strong> {info.company}</span>
          <span><strong>Cargo:</strong> {info.role}</span>
          <span><strong>Data:</strong> {info.date}</span>
        </div>
      </div>
    </div>
  );
}

function VibrantMainProfileHero({ primaryProfile, primaryKey, secondaryProfile, secondaryKey, combination }) {
  const color = PROFILE_COLORS[primaryKey];
  const gradient = PROFILE_GRADIENTS[primaryKey];
  const comboSigla = secondaryKey ? `${primaryKey}/${secondaryKey}` : primaryKey;

  return (
    <div style={{ background: gradient, borderRadius: 24, padding: "28px", color: "#FFFFFF", marginBottom: 20, boxShadow: `0 20px 30px -10px ${color}55` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 12 }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 800, background: "rgba(255,255,255,0.2)", padding: "4px 12px", borderRadius: 999, letterSpacing: "0.1em" }}>
          PERFIL COMBINADO PROFILER (RODADA 1)
        </span>
        {secondaryProfile && (
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 800, background: "#FFFFFF", color: color, padding: "4px 14px", borderRadius: 999 }}>
            Combinação: {comboSigla} ({primaryProfile.name} + {secondaryProfile.name})
          </span>
        )}
      </div>

      <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 34, fontWeight: 800, margin: "8px 0 6px", color: "#FFFFFF" }}>
        {secondaryProfile ? `${primaryProfile.name} + ${secondaryProfile.name} (${comboSigla})` : `${primaryProfile.name} (${primaryKey})`}
      </h1>
      <h3 style={{ fontSize: 18, opacity: 0.95, fontWeight: 700, margin: "0 0 16px" }}>
        {combination ? combination.name : primaryProfile.title}
      </h3>

      <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 15, lineHeight: 1.6, opacity: 0.95, marginBottom: 18 }}>
        {combination ? combination.description : primaryProfile.summary}
      </p>

      {combination && (
        <div style={{ background: "rgba(255,255,255,0.18)", backdropFilter: "blur(8px)", padding: "16px 20px", borderRadius: 16, border: "1px solid rgba(255,255,255,0.3)" }}>
          <div style={{ fontSize: 14, fontWeight: 800 }}>📌 Dinâmica dos Subfatores: {combination.name}</div>
          <div style={{ fontSize: 13, opacity: 0.95, marginTop: 4 }}><strong>Palavras-chave da combinação:</strong> {combination.keywords}</div>
        </div>
      )}
    </div>
  );
}

function VibrantMethodologyIntro() {
  return (
    <div style={{ background: CARD_BG, borderRadius: 18, border: `1px solid ${BORDER_COLOR}`, padding: "22px", color: TEXT_MUTED, fontSize: 14, lineHeight: 1.6 }}>
      <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 17, fontWeight: 800, color: BRAND_DARK, marginBottom: 10 }}>
        Metodologia de Mapeamento DISC
      </h3>
      <p style={{ marginBottom: 14 }}>
        O Profiler DISC identifica tendências comportamentais divididas em 4 vertentes corporativas:
      </p>
      <div className="grid-2-col">
        <div style={{ borderLeft: `4px solid ${PROFILE_COLORS.D}`, paddingLeft: 12 }}>
          <strong style={{ color: PROFILE_COLORS.D }}>Dominância (D):</strong> Foco em metas e tomada de decisão.
        </div>
        <div style={{ borderLeft: `4px solid ${PROFILE_COLORS.I}`, paddingLeft: 12 }}>
          <strong style={{ color: PROFILE_COLORS.I }}>Influência (I):</strong> Comunicação e persuasão.
        </div>
        <div style={{ borderLeft: `4px solid ${PROFILE_COLORS.S}`, paddingLeft: 12 }}>
          <strong style={{ color: PROFILE_COLORS.S }}>Estabilidade (S):</strong> Planejamento e constância.
        </div>
        <div style={{ borderLeft: `4px solid ${PROFILE_COLORS.C}`, paddingLeft: 12 }}>
          <strong style={{ color: PROFILE_COLORS.C }}>Conformidade (C):</strong> Rigor técnico e qualidade.
        </div>
      </div>
    </div>
  );
}

function VibrantProfileDeepDive({ profile, primaryKey }) {
  const pColor = PROFILE_COLORS[primaryKey];

  return (
    <div>
      <div style={{ marginBottom: 20, borderBottom: `2px solid ${BORDER_COLOR}`, paddingBottom: 10 }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: pColor, fontWeight: 800 }}>
          DIAGNÓSTICO DETALHADO DO PERFIL
        </span>
        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 26, fontWeight: 800, color: BRAND_DARK, margin: "2px 0 0" }}>
          Perfil {profile.name} — {profile.title}
        </h2>
      </div>

      <div className="grid-2-1-col" style={{ marginBottom: 18 }}>
        <div style={{ background: CARD_BG, borderRadius: 18, border: `1px solid ${BORDER_COLOR}`, padding: "20px" }}>
          <h4 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 16, fontWeight: 800, color: BRAND_DARK, marginBottom: 12 }}>
            Características Marcantes
          </h4>
          <ul style={{ paddingLeft: 20, fontSize: 14, color: TEXT_MUTED, lineHeight: 1.6, margin: 0 }}>
            {profile.characteristics.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </div>

        <div style={{ background: CARD_BG, borderRadius: 18, border: `1px solid ${BORDER_COLOR}`, padding: "20px" }}>
          <h4 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 16, fontWeight: 800, color: BRAND_DARK, marginBottom: 12 }}>
            Palavras-Chave
          </h4>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {profile.keywords.map((kw, i) => (
              <span key={i} style={{ background: `${pColor}1A`, color: pColor, fontSize: 12, fontWeight: 700, padding: "5px 12px", borderRadius: 999 }}>
                {kw}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid-2-col">
        <div style={{ background: BG_MAIS, borderRadius: 18, border: `1.5px solid ${BORDER_MAIS}`, padding: "20px" }}>
          <h4 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 16, fontWeight: 800, color: COLOR_MAIS, marginBottom: 12 }}>
            Pontos Fortes
          </h4>
          <ul style={{ paddingLeft: 20, fontSize: 14, color: BRAND_DARK, lineHeight: 1.6, margin: 0 }}>
            {profile.strengths.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>

        <div style={{ background: BG_MENOS, borderRadius: 18, border: `1.5px solid ${BORDER_MENOS}`, padding: "20px" }}>
          <h4 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 16, fontWeight: 800, color: COLOR_MENOS, marginBottom: 12 }}>
            Pontos de Atenção
          </h4>
          <ul style={{ paddingLeft: 20, fontSize: 14, color: BRAND_DARK, lineHeight: 1.6, margin: 0 }}>
            {profile.attentionPoints.map((ap, i) => (
              <li key={i}>{ap}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function VibrantCombinationDeepDive({ combination, primaryKey, secondaryKey }) {
  return (
    <div>
      <div style={{ marginBottom: 20, borderBottom: `2px solid ${BORDER_COLOR}`, paddingBottom: 10 }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: BRAND_PURPLE, fontWeight: 800 }}>
          SUBFATORES DE DESEMPENHO
        </span>
        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 26, fontWeight: 800, color: BRAND_DARK, margin: "2px 0 0" }}>
          Combinação {primaryKey}/{secondaryKey} — {combination.name}
        </h2>
      </div>

      <div style={{ background: CARD_BG, borderRadius: 18, border: `1px solid ${BORDER_COLOR}`, padding: "24px" }}>
        <h4 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 18, fontWeight: 800, color: BRAND_DARK, marginBottom: 10 }}>
          Dinâmica Comportamental Integrada
        </h4>
        <p style={{ fontSize: 15, color: TEXT_MUTED, lineHeight: 1.65, marginBottom: 14 }}>
          {combination.description}
        </p>
        <div style={{ fontSize: 14, color: BRAND_DARK, fontWeight: 700 }}>
          Palavras-chave: {combination.keywords}
        </div>
      </div>
    </div>
  );
}

function VibrantChartsSection({ totals1, totals2, gap, maxAbs }) {
  return (
    <div>
      <div style={{ marginBottom: 20, borderBottom: `2px solid ${BORDER_COLOR}`, paddingBottom: 10 }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: BRAND_PURPLE, fontWeight: 800 }}>
          MÉTRICAS QUANTITATIVAS & GAP DE PERCEPÇÃO
        </span>
        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 26, fontWeight: 800, color: BRAND_DARK, margin: "2px 0 0" }}>
          Gráficos Comparativos da Avaliação
        </h2>
      </div>

      <div style={{ background: CARD_BG, borderRadius: 18, border: `1px solid ${BORDER_COLOR}`, padding: "24px" }}>
        <h4 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 18, fontWeight: 800, color: BRAND_DARK, marginBottom: 18 }}>
          Comparativo Rodada 1 (Autopercepção) vs Rodada 2 (Expectativa Externa)
        </h4>

        {PROFILE_KEYS.map((p) => {
          const val1 = totals1[p];
          const val2 = totals2[p];
          const color = PROFILE_COLORS[p];
          const w1 = Math.max(4, (Math.abs(val1) / maxAbs) * 100);
          const w2 = Math.max(4, (Math.abs(val2) / maxAbs) * 100);

          return (
            <div key={p} style={{ marginBottom: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, fontWeight: 800, color: BRAND_DARK, marginBottom: 6 }}>
                <span style={{ color }}>{p} — {PROFILE_NAMES[p]}</span>
                <span style={{ color: gap[p] < 0 ? COLOR_MENOS : gap[p] > 0 ? COLOR_MAIS : TEXT_MUTED }}>
                  R1: {val1} pts | R2: {val2} pts | Gap: {gap[p] > 0 ? `+${gap[p]}` : gap[p]}
                </span>
              </div>

              <div style={{ background: "#F1F5F9", borderRadius: 8, height: 16, marginBottom: 6 }}>
                <div style={{ width: `${w1}%`, height: "100%", background: color, borderRadius: 8, transition: "width 0.3s" }} />
              </div>

              <div style={{ background: "#F1F5F9", borderRadius: 8, height: 16, border: `2px solid ${color}` }}>
                <div style={{ width: `${w2}%`, height: "100%", background: `${color}44`, borderRadius: 8, transition: "width 0.3s" }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function VibrantSituationalSection({ situational }) {
  return (
    <div>
      <div style={{ marginBottom: 20, borderBottom: `2px solid ${BORDER_COLOR}`, paddingBottom: 10 }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: BRAND_PURPLE, fontWeight: 800 }}>
          INDICADORES SITUACIONAIS
        </span>
        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 26, fontWeight: 800, color: BRAND_DARK, margin: "2px 0 0" }}>
          Detalhamento dos 7 Indicadores Situacionais
        </h2>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 14 }}>
        {Object.values(situational).map((s) => {
          const isHigh = s.score >= 2;
          const isLow = s.score <= -2;
          const badgeColor = isHigh ? COLOR_MAIS : isLow ? COLOR_MENOS : BRAND_PURPLE;

          return (
            <div key={s.key} style={{ background: CARD_BG, borderRadius: 18, border: `1px solid ${BORDER_COLOR}`, padding: "20px 24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <strong style={{ fontFamily: "'Outfit', sans-serif", fontSize: 18, fontWeight: 800, color: BRAND_DARK }}>{s.label}</strong>
                <span style={{ background: `${badgeColor}1A`, color: badgeColor, fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 800, padding: "4px 12px", borderRadius: 999 }}>
                  Score: {s.score > 0 ? `+${s.score}` : s.score}
                </span>
              </div>
              <p style={{ fontSize: 14, color: TEXT_MUTED, margin: 0, lineHeight: 1.55 }}>{s.interpretationText}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function VibrantIntegratedPlanSection({ plan, profileName }) {
  return (
    <div>
      <div style={{ marginBottom: 20, borderBottom: `2px solid ${BORDER_COLOR}`, paddingBottom: 10 }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: BRAND_PURPLE, fontWeight: 800 }}>
          PLANO DE DESENVOLVIMENTO INDIVIDUAL
        </span>
        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 26, fontWeight: 800, color: BRAND_DARK, margin: "2px 0 0" }}>
          Matriz Integrada de Metas Estratégicas
        </h2>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
        <div style={{ background: CARD_BG, borderRadius: 18, border: `1px solid ${BORDER_COLOR}`, padding: "20px" }}>
          <h4 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 17, fontWeight: 800, color: COLOR_MENOS, marginBottom: 12 }}>
            Metas de Curto Prazo (30 dias)
          </h4>
          <ul style={{ paddingLeft: 20, fontSize: 14, color: TEXT_MUTED, lineHeight: 1.6, margin: 0 }}>
            {plan.shortTerm.map((st, i) => (
              <li key={i}>{st}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   SHELL CONTAINER & UTILITIES
   ============================================================ */

function Shell({ children }) {
  return (
    <div style={{ background: BRAND_SURFACE, minHeight: "100vh", width: "100%", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{RESPONSIVE_CSS}</style>
      {children}
    </div>
  );
}

function PrimaryButton({ children, onClick, disabled }) {
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        padding: "14px 28px",
        borderRadius: 14,
        border: "none",
        cursor: disabled ? "default" : "pointer",
        background: disabled ? "#E2E8F0" : BRAND_PURPLE,
        color: disabled ? "#94A3B8" : "#FFFFFF",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: 15,
        fontWeight: 800,
        boxShadow: disabled ? "none" : "0 10px 20px -5px rgba(91, 121, 221, 0.35)",
        transition: "all 0.2s"
      }}
    >
      {children}
    </button>
  );
}

function WebPageFrame({ pageNum, title, children }) {
  return (
    <div style={{ background: CARD_BG, borderRadius: 24, border: `1px solid ${BORDER_COLOR}`, padding: "32px", marginBottom: 24, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.03)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, borderBottom: `1px solid ${BORDER_COLOR}`, paddingBottom: 12 }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 800, color: BRAND_PURPLE }}>
          PÁGINA {pageNum} DE 6
        </span>
        <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 16, fontWeight: 800, color: BRAND_DARK }}>
          {title}
        </span>
      </div>
      {children}
    </div>
  );
}

function PDFPageContainer({ id, children }) {
  return (
    <div
      id={id}
      style={{
        width: "210mm",
        height: "296mm",
        background: BRAND_SURFACE,
        boxSizing: "border-box",
        padding: "20mm",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        color: BRAND_DARK,
        overflow: "hidden"
      }}
    >
      {children}
    </div>
  );
}
