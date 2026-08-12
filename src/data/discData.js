/* ============================================================
   DISC ASSESSMENT DATA, CONFIGURATION & HR MANAGEMENT MOCKS
   ============================================================ */

export const TOOLTIPS = {
  "Egocêntrica": "Pessoa que age apenas em interesse próprio, que se preocupa exclusivamente consigo mesmo, sem se importar com os demais.",
  "Tagarela": "Aquele que fala sem parar sobre assuntos frívolos, bobos. Pessoa que fala demais.",
  "Estrutural": "Pessoa focada em estruturas, padrões. Gostam de regras, normas.",
  "Meticulosa": "Pessoa que demonstra atenção, cuidado. Pessoa detalhista.",
  "Assertiva": "Pessoa confiante que se comunica com clareza, firmeza e respeito, expressando suas opiniões sem agressividade nem passividade.",
  "Extravagante": "Pessoa que se destaca por ser estranho ou fora do comum; excêntrico, diferente.",
  "Modesta": "Pessoa sem vaidade; que não possui presunção; despretensiosa. Que não gosta de se expor nem de se mostrar.",
  "Convincente": "Pessoa que é capaz de convencer ou tem poder para isso. Que faz com que alguém mude de comportamento ou opinião.",
  "Processual": "Uma pessoa processual gosta de seguir etapas, valoriza a ordem e prefere agir com planejamento e consistência.",
  "Intransigente": "Pessoa que não é tolerante nem flexível; que não realiza concessão; intolerante.",
  "Convencional": "Pessoa que obedece padrões ou regras já estabelecidas.",
  "Expansiva": "Pessoa que consegue se abrir, ser flexível. Que se expressa com facilidade.",
  "Reluzente": "Pessoa brilhante, que tem um 'luz' natural, expansiva.",
  "Persuasiva": "Pessoa que é convincente; que leva alguém a fazer certa coisa, a acreditar em determinada crença, a mudar de opinião ou de comportamento.",
  "Metódica": "Pessoa que gosta de ordem, que está atento aos detalhes; minucioso, meticuloso.",
  "Política": "Pessoa astuta, esperta, hábil: encontrou uma solução adequada sem ser agressivo ou desrespeitoso.",
  "Sistemática": "Pessoa metódica, que gosta de ordem, método.",
  "Inquisitiva": "Pessoa que faz muitas perguntas. Curiosa.",
  "Dada": "Pessoa muito sociável, muito comunicativa.",
  "Cética": "Pessoa que não acredita em nada; que tende a duvidar de tudo; descrente. Questionadora."
};

// 25 DISC blocks. Word order: Dominância (D), Influência (I), Estabilidade (S), Conformidade (C)
export const DISC_WORDS = [
  ["Objetiva", "Exagerada", "Estável", "Exata"],
  ["Inovadora", "Comunicativa", "Agradável", "Elegante"],
  ["Egocêntrica", "Tagarela", "Acomodada", "Estrutural"],
  ["Exigente", "Sociável", "Leal", "Rigorosa"],
  ["Audaciosa", "Extrovertida", "Casual", "Meticulosa"],
  ["Assertiva", "Otimista", "Paciente", "Prudente"],
  ["Autoritária", "Extravagante", "Modesta", "Dependente"],
  ["Inspira Confiança", "Convincente", "Compreensiva", "Pontual"],
  ["Força de Vontade", "Espontânea", "Satisfeita", "Conservadora"],
  ["Direta", "Jovial", "Moderada", "Processual"],
  ["Fazedora", "Inspirada", "Persistente", "Perfeccionista"],
  ["Enérgica", "Entusiasmada", "Calma", "Disciplinada"],
  ["Intimidante", "Sem Cerimônia", "Reservada", "Intransigente"],
  ["Pioneira", "Divertida", "Tranquila", "Convencional"],
  ["Agressiva", "Expansiva", "Possessiva", "Julgadora"],
  ["Firme", "Expressiva", "Amável", "Formal"],
  ["Vigorosa", "Calorosa", "Gentil", "Preocupada"],
  ["Ambiciosa", "Reluzente", "Regulada", "Calculista"],
  ["Determinada", "Confiante", "Constante", "Precisa"],
  ["Apressada", "Persuasiva", "Cuidadosa", "Metódica"],
  ["Competitiva", "Política", "Cooperativa", "Diplomática"],
  ["Decidida", "Flexível", "Previsível", "Sistemática"],
  ["Visionária", "Criativa", "Ponderada", "Detalhista"],
  ["Ousada", "Sedutora", "Harmonizadora", "Cautelosa"],
  ["Inquisitiva", "Dada", "Rígida consigo", "Cética"]
];

