/* global window */
// SitePed — schema declarativo de todas as seções dos formulários.
// Cada seção tem: id, title, icon, soap?, fields[]
// Cada campo: { name, label, type, ... }
//   types: text, number, textarea, choices (radio), checks, date, calc

const SCHEMA_FIRST = [
  {
    id: 'identificacao',
    title: 'Identificação',
    icon: 'user',
    fields: [
      { name: 'nome', label: 'Nome da criança', type: 'text', placeholder: 'Nome completo', span: 2 },
      { name: 'dataNasc', label: 'Data de nascimento', type: 'date' },
      { name: 'idade', label: 'Idade (calculada)', type: 'calc', source: 'idade' },
      { name: 'sexo', label: 'Sexo', type: 'choices', options: [
        { v: 'M', l: 'Masculino' }, { v: 'F', l: 'Feminino' }
      ]},
      { name: 'acompanhante', label: 'Acompanhante (nome e parentesco)', type: 'text', placeholder: 'ex: Maria — mãe' },
      { name: 'gnInfo', label: 'Grau de informação do acompanhante', type: 'choices', options: [
        { v: 'bom', l: 'Bom' }, { v: 'regular', l: 'Regular' }, { v: 'limitado', l: 'Limitado' }
      ], span: 2 },
    ],
  },
  {
    id: 'hma',
    title: 'História da Moléstia Atual',
    icon: 'clipboard',
    soap: 'S',
    callout: {
      tone: 'info',
      icon: 'info',
      text: 'Perguntas-chave: queixa principal, início, duração, intensidade, frequência, fatores de melhora/piora, sintomas associados, medicamentos e evolução.',
    },
    fields: [
      { name: 'queixa', label: 'Queixa principal', type: 'text', placeholder: 'ex: febre há 3 dias', span: 2 },
      { name: 'hma', label: 'História da moléstia atual', type: 'textarea', tall: true, placeholder: 'Descreva a HMA em texto corrido, contemplando as perguntas-chave.', span: 2 },
    ],
  },
  {
    id: 'isistemas',
    title: 'Interrogatório dos Sistemas',
    icon: 'list',
    soap: 'S',
    fields: [
      { name: 'isDiurese', label: 'Diurese', type: 'text', placeholder: 'frequência, cor, volume, dor', span: 2 },
      { name: 'isEvacuacoes', label: 'Evacuações', type: 'text', placeholder: 'frequência, consistência, dor, sangue', span: 2 },
      { name: 'isResp', label: 'Respiratórios', type: 'text', placeholder: 'coriza, espirros, obstrução nasal' },
      { name: 'isPele', label: 'Pele', type: 'text', placeholder: 'lesões, prurido, manchas' },
    ],
  },
  {
    id: 'habitos',
    title: 'Hábitos de Vida',
    icon: 'home',
    soap: 'S',
    fields: [
      { name: 'rotina', label: 'Rotina da criança', type: 'textarea', placeholder: 'Descreva a rotina diária.', span: 2 },
      { name: 'escola', label: 'Frequenta escola/creche?', type: 'choices', options: [
        { v: 'sim', l: 'Sim' }, { v: 'nao', l: 'Não' }
      ]},
      { name: 'cuidador', label: 'Quem cuida da criança', type: 'text', placeholder: 'Mãe, avó, creche…' },
      { name: 'tela', label: 'Tempo de tela', type: 'text', placeholder: 'ex: 2h/dia, tablet e TV' },
      { name: 'atividades', label: 'Atividades do dia a dia', type: 'text', placeholder: 'Brincadeiras, tarefas.' },
      { name: 'atvFisica', label: 'Atividade física', type: 'text', placeholder: 'ex: brincadeiras ao ar livre, natação' },
      { name: 'sono', label: 'Sono', type: 'text', placeholder: 'horário, qualidade, despertares, higiene' },
      { name: 'chupeta', label: 'Chupeta', type: 'choices', options: [
        { v: 'sim', l: 'Sim' }, { v: 'nao', l: 'Não' }, { v: 'ex', l: 'Ex-usuário' }
      ]},
      { name: 'mamadeira', label: 'Mamadeira', type: 'choices', options: [
        { v: 'sim', l: 'Sim' }, { v: 'nao', l: 'Não' }, { v: 'ex', l: 'Ex-usuário' }
      ]},
      { name: 'desfralde', label: 'Desfralde', type: 'choices', options: [
        { v: 'comp', l: 'Completo' }, { v: 'parc', l: 'Parcial' }, { v: 'nao', l: 'Não iniciado' }
      ]},
      { name: 'higiene', label: 'Condições de higiene', type: 'text', placeholder: 'Adequadas / descrever' },
      { name: 'escovacao', label: 'Escovação dentária', type: 'text', placeholder: 'ex: 3×/dia com flúor' },
    ],
  },
  {
    id: 'alimentacao',
    title: 'Alimentação',
    icon: 'utensils',
    soap: 'S',
    fields: [
      { name: 'histAlimentar', label: 'História alimentar (AME, fórmula, IA)', type: 'textarea', placeholder: 'Aleitamento materno exclusivo, fórmulas, introdução alimentar, intercorrências.', span: 2 },
      { name: 'recordatorio', label: 'Recordatório alimentar 24h', type: 'textarea', tall: true, placeholder: 'Café da manhã: …\nLanche: …\nAlmoço: …\nLanche da tarde: …\nJantar: …\nCeia: …', span: 2 },
    ],
  },
  {
    id: 'dnpm',
    title: 'Desenvolvimento Neuropsicomotor',
    icon: 'brain',
    soap: 'S',
    fields: [
      { name: 'dnpmPercepcao', label: 'Percepção dos pais sobre o desenvolvimento', type: 'textarea', placeholder: 'Como os pais/acompanhantes avaliam o desenvolvimento.', span: 2 },
      { name: 'dnpmMarcos', label: 'Marcos (motor grosso/fino, linguagem, social)', type: 'textarea', placeholder: 'Marcos atingidos e pendentes para a idade.', span: 2 },
      { name: 'dnpmAprend', label: 'Aprendizado', type: 'text', placeholder: 'Adequado / dificuldades' },
      { name: 'dnpmConc', label: 'Concentração', type: 'text', placeholder: 'Adequada / dispersão' },
      { name: 'dnpmEscola', label: 'Interação na escola', type: 'text', placeholder: 'Socialização, queixas da professora', span: 2 },
    ],
  },
  {
    id: 'gestacao',
    title: 'Gestação e Período Neonatal',
    icon: 'baby',
    soap: 'S',
    callout: {
      tone: 'warn',
      icon: 'info',
      text: 'Solicitar relatório de alta da maternidade, cartão da gestante e cartão da criança.',
    },
    fields: [
      { name: 'gestComo', label: 'Como foi a gestação?', type: 'choices', options: [
        { v: 'sem', l: 'Sem intercorrências' }, { v: 'com', l: 'Com intercorrências' }
      ]},
      { name: 'gestIntercor', label: 'Intercorrências (se houver)', type: 'text', placeholder: 'ex: DHEG, ITU, ameaça de aborto' },
      { name: 'preNatal', label: 'Pré-natal', type: 'choices', options: [
        { v: 'adeq', l: 'Adequado' }, { v: 'inad', l: 'Inadequado' }, { v: 'nao', l: 'Não realizado' }
      ]},
      { name: 'sorologias', label: 'Sorologias maternas', type: 'text', placeholder: 'HIV, sífilis, hep B, toxo, rubéola' },
      { name: 'subsGest', label: 'Uso de álcool/drogas/medicamentos na gestação', type: 'text', placeholder: 'Nega / especificar', span: 2 },
      { name: 'suplGest', label: 'Suplementações na gestação', type: 'text', placeholder: 'Ácido fólico, ferro, vitamina D', span: 2 },
      { name: 'parto', label: 'Tipo de parto', type: 'choices', options: [
        { v: 'normal', l: 'Normal' }, { v: 'ces', l: 'Cesárea' }, { v: 'inst', l: 'Instrumental' }
      ]},
      { name: 'igSemanas', label: 'IG (semanas)', type: 'number', suffix: 'sem', min: 20, max: 45 },
      { name: 'igDias', label: 'IG (dias)', type: 'number', suffix: 'd', min: 0, max: 6 },
      { name: 'pesoNasc', label: 'Peso ao nascer', type: 'number', suffix: 'g', min: 300, max: 6000 },
      { name: 'compNasc', label: 'Comprimento ao nascer', type: 'number', suffix: 'cm', min: 25, max: 60 },
      { name: 'pcNasc', label: 'PC ao nascer', type: 'number', suffix: 'cm', min: 25, max: 45 },
      { name: 'apgar', label: 'Apgar 1’ / 5’', type: 'text', placeholder: 'ex: 8 / 9' },
      { name: 'rnClassif', label: 'Classificação do RN', type: 'calc', source: 'rnClassif', span: 2 },
      { name: 'icterNeo', label: 'Icterícia neonatal', type: 'choices', options: [
        { v: 'nao', l: 'Não' }, { v: 'sem', l: 'Sim, sem fototerapia' }, { v: 'com', l: 'Sim, com fototerapia' }
      ], span: 2 },
      { name: 'triagens', label: 'Triagens neonatais', type: 'checks', options: [
        { v: 'pezinho', l: 'Pezinho' }, { v: 'orelhinha', l: 'Orelhinha' },
        { v: 'olhinho', l: 'Olhinho' }, { v: 'coracaozinho', l: 'Coraçãozinho' },
        { v: 'linguinha', l: 'Linguinha' }
      ], span: 2 },
    ],
  },
  {
    id: 'antPessoais',
    title: 'Antecedentes Pessoais',
    icon: 'folder',
    soap: 'S',
    fields: [
      { name: 'apDoencas', label: 'Doenças prévias', type: 'textarea', placeholder: 'Nega / listar' },
      { name: 'apAlergias', label: 'Alergias', type: 'textarea', placeholder: 'Nega / medicamentos, alimentos, outros' },
      { name: 'apCirurgias', label: 'Cirurgias', type: 'text', placeholder: 'Nega / procedimento e ano' },
      { name: 'apInternacoes', label: 'Internações', type: 'text', placeholder: 'Nega / motivo e duração' },
      { name: 'apMedicacoes', label: 'Uso contínuo de medicamentos', type: 'text', placeholder: 'Nega / nome, dose, indicação', span: 2 },
      { name: 'apVacinas', label: 'Vacinação', type: 'choices', options: [
        { v: 'atrasada', l: 'Atrasada' }, { v: 'atualizada', l: 'Atualizada' }, { v: 'desconhecida', l: 'Cartão indisponível' }
      ], span: 2 },
      { name: 'apVacinaObs', label: 'Observações sobre cartão vacinal', type: 'text', placeholder: 'Doses pendentes, comprovações...', span: 2 },
    ],
  },
  {
    id: 'antFamiliares',
    title: 'Antecedentes Familiares',
    icon: 'family',
    soap: 'S',
    fields: [
      { name: 'afPais', label: 'Doenças nos pais', type: 'textarea', placeholder: 'HAS, DM, asma, cardiopatias…' },
      { name: 'afAvos', label: 'Doenças nos avós', type: 'textarea', placeholder: 'HAS, DM, câncer, cardiopatias…' },
      { name: 'afIrmaos', label: 'Irmãos (idade, saúde)', type: 'text', placeholder: 'ex: irmã 7a saudável · irmão 5a asma', span: 2 },
    ],
  },
  {
    id: 'psicossocial',
    title: 'História Psicossocial',
    icon: 'message',
    soap: 'S',
    fields: [
      { name: 'psEmoc', label: 'Questões emocionais da criança', type: 'textarea', placeholder: 'Ansiedade, medos, alterações de humor' },
      { name: 'psAmb', label: 'Ambiente familiar', type: 'textarea', placeholder: 'Estrutura familiar, conflitos' },
      { name: 'psMoradia', label: 'Condições de moradia', type: 'text', placeholder: 'Casa própria/alugada, saneamento, cômodos' },
      { name: 'psSocio', label: 'Situação socioeconômica', type: 'text', placeholder: 'Renda, benefícios, emprego' },
    ],
  },
  {
    id: 'supervisao',
    title: 'Supervisão de Saúde',
    icon: 'shield',
    soap: 'S',
    fields: [
      { name: 'supOft', label: 'Última consulta com oftalmologista', type: 'text', placeholder: 'Data ou “nunca consultou”' },
      { name: 'supDent', label: 'Última consulta com dentista', type: 'text', placeholder: 'Data ou “nunca consultou”' },
      { name: 'supAudio', label: 'Audiometria', type: 'text', placeholder: 'Data ou “não realizada”' },
      { name: 'supExames', label: 'Últimos exames laboratoriais', type: 'text', placeholder: 'Data e quais exames' },
      { name: 'supObs', label: 'Observações / pendências', type: 'textarea', placeholder: 'Encaminhamentos, condutas, retorno', span: 2 },
    ],
  },
  {
    id: 'exameFisico',
    title: 'Exame Físico e Dados Objetivos',
    icon: 'stethoscope',
    soap: 'O',
    fields: [
      { name: 'peso', label: 'Peso', type: 'number', suffix: 'kg', step: 0.01 },
      { name: 'altura', label: 'Estatura', type: 'number', suffix: 'cm', step: 0.1 },
      { name: 'imc', label: 'IMC (calculado)', type: 'calc', source: 'imc' },
      { name: 'pa', label: 'PA', type: 'text', placeholder: 'ex: 92/58 mmHg' },
      { name: 'fc', label: 'FC', type: 'text', placeholder: 'ex: 102 bpm' },
      { name: 'fr', label: 'FR', type: 'text', placeholder: 'ex: 24 irpm' },
      { name: 'temp', label: 'Temperatura', type: 'text', placeholder: 'ex: 36,7 °C' },
      { name: 'spo2', label: 'SpO₂', type: 'text', placeholder: 'ex: 98% em ar amb.' },
      { name: 'pc', label: 'Perímetro cefálico', type: 'number', suffix: 'cm', step: 0.1 },
      { name: 'zscores', label: 'Z-scores OMS', type: 'calc', source: 'zscores', span: 2 },
      { name: 'exameSegmentar', label: 'Exame físico segmentar', type: 'textarea', tall: true, placeholder: 'Estado geral, hidratação, pele, ORL, ap. respiratório, CV, abdome, neuro…', span: 2 },
    ],
  },
  {
    id: 'avaliacao',
    title: 'Avaliação Diagnóstica',
    icon: 'notebook',
    soap: 'A',
    fields: [
      { name: 'problemas', label: 'Problemas ativos', type: 'textarea', placeholder: 'Liste os problemas clínicos ativos em ordem de prioridade.', span: 2 },
      { name: 'hipoteses', label: 'Hipóteses diagnósticas', type: 'textarea', placeholder: 'Hipótese principal e diferenciais com justificativa breve.', span: 2 },
      { name: 'risco', label: 'Classificação de risco / gravidade', type: 'text', placeholder: 'Estável / necessidade de encaminhamento / sinais de alarme', span: 2 },
    ],
  },
  {
    id: 'plano',
    title: 'Plano Terapêutico e Seguimento',
    icon: 'pill',
    soap: 'P',
    fields: [
      { name: 'examesSolic', label: 'Exames complementares solicitados', type: 'textarea', placeholder: 'Exames, justificativa e prazo.', span: 2 },
      { name: 'conduta', label: 'Conduta terapêutica', type: 'textarea', tall: true, placeholder: 'Medicações (nome, dose, via, intervalo, duração), condutas não-farmacológicas e encaminhamentos.', span: 2 },
      { name: 'orientacoes', label: 'Orientações ao responsável', type: 'textarea', placeholder: 'Cuidado domiciliar, adesão, educação em saúde.' },
      { name: 'retorno', label: 'Retorno e sinais de alarme', type: 'textarea', placeholder: 'Prazo de retorno e sinais para procurar urgência.' },
    ],
  },
];

