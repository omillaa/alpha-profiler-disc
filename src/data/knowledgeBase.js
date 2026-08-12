/* ============================================================
   DISC KNOWLEDGE BASE: PROFILES, COMBINATIONS & SITUATIONALS
   ============================================================ */

export const PRIMARY_PROFILES = {
  D: {
    key: "D",
    name: "Dominância",
    title: "O Orientado a Resultados & Desafios",
    summary: "Pessoas com alta Dominância são orientadas a resultados, diretas, decisivas e motivadas por desafios. Possuem forte iniciativa, assertividade e busca constante por superação de obstáculos.",
    keywords: ["foco em resultados", "assertividade", "autonomia", "coragem", "decisão"],
    characteristics: [
      "Comunicação direta e objetiva, sem rodeios.",
      "Gosto por assumir riscos calculados e liderar iniciativas.",
      "Foco acentuado na solução rápida de problemas.",
      "Inconformismo com o status quo e busca por alta eficiência."
    ],
    strengths: [
      "Tomada de decisão rápida sob pressão.",
      "Visão estratégica focada em metas arrojadas.",
      "Alta capacidade de superação de obstáculos.",
      "Capacidade natural de liderar e direcionar equipes."
    ],
    attentionPoints: [
      "Impaciência com processos lentos ou excesso de detalhes.",
      "Tendência a parecer autoritário ou insensível aos sentimentos alheios.",
      "Dificuldade em delegar controle total de tarefas críticas.",
      "Pode agir de forma precipitada sem ouvir todas as partes."
    ],
    motivations: [
      "Conquistas tangíveis e superação de metas.",
      "Autonomia para tomar decisões e gerenciar recursos.",
      "Desafios complexos que estimulem sua competência.",
      "Oportunidade de liderança e controle operacional."
    ],
    fears: [
      "Perda de controle sobre os processos e decisões.",
      "Sentimento de impotência ou estagnação profissional.",
      "Ser explorado ou ter sua autoridade questionada.",
      "Falta de resultados concretos."
    ],
    actionPlan: [
      "Desenvolver a escuta ativa antes de tomar decisões definitivas.",
      "Praticar a empatia e reconhecer as contribuições individuais da equipe.",
      "Aprender a desacelerar em momentos de planejamento estratégico.",
      "Delegar não apenas tarefas, mas também a autoridade de execução."
    ]
  },
  I: {
    key: "I",
    name: "Influência",
    title: "O Comunicador & Persuasivo",
    summary: "Pessoas com alta Influência são comunicativas, entusiastas, otimistas e orientadas a pessoas. Destacam-se pela capacidade de engajar equipes, construir redes de contatos e vender ideias.",
    keywords: ["comunicação", "entusiasmo", "persuasão", "relacionamento", "otimismo"],
    characteristics: [
      "Facilidade ímpar para conectar pessoas e expressar ideias.",
      "Entusiasmo contagiante e otimismo diante de projetos novos.",
      "Valorização de ambientes colaborativos e dinâmicos.",
      "Grande intuição e foco no fator humano das organizações."
    ],
    strengths: [
      "Excelente capacidade de persuasão e comunicação.",
      "Habilidade em construir e manter relacionamentos interpessoais.",
      "Promotor natural de um ambiente de trabalho motivador.",
      "Alta flexibilidade e apetite por novidades e inovação."
    ],
    attentionPoints: [
      "Tendência a perder o foco com detalhes técnicos e rotinas exaustivas.",
      "Pode se comprometer com prazos irrealistas pelo desejo de agradar.",
      "Dificuldade em lidar com rejeição ou críticas severas.",
      "Superficialidade na análise de dados complexos."
    ],
    motivations: [
      "Reconhecimento público e aprovação social.",
      "Ambiente de trabalho amigável, dinâmico e sem rigidez.",
      "Oportunidades de expressar ideias e influenciar pessoas.",
      "Trabalhar em equipe com interação constante."
    ],
    fears: [
      "Rejeição social ou desaprovação dos pares.",
      "Perda da liberdade de expressão e isolamento.",
      "Ambientes extremamente rígidos, frios ou impessoais.",
      "Rotinas monótonas e burocráticas."
    ],
    actionPlan: [
      "Implementar ferramentas de organização e gestão do tempo (ex: Kanban).",
      "Validar dados e viabilidade técnica antes de assumir novos compromissos.",
      "Desenvolver disciplina na finalização de projetos iniciados.",
      "Aprender a dizer 'não' quando a capacidade operacional estiver no limite."
    ]
  },
  S: {
    key: "S",
    name: "Estabilidade",
    title: "O Planejador Confiável & Colaborativo",
    summary: "Pessoas com alta Estabilidade são calmas, pacientes, leais e focadas em sustentabilidade e harmonia. São excelentes ouvintes, valorizam métodos previsíveis e garantem a coesão das equipes.",
    keywords: ["estabilidade", "paciência", "lealdade", "colaboração", "consistência"],
    characteristics: [
      "Comportamento ponderado, constante e previsível.",
      "Grande habilidade de escuta e mediação pacífica de conflitos.",
      "Foco em processos sequenciais bem definidos e de longo prazo.",
      "Lealdade profunda à equipe e aos valores organizacionais."
    ],
    strengths: [
      "Consistência e alta confiabilidade no cumprimento de rotinas.",
      "Excelente capacidade de trabalho em equipe e suporte mutuo.",
      "Calma e equilíbrio mesmo sob cenários de pressão pontual.",
      "Atenção contínua às necessidades dos colegas e do ambiente."
    ],
    attentionPoints: [
      "Resistência a mudanças repentinas sem aviso prévio.",
      "Dificuldade em expressar discordâncias, acumulando insatisfação.",
      "Ritmo de execução mais cadenciado, podendo parecer lento a perfis ansiosos.",
      "Evitação excessiva de conflitos necessários para o crescimento."
    ],
    motivations: [
      "Ambiente de trabalho seguro, harmonioso e com regras claras.",
      "Reconhecimento sincero e individual por sua dedicação.",
      "Previsibilidade de tarefas e tempo hábil para adaptação.",
      "Sensação de pertencimento a um grupo unido."
    ],
    fears: [
      "Mudanças bruscas, imprevistas ou desorganizadas.",
      "Conflitos diretos e confrontos interpessoais agressivos.",
      "Instabilidade no emprego ou perda de segurança operacional.",
      "Sensação de estar desamparado."
    ],
    actionPlan: [
      "Exercitar a adaptabilidade voluntária a pequenos canais de mudança.",
      "Posicionar-se verbalmente com firmeza quando discordar de uma direção.",
      "Estabelecer limites claros para evitar sobrecarga por excesso de ajuda aos outros.",
      "Focar no desenvolvimento de maior agilidade em tomadas de decisão."
    ]
  },
  C: {
    key: "C",
    name: "Conformidade",
    title: "O Analista Estratégico & Meticuloso",
    summary: "Pessoas com alta Conformidade são analíticas, disciplinadas, exatas e pautadas pela qualidade e rigor metodológico. Valorizam padrões elevados, dados concretos e precisão técnica.",
    keywords: ["precisão", "qualidade", "análise", "disciplina", "normas"],
    characteristics: [
      "Abordagem lógica, empírica e altamente racional.",
      "Atenção minuciosa aos detalhes e aos padrões de qualidade.",
      "Preferência por trabalhar com procedimentos claros e documentados.",
      "Postura reservada, profissional e ética."
    ],
    strengths: [
      "Alta precisão técnica e rigor no controle de qualidade.",
      "Capacidade profunda de investigação e análise de dados complexos.",
      "Organização impecável e cumprimento rígido de normas.",
      "Prevenção eficaz de riscos e falhas em projetos estratégicos."
    ],
    attentionPoints: [
      "Tendência ao perfeccionismo paralensante (paralisia por análise).",
      "Pode se mostrar excessivamente crítico com falhas alheias.",
      "Dificuldade em aceitar métodos não convencionais ou informais.",
      "Postura defensiva quando seu trabalho é questionado."
    ],
    motivations: [
      "Padrões claros de qualidade e critérios de avaliação objetivos.",
      "Autonomia para realizar análises aprofundadas sem pressões indevidas.",
      "Ambiente estruturado, organizado e pautado pelo respeito às normas.",
      "Reconhecimento pela sua expertise técnica e exatidão."
    ],
    fears: [
      "Cometer erros técnicos ou entregar trabalhos com imperfeições.",
      "Críticas públicas ao seu nível de competência ou rigor.",
      "Ambiguidade de papéis e falta de critérios claros.",
      "Desorganização e decisões baseadas apenas em intuição."
    ],
    actionPlan: [
      "Praticar o conceito do 'suficientemente bom' para evitar paralisias por perfeccionismo.",
      "Desenvolver flexibilidade e tolerância com estilos de trabalho informais.",
      "Compartilhar análises de forma síntética para facilitar a decisão de executivos.",
      "Aprender a aceitar feedbacks sem interpretá-los como ataques à sua capacidade."
    ]
  }
};

