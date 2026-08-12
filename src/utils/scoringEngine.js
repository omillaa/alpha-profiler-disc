/* ============================================================
   DISC SCORING & DIAGNOSTIC CALCULATION ENGINE
   ============================================================ */

import { DISC_BLOCKS, SITUATIONAL, ROUND1_ORDER, ROUND2_ORDER, PROFILE_KEYS } from "../data/discData.js";
import { PRIMARY_PROFILES, COMBINATIONS, SITUATIONAL_INTERPRETATIONS } from "../data/knowledgeBase.js";

/**
 * Calculates complete assessment results from raw responses of Round 1 and Round 2.
 * @param {Object} r1 - Round 1 responses keyed by `d0`..`d24` and `s_energia`..
 * @param {Object} r2 - Round 2 responses keyed by `d0`..`d24`
 * @param {Object} userInfo - { name, company, role, date }
 */
export function calculateAssessmentResults(r1, r2, userInfo = {}) {
  // 1. Calculate Round 1 (Self-Perception) totals
  const totals1 = { D: 0, I: 0, S: 0, C: 0 };
  ROUND1_ORDER.filter((it) => it.type === "disc").forEach((it) => {
    const key = `d${it.i}`;
    const ans = r1[key];
    if (!ans) return;
    const adjs = DISC_BLOCKS[it.i].adjectives;
    if (ans.mais !== undefined) {
      totals1[adjs[ans.mais].profile] += 2;
    }
    if (ans.menos !== undefined) {
      totals1[adjs[ans.menos].profile] -= 1;
    }
  });

  // 2. Calculate Round 2 (External Perception) totals
  const totals2 = { D: 0, I: 0, S: 0, C: 0 };
  ROUND2_ORDER.forEach((it) => {
    const key = `d${it.i}`;
    const ans = r2[key];
    if (!ans) return;
    const adjs = DISC_BLOCKS[it.i].adjectives;
    if (ans.mais !== undefined) {
      totals2[adjs[ans.mais].profile] += 2;
    }
    if (ans.menos !== undefined) {
      totals2[adjs[ans.menos].profile] -= 1;
    }
  });

  // 3. Perception Gap Analysis
  const gap = {};
  PROFILE_KEYS.forEach((p) => {
    gap[p] = totals1[p] - totals2[p];
  });

  // 4. Primary and Secondary Profiles Determination
  const sortedProfiles = [...PROFILE_KEYS].sort((a, b) => totals1[b] - totals1[a]);
  const primaryKey = sortedProfiles[0];
  const secondaryKey = sortedProfiles[1];

  const primaryProfile = PRIMARY_PROFILES[primaryKey];
  const secondaryProfile = PRIMARY_PROFILES[secondaryKey];

  const comboKey = `${primaryKey}-${secondaryKey}`;
  const combination = COMBINATIONS[comboKey] || {
    name: `${primaryProfile.name} / ${secondaryProfile.name}`,
    keywords: `${primaryProfile.keywords.slice(0, 2).join(", ")}, ${secondaryProfile.keywords.slice(0, 2).join(", ")}`,
    description: `Combinação marcante de ${primaryProfile.name} com nuances de ${secondaryProfile.name}.`,
    strengths: [...primaryProfile.strengths.slice(0, 2), ...secondaryProfile.strengths.slice(0, 1)],
    attentionPoints: [...primaryProfile.attentionPoints.slice(0, 2), ...secondaryProfile.attentionPoints.slice(0, 1)],
    actionPlan: [...primaryProfile.actionPlan.slice(0, 2)]
  };

  // 5. Situational Indicators Calculation
  const situational = {};
  Object.entries(SITUATIONAL).forEach(([key, block]) => {
    const ans = r1[`s_${key}`];
    let score = 0;
    if (ans) {
      if (ans.mais !== undefined) {
        score += block.adjectives[ans.mais].cat === "alta" ? 2 : -2;
      }
      if (ans.menos !== undefined) {
        score += block.adjectives[ans.menos].cat === "alta" ? -1 : 1;
      }
    }

    const interpCategory = score >= 2 ? "high" : score <= -2 ? "low" : "moderate";
    const interpretationText = SITUATIONAL_INTERPRETATIONS[key]?.[interpCategory] || "";

    situational[key] = {
      key,
      label: block.label,
      score,
      interpCategory,
      interpretationText
    };
  });

  // 6. Integrated Action Plan Matrix
  const integratedPlan = {
    shortTerm: [
      `Focar na principal fortaleza do perfil ${primaryProfile.name}: ${primaryProfile.strengths[0]}`,
      `Trabalhar o ponto de atenção urgente de ${primaryProfile.name}: ${primaryProfile.attentionPoints[0]}`,
      situational.energia.score < 0
        ? "Reorganizar rotina imediata para restaurar energia situacional."
        : "Aproveitar momento de alta energia para alavancar metas pendentes."
    ],
    mediumTerm: [
      `Desenvolver competências do perfil secundário (${secondaryProfile.name}): ${secondaryProfile.strengths[0]}`,
      `Implementar recomendações do perfil combinado (${combination.name}): ${combination.actionPlan[0] || 'Alinhar processos com pares'}`
    ],
    longTerm: [
      `Consolidar plano de carreira e liderança pautado na mitigação dos medos de ${primaryProfile.name}: ${primaryProfile.fears[0]}`,
      "Manter monitoramento trimestral do gap de percepção externa para mitigar estresse ocupacional."
    ]
  };

  return {
    userInfo: {
      name: userInfo.name || "Respondente",
      company: userInfo.company || "Empresa",
      role: userInfo.role || "Colaborador",
      date: userInfo.date || new Date().toLocaleDateString("pt-BR")
    },
    totals1,
    totals2,
    gap,
    primaryKey,
    secondaryKey,
    primaryProfile,
    secondaryProfile,
    combination,
    situational,
    integratedPlan
  };
}