const SCHEMA_FOLLOW = [
  {
    id: 'identificacao',
    title: 'Identificação',
    icon: 'user',
    fields: [
      { name: 'nome', label: 'Nome da criança', type: 'text', placeholder: 'Nome completo', span: 2 },
      { name: 'dataNasc', label: 'Data de nascimento', type: 'date' },
      { name: 'idade', label: 'Idade (calculada)', type: 'calc', source: 'idade' },
      { name: 'sexo', label: 'Sexo', type: 'choices', options: [
        { v: 'M', l: 'Masculino' }, { v: 'F', l: 'Feminino' }
      ]},
      { name: 'acompanhante', label: 'Acompanhante', type: 'text', placeholder: 'Nome e parentesco' },
    ],
  },
  {
    id: 'evolucao',
    title: 'Evolução desde a última consulta',
    icon: 'history',
    soap: 'S',
    fields: [
      { name: 'queixaAtual', label: 'Queixa atual', type: 'text', placeholder: 'Motivo da consulta de hoje', span: 2 },
      { name: 'evolucao', label: 'Evolução do quadro', type: 'textarea', tall: true, placeholder: 'Resposta a condutas anteriores, intercorrências, exames realizados.', span: 2 },
      { name: 'aderencia', label: 'Aderência ao plano anterior', type: 'choices', options: [
        { v: 'total', l: 'Total' }, { v: 'parcial', l: 'Parcial' }, { v: 'nao', l: 'Não aderência' }
      ], span: 2 },
    ],
  },
  {
    id: 'isistemas',
    title: 'Interrogatório dos Sistemas',
    icon: 'list',
    soap: 'S',
    fields: [
      { name: 'isDiurese', label: 'Diurese', type: 'text', placeholder: 'mudanças relevantes' },
      { name: 'isEvacuacoes', label: 'Evacuações', type: 'text', placeholder: 'mudanças relevantes' },
      { name: 'isResp', label: 'Respiratórios', type: 'text', placeholder: 'sinais e sintomas' },
      { name: 'isPele', label: 'Pele', type: 'text', placeholder: 'lesões, prurido' },
    ],
  },
  {
    id: 'habitos',
    title: 'Hábitos e Alimentação',
    icon: 'home',
    soap: 'S',
    fields: [
      { name: 'sono', label: 'Sono', type: 'text', placeholder: 'mudanças desde a última consulta', span: 2 },
      { name: 'alimentacao', label: 'Alimentação atual', type: 'textarea', placeholder: 'Mudanças no padrão alimentar.', span: 2 },
      { name: 'atvFisica', label: 'Atividade física', type: 'text', placeholder: 'rotina semanal' },
      { name: 'tela', label: 'Tempo de tela', type: 'text', placeholder: 'h/dia' },
    ],
  },
  {
    id: 'dnpm',
    title: 'Desenvolvimento e Aprendizado',
    icon: 'brain',
    soap: 'S',
    fields: [
      { name: 'dnpmMarcos', label: 'Marcos do desenvolvimento', type: 'textarea', placeholder: 'Progresso desde a última avaliação.', span: 2 },
      { name: 'dnpmEscola', label: 'Escola / aprendizado', type: 'text', placeholder: 'Desempenho, queixas, socialização', span: 2 },
    ],
  },
  {
    id: 'medicacoes',
    title: 'Medicações em Uso',
    icon: 'pill',
    soap: 'S',
    fields: [
      { name: 'medsAtuais', label: 'Medicações em uso atualmente', type: 'textarea', tall: true, placeholder: 'Nome, dose, via, intervalo, há quanto tempo, indicação.', span: 2 },
      { name: 'efeitos', label: 'Efeitos adversos relatados', type: 'text', placeholder: 'Nega / descrever', span: 2 },
    ],
  },
  {
    id: 'exameFisico',
    title: 'Exame Físico',
    icon: 'stethoscope',
    soap: 'O',
    fields: [
      { name: 'peso', label: 'Peso', type: 'number', suffix: 'kg', step: 0.01 },
      { name: 'altura', label: 'Estatura', type: 'number', suffix: 'cm', step: 0.1 },
      { name: 'imc', label: 'IMC', type: 'calc', source: 'imc' },
      { name: 'pa', label: 'PA', type: 'text', placeholder: 'ex: 92/58 mmHg' },
      { name: 'fc', label: 'FC', type: 'text', placeholder: 'ex: 102 bpm' },
      { name: 'fr', label: 'FR', type: 'text', placeholder: 'ex: 24 irpm' },
      { name: 'temp', label: 'Temperatura', type: 'text', placeholder: '36,7 °C' },
      { name: 'spo2', label: 'SpO₂', type: 'text', placeholder: '98%' },
      { name: 'pc', label: 'Perímetro cefálico', type: 'number', suffix: 'cm', step: 0.1 },
      { name: 'zscores', label: 'Z-scores OMS', type: 'calc', source: 'zscores', span: 2 },
      { name: 'exameSegmentar', label: 'Exame físico dirigido', type: 'textarea', tall: true, placeholder: 'Estado geral, focos do exame relacionados à queixa atual.', span: 2 },
    ],
  },
  {
    id: 'avaliacao',
    title: 'Avaliação',
    icon: 'notebook',
    soap: 'A',
    fields: [
      { name: 'problemas', label: 'Problemas ativos', type: 'textarea', placeholder: 'Atualize a lista de problemas.', span: 2 },
      { name: 'hipoteses', label: 'Hipóteses / diagnósticos', type: 'textarea', placeholder: 'Hipóteses atuais.', span: 2 },
    ],
  },
  {
    id: 'plano',
    title: 'Plano e Seguimento',
    icon: 'pill',
    soap: 'P',
    fields: [
      { name: 'examesSolic', label: 'Exames complementares', type: 'textarea', placeholder: 'Exames solicitados ou revisados.', span: 2 },
      { name: 'conduta', label: 'Conduta terapêutica', type: 'textarea', tall: true, placeholder: 'Ajustes de medicação, novas prescrições, condutas.', span: 2 },
      { name: 'orientacoes', label: 'Orientações ao responsável', type: 'textarea', placeholder: 'Cuidados, adesão, educação.' },
      { name: 'retorno', label: 'Retorno e sinais de alarme', type: 'textarea', placeholder: 'Prazo de retorno, sinais de urgência.' },
    ],
  },
];

window.SitePedSchema = { SCHEMA_FIRST, SCHEMA_FOLLOW };