export const COMBINATIONS = {
  "D-I": {
    name: "O Visionário Influente",
    keywords: "ousadia, carisma, iniciativa, energia, persuasão",
    description: "Combina a determinação implacável da Dominância com o dinamismo contagiante da Influência. É um perfil focado em liderança expansiva, capaz de propor metas arrojadas e engajar pessoas para alcançá-las com entusiasmo.",
    strengths: [
      "Alta capacidade de inspirar e mobilizar grandes grupos.",
      "Orientação veloz para resultados combinada com forte comunicação.",
      "Coragem para inovar e desbravar novos mercados ou abordagens."
    ],
    attentionPoints: [
      "Risco de impulsividade e subestimação dos custos operacionais.",
      "Pode focar excessivamente na visão macro e negligenciar detalhes de execução.",
      "Tendência a dominar conversas e impor o ritmo à equipe."
    ],
    actionPlan: [
      "Conectar-se a parceiros analíticos (C ou S) para validar a viabilidade de suas propostas.",
      "Desenvolver disciplina no acompanhamento dos indicadores de longo prazo."
    ]
  },
  "D-S": {
    name: "O Executor Estável",
    keywords: "foco, consistência, pragmatismo, disciplina",
    description: "Equilibra a orientação a resultados (D) com a tenacidade e persistência (S). É um perfil altamente resolutivo, que inicia projetos com força e mantém o ritmo até a entrega final sem perder o controle.",
    strengths: [
      "Grande capacidade de entrega contínua com perseverança.",
      "Foco prático em resolver problemas de forma sustentável.",
      "Liderança firme, porém acessível e protetora de sua equipe."
    ],
    attentionPoints: [
      "Pode se mostrar teimoso diante de mudanças na direção estratégica.",
      "Resistência em abandonar métodos antigos que já trouxeram resultados no passado.",
      "Acúmulo de tarefas por confiar apenas no próprio padrão de trabalho."
    ],
    actionPlan: [
      "Praticar a flexibilidade diante de pivôs estratégicos da empresa.",
      "Construir processos de delegação estruturados."
    ]
  },
  "D-C": {
    name: "O Estrategista Analítico",
    keywords: "precisão, lógica, objetividade, estratégia",
    description: "Une a busca por resultados rápidos da Dominância com a precisão exigente da Conformidade. Produz planos estratégicos de altíssima eficiência, sem margem para amadorismo.",
    strengths: [
      "Raciocínio lógico aguçado voltado para eficiência operacional.",
      "Decisões fundamentadas em fatos duros com foco em metas.",
      "Altíssimo padrão de exigência e controle de riscos."
    ],
    attentionPoints: [
      "Pode parecer frio, distante ou excessivamente crítico com as pessoas.",
      "Baixa tolerância a falhas humanas ou atrasos pontuais.",
      "Dificuldade em lidar com informalidade no ambiente de trabalho."
    ],
    actionPlan: [
      "Desenvolver habilidades interpessoais de empatia e escuta ativa.",
      "Equilibrar a cobrança por resultados com o incentivo e o elogio público."
    ]
  },
  "I-D": {
    name: "O Comunicador Assertivo",
    keywords: "ousadia, entusiasmo, convicção, presença",
    description: "Combina o charme e a capacidade de conexão da Influência com a objetividade focada da Dominância. É um comunicador nato que não apenas encanta, mas fecha acordos e direciona ações de impacto.",
    strengths: [
      "Alta capacidade de negociação e fechamento de novos negócios.",
      "Presença marcante em apresentações e reuniões estratégicas.",
      "Energia contagiante com foco em superar expectativas."
    ],
    attentionPoints: [
      "Pode agir por impulso em momento de entusiasmo emocional.",
      "Dificuldade em seguir regras burocráticas rigorosas.",
      "Risco de prometer mais do que o time de entrega consegue cumprir."
    ],
    actionPlan: [
      "Formalizar por escrito os acordos verbais antes da execução.",
      "Consultar o time operacional antes de definir prazos com clientes ou liderados."
    ]
  },
  "I-S": {
    name: "O Conector Acolhedor",
    keywords: "empatia, suporte, proximidade, diplomacia",
    description: "Sinergia entre o carisma da Influência e a paciência da Estabilidade. É o harmonizador por excelência, focado em construir ambientes psicologicamente seguros e equipes extremamente unidas.",
    strengths: [
      "Excelente facilidade em escutar e mediar conflitos interpessoais.",
      "Construção de relacionamentos profundos e duradouros.",
      "Clima de trabalho extremamente positivo e acolhedor."
    ],
    attentionPoints: [
      "Dificuldade severa para aplicar feedbacks corretivos duros.",
      "Evitação do confronto mesmo quando decisões duras são necessárias.",
      "Pode colocar o bem-estar imediato acima das metas operacionais urgentíssimas."
    ],
    actionPlan: [
      "Treinar a assertividade amorosa: corrigir o processo mantendo o respeito à pessoa.",
      "Definir métricas de desempenho claras e neutras para acompanhar entregas."
    ]
  },
  "I-C": {
    name: "O Comunicador Analítico",
    keywords: "criatividade, lógica, precisão, ideias fundamentadas",
    description: "Junta o entusiasmo expressivo da Influência com a fundamentação rigorosa da Conformidade. Apresenta ideias criativas embasadas em dados sólidos, sendo altamente convincente.",
    strengths: [
      "Articulação impecável de conceitos complexos para públicos leigos.",
      "Criatividade técnica: propõe soluções inovadoras e bem estruturadas.",
      "Capacidade de encantar sem perder a profundidade dos fatos."
    ],
    attentionPoints: [
      "Oscilação interna entre o desejo de agir rápido e a necessidade de analisar mais.",
      "Pode se estressar quando sob forte pressão por prazos apertados.",
      "Perfeccionismo na comunicação que pode atrasar o lançamento de projetos."
    ],
    actionPlan: [
      "Estabelecer prazos de término (deadlines) inegociáveis para a fase de idealização.",
      "Lançar versões mínimas viáveis (MVP) para testar em ambiente real."
    ]
  },
  "S-D": {
    name: "O Estruturador Determinado",
    keywords: "estabilidade, foco, persistência, resiliência",
    description: "Combina a sustentabilidade da Estabilidade com a força resolutiva da Dominância. É o pilar da equipe: calmo sob pressão, mas focado inabalavelmente em concluir objetivos estratégicos.",
    strengths: [
      "Resiliência impressionante em projetos de longa duração.",
      "Execução consistente e firmeza sem alarde ou arrogância.",
      "Capacidade de proteger a equipe garantindo entregas de excelência."
    ],
    attentionPoints: [
      "Pode ser excessivamente reservado quanto a suas próprias opiniões.",
      "Resistência velada a mudanças impostas do dia para a noite.",
      "Acúmulo de tensão emocional por não externalizar frustrações imediatamente."
    ],
    actionPlan: [
      "Praticar a comunicação transparente e imediata de incômodos ou gargalos.",
      "Aceitar inovações que simplifiquem a rotina já estabelecida."
    ]
  },
  "S-I": {
    name: "O Acolhedor Comunicativo",
    keywords: "gentileza, paciência, empatia, espírito de equipe",
    description: "Integra o caráter constante da Estabilidade com a simpatia da Influência. Um perfil que gera confiança imediata, promovendo o envolvimento de todos e garantindo estabilidade emocional.",
    strengths: [
      "Ambiente interpessoal caracterizado por forte confiança e empatia.",
      "Comunicação afetuosa, paciente e orientada ao desenvolvimento alheio.",
      "Excelente desempenho no atendimento, RH e gestão de pessoas."
    ],
    attentionPoints: [
      "Dificuldade em impor prazos rígidos ou exigir urgência.",
      "Tendência a assumir obrigações dos outros para não gerar constrangimento.",
      "Medo acentuado da rejeição ou do clima de tensão na equipe."
    ],
    actionPlan: [
      "Desenvolver foco na gestão de prazos e cumprimento de KPIs.",
      "Estabelecer limites claros de atuação para evitar a sobrecarga pessoal."
    ]
  },
  "S-C": {
    name: "O Executor Metódico",
    keywords: "precisão, constância, confiabilidade, organização",
    description: "Combinação clássica de Estabilidade e Conformidade. Trata-se do perfil mais confiável no planejamento e acompanhamento minucioso de processos e normas de qualidade.",
    strengths: [
      "Padrão de qualidade impecável em todas as entregas.",
      "Lealdade, ética profissional e respeito absoluto às regras.",
      "Organização minuciosa e planejamento de longo alcance."
    ],
    attentionPoints: [
      "Forte resistência ao improviso ou a cenários caóticos.",
      "Dificuldade para tomar decisões sem ter 100% das informações necessárias.",
      "Postura defensiva diante de mudanças organizacionais súbitas."
    ],
    actionPlan: [
      "Desenvolver tolerância ao risco e à incerteza em mercados voláteis.",
      "Treinar a tomada de decisão com dados parciais (ex: regra dos 70%)."
    ]
  },
  "C-D": {
    name: "O Analista Executor",
    keywords: "precisão, estratégia, produtividade, controle",
    description: "Une a busca pela perfeição técnica (C) com a urgência resolutiva da Dominância (D). Cria sistemas extremamente eficientes e exige que sejam cumpridos com o máximo rigor.",
    strengths: [
      "Incorruptível padrão de qualidade associado a alta produtividade.",
      "Capacidade de mapear falhas complexas e corrigi-las na raiz.",
      "Excelente desempenho no comando de engenharia, finanças ou compliance."
    ],
    attentionPoints: [
      "Nível de exigência extremamente alto que pode esgotar a equipe.",
      "Dificuldade em lidar com a subjetividade e as emoções humanas.",
      "Comunicação direta que pode ressoar como dura ou punitiva."
    ],
    actionPlan: [
      "Complementar a exigência de excelência com investimento na gestão de pessoas.",
      "Reconhecer o esforço e a evolução dos colaboradores, não apenas a perfeição final."
    ]
  },
  "C-I": {
    name: "O Comunicador Lógico",
    keywords: "clareza, inteligência, organização criativa, método com síntese",
    description: "Combina a análise detalhada da Conformidade com a facilidade expositiva da Influência. Capaz de estruturar projetos complexos e explicá-los de forma clara e envolvente.",
    strengths: [
      "Clareza didática excepcional para expor dados estatísticos e técnicos.",
      "Combinação de criatividade com fundamentação analítica.",
      "Capacidade de estruturar auditorias ou processos e engajar o time na adoção."
    ],
    attentionPoints: [
      "Tensão interna entre a espontaneidade interpessoal e a autocrítica excessiva.",
      "Pode despender muito tempo aperfeiçoando a estética de relatórios e relatórios.",
      "Sensibilidade a críticas sobre o conteúdo do seu trabalho."
    ],
    actionPlan: [
      "Focar no essencial e reduzir a revisão excessiva de detalhes secundários.",
      "Valorizar a velocidade de resposta sem comprometer o núcleo da qualidade."
    ]
  },
  "C-S": {
    name: "O Planejador Meticuloso",
    keywords: "cuidado, prudência, estabilidade, qualidade, paciência",
    description: "Une o rigor técnico da Conformidade à paciência da Estabilidade. É o defensor dos padrões de excelência e da manutenção da ordem funcional de longo prazo.",
    strengths: [
      "Profundo senso de responsabilidade e respeito às normas de segurança.",
      "Consistência inabalável no monitoramento contínuo de fluxos.",
      "Excelente capacidade de documentação, arquivos e memória organizacional."
    ],
    attentionPoints: [
      "Burocracia excessiva e lentidão em processos que exigem agilidade extrema.",
      "Tendência a ser excessivamente cauteloso diante de novas oportunidades.",
      "Relutância em sair da zona de conforto."
    ],
    actionPlan: [
      "Desafiar-se a experimentar novas tecnologias e metodologias agilistas.",
      "Focar no ritmo das entregas e no valor percebido pelo cliente final."
    ]
  }
};