export const PROFILE_KEYS = ["D", "I", "S", "C"];

export const PROFILE_NAMES = {
  D: "Dominância",
  I: "Influência",
  S: "Estabilidade",
  C: "Conformidade"
};

// VIBRANT HIGH-IMPACT COLORS
export const PROFILE_COLORS = {
  D: "#EF4444", // Vibrant Red / Crimson
  I: "#F59E0B", // Vibrant Amber / Gold
  S: "#10B981", // Vibrant Emerald Green
  C: "#3B82F6"  // Vibrant Sapphire Blue
};

export const PROFILE_GRADIENTS = {
  D: "linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)",
  I: "linear-gradient(135deg, #F59E0B 0%, #B45309 100%)",
  S: "linear-gradient(135deg, #10B981 0%, #047857 100%)",
  C: "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)"
};

export const DISC_BLOCKS = DISC_WORDS.map((words, i) => ({
  id: `d${i}`,
  blockNumber: i + 1,
  adjectives: words.map((text, j) => ({
    text,
    profile: PROFILE_KEYS[j],
    tooltip: TOOLTIPS[text] || null
  }))
}));

export const SITUATIONAL = {
  energia: {
    key: "energia",
    label: "Energia",
    adjectives: [
      { text: "Disposta", cat: "alta" },
      { text: "Cansada", cat: "baixa" },
      { text: "Dinâmica", cat: "alta" },
      { text: "Sonolenta", cat: "baixa" }
    ]
  },
  flexibilidade: {
    key: "flexibilidade",
    label: "Flexibilidade",
    adjectives: [
      { text: "Adaptável", cat: "alta" },
      { text: "Rígida", cat: "baixa" },
      { text: "Flexível", cat: "alta" },
      { text: "Teimosa", cat: "baixa" }
    ]
  },
  positividade: {
    key: "positividade",
    label: "Positividade",
    adjectives: [
      { text: "Otimista", cat: "alta" },
      { text: "Entusiasmada", cat: "alta" },
      { text: "Desanimada", cat: "baixa" },
      { text: "Desesperançosa", cat: "baixa" }
    ]
  },
  moral: {
    key: "moral",
    label: "Moral / Valores",
    adjectives: [
      { text: "Crítico", cat: "baixa" },
      { text: "Leal", cat: "alta" },
      { text: "Responsável", cat: "alta" },
      { text: "Indiferente", cat: "baixa" }
    ]
  },
  aproveitamento: {
    key: "aproveitamento",
    label: "Aproveitamento",
    adjectives: [
      { text: "Eficiente", cat: "alta" },
      { text: "Produtiva", cat: "alta" },
      { text: "Desmotivada", cat: "baixa" },
      { text: "Insegura", cat: "baixa" }
    ]
  },
  resiliencia: {
    key: "resiliencia",
    label: "Resiliência",
    adjectives: [
      { text: "Exausta", cat: "baixa" },
      { text: "Forte", cat: "alta" },
      { text: "Sobrecarregada", cat: "baixa" },
      { text: "Perseverante", cat: "alta" }
    ]
  },
  equipe: {
    key: "equipe",
    label: "Trabalho em Equipe",
    adjectives: [
      { text: "Colaborativa", cat: "alta" },
      { text: "Individualista", cat: "baixa" },
      { text: "Comunicativa", cat: "alta" },
      { text: "Impaciente", cat: "baixa" }
    ]
  }
};

// Exact order of 32 blocks in Round 1 (25 DISC + 7 Situational camouflaged)
export const ROUND1_ORDER = [
  { type: "disc", i: 0 },
  { type: "disc", i: 1 },
  { type: "sit", key: "energia" },
  { type: "disc", i: 2 },
  { type: "disc", i: 3 },
  { type: "sit", key: "flexibilidade" },
  { type: "disc", i: 4 },
  { type: "disc", i: 5 },
  { type: "sit", key: "positividade" },
  { type: "disc", i: 6 },
  { type: "disc", i: 7 },
  { type: "sit", key: "moral" },
  { type: "disc", i: 8 },
  { type: "disc", i: 9 },
  { type: "sit", key: "aproveitamento" },
  { type: "disc", i: 10 },
  { type: "disc", i: 11 },
  { type: "sit", key: "resiliencia" },
  { type: "disc", i: 12 },
  { type: "disc", i: 13 },
  { type: "sit", key: "equipe" },
  { type: "disc", i: 14 },
  { type: "disc", i: 15 },
  { type: "disc", i: 16 },
  { type: "disc", i: 17 },
  { type: "disc", i: 18 },
  { type: "disc", i: 19 },
  { type: "disc", i: 20 },
  { type: "disc", i: 21 },
  { type: "disc", i: 22 },
  { type: "disc", i: 23 },
  { type: "disc", i: 24 }
];

export const ROUND2_ORDER = DISC_WORDS.map((_, i) => ({ type: "disc", i }));

// HR DASHBOARD INITIAL CANDIDATES DATABASE (Inspired by Sólides Profiler)
export const MOCK_HR_CANDIDATES = [
  {
    id: "cand_1",
    name: "Aline Cristina da Silva",
    email: "alinecristina38345@gmail.com",
    company: "Alpha Psicologia LTDA",
    role: "Analista de RH",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    profileBadge: "CE",
    primaryKey: "C",
    secondaryKey: "S",
    sendDate: "11/12/2025",
    answerDate: "11/12/2025",
    status: "Concluído",
    totals1: { D: 12, I: 18, S: 26, C: 34 },
    totals2: { D: 10, I: 16, S: 28, C: 30 }
  },
  {
    id: "cand_2",
    name: "Vanilza Felipe de Paula",
    email: "vanilzapaula225@gmail.com",
    company: "Alpha Psicologia LTDA",
    role: "Coordenadora Operacional",
    avatar: "",
    profileBadge: "EC",
    primaryKey: "S",
    secondaryKey: "C",
    sendDate: "12/01/2026",
    answerDate: "12/01/2026",
    status: "Concluído",
    totals1: { D: 8, I: 14, S: 36, C: 28 },
    totals2: { D: 10, I: 14, S: 34, C: 26 }
  },
  {
    id: "cand_3",
    name: "Abdias Anderson de Oliveira",
    email: "abdiascontabeis@hotmail.com",
    company: "Alpha Psicologia LTDA",
    role: "Contador Sênior",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    profileBadge: "PA",
    primaryKey: "S",
    secondaryKey: "C",
    sendDate: "15/10/2025",
    answerDate: "15/10/2025",
    status: "Concluído",
    totals1: { D: 10, I: 12, S: 32, C: 30 },
    totals2: { D: 12, I: 10, S: 30, C: 32 }
  },
  {
    id: "cand_4",
    name: "Abraão Vitório da Silva",
    email: "abraaovitorio04@gmail.com",
    company: "Alpha Psicologia LTDA",
    role: "Desenvolvedor Full Stack",
    avatar: "",
    profileBadge: "PC",
    primaryKey: "S",
    secondaryKey: "I",
    sendDate: "18/04/2026",
    answerDate: "18/04/2026",
    status: "Concluído",
    totals1: { D: 14, I: 28, S: 30, C: 18 },
    totals2: { D: 16, I: 26, S: 28, C: 18 }
  },
  {
    id: "cand_5",
    name: "Adalberto Alves da Costa",
    email: "secretario.semec@ribeiroodasneves.mg.gov.br",
    company: "Prefeitura Municipal",
    role: "Secretário Executivo",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    profileBadge: "EC",
    primaryKey: "D",
    secondaryKey: "I",
    sendDate: "21/08/2025",
    answerDate: "21/08/2025",
    status: "Concluído",
    totals1: { D: 38, I: 28, S: 14, C: 12 },
    totals2: { D: 34, I: 26, S: 16, C: 14 }
  },
  {
    id: "cand_6",
    name: "Ademir Roberto Neto",
    email: "ademiroberto@hotmail.com",
    company: "Alpha Psicologia LTDA",
    role: "Gerente Comercial",
    avatar: "",
    profileBadge: "CE",
    primaryKey: "I",
    secondaryKey: "D",
    sendDate: "30/10/2025",
    answerDate: "30/10/2025",
    status: "Concluído",
    totals1: { D: 30, I: 36, S: 12, C: 14 },
    totals2: { D: 28, I: 34, S: 14, C: 16 }
  },
  {
    id: "cand_7",
    name: "Adileia Pereira de Souza Miranda",
    email: "adileiapereira62@gmail.com",
    company: "Alpha Psicologia LTDA",
    role: "Consultora Organizacional",
    avatar: "",
    profileBadge: "PAE",
    primaryKey: "S",
    secondaryKey: "C",
    sendDate: "11/12/2025",
    answerDate: "11/12/2025",
    status: "Concluído",
    totals1: { D: 16, I: 18, S: 30, C: 26 },
    totals2: { D: 14, I: 16, S: 32, C: 26 }
  }
];