export const SITUATIONAL_INTERPRETATIONS = {
  energia: {
    high: "Sua energia situacional encontra-se elevada (+2 a +4). Você demonstra disposição, vitalidade e prontidão para agir com dinamismo nas demandas atuais.",
    moderate: "Sua energia está equilibrada (-1 a +1). Você consegue responder às demandas diárias, mantendo uma taxa de disposição constante sem grandes oscilações.",
    low: "Sua energia apresenta sinais de rebaixamento (-2 a -4). Indica sensação de cansaço ou desgaste situacional, sugerindo necessidade de desaceleração ou recomposição física/mental."
  },
  flexibilidade: {
    high: "Sua flexibilidade situacional está alta (+2 a +4). Você demonstra grande adaptabilidade, abertura para contornar imprevistos e facilidade de ajuste a novas diretrizes.",
    moderate: "Sua flexibilidade está em nível intermediário (-1 a +1). Você aceita mudanças quando bem justificadas, mantendo certa ancoragem em rotinas conhecidas.",
    low: "Sua flexibilidade encontra-se reduzida (-2 a -4). Sinaliza postura mais rígida ou defensiva diante de alterações no ambiente, com preferência por manter o planejado."
  },
  positividade: {
    high: "Seu índice de positividade situa-se elevado (+2 a +4). Você encara os cenários presentes com entusiasmo, otimismo e confiança na superação de metas.",
    moderate: "Sua positividade está neutra/equilibrada (-1 a +1). Você mantém uma visão realista e objetiva, ponderando prós e contras sem ufanismo ou pessimismo.",
    low: "Sua positividade indica estado de desânimo situacional (-2 a -4). Pode refletir frustração pontual com resultados recentes ou clima de incerteza no ambiente."
  },
  moral: {
    high: "Seu indicador de moral e valores apresenta alta pontuação (+2 a +4). Reflete forte engajamento ético, lealdade e elevado alinhamento com a responsabilidade profissional.",
    moderate: "Sua moral/valores está equilibrada (-1 a +1). Demonstra atitude profissional correta e pragmática na condução das obrigações do cargo.",
    low: "Seu indicador indica postura crítica ou distanciamento situacional (-2 a -4). Pode sinalizar questionamentos profundos em relação a decisões da liderança ou desconexão com valores."
  },
  aproveitamento: {
    high: "Seu aproveitamento e foco produtivo estão no topo (+2 a +4). Você se sente extremamente eficiente, produtivo e capaz de gerar valor nas entregas atuais.",
    moderate: "Seu aproveitamento produtivo está estável (-1 a +1). O fluxo de trabalho atende às expectativas de forma regular e funcional.",
    low: "Seu aproveitamento apresenta retração situacional (-2 a -4). Indica sentimento de desmotivação ou insegurança quanto à eficácia dos seus esforços atuais."
  },
  resiliencia: {
    high: "Sua resiliência situacional é robusta (+2 a +4). Você se percebe forte, perseverante e capaz de suportar pressões intensas mantendo a integridade operacional.",
    moderate: "Sua resiliência está em patamar satisfatório (-1 a +1). Suporta momentos de estresse cotidiano buscando pontos de sustentação na equipe.",
    low: "Sua resiliência indica sensação de sobrecarga ou exaustão (-2 a -4). Alerta para a urgência de redimensionar volume de trabalho ou buscar suporte emocional/operacional."
  },
  equipe: {
    high: "Seu indicador de trabalho em equipe é muito elevado (+2 a +4). Demonstra postura altamente colaborativa, comunicativa e motivada pela construção coletiva.",
    moderate: "Sua atuação em equipe está equilibrada (-1 a +1). Alterna entre momentos de cooperação conjunta e momentos de foco individual conforme o projeto exija.",
    low: "Seu indicador aponta preferência situacional por trabalho individualista ou impaciência com terceiros (-2 a -4). Sugere ruídos de comunicação ou desejo de maior autonomia."
  }
};
