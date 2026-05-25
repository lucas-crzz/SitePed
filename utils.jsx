/* global React */
// SitePed utility functions: idade, IMC, Z-score, classificação RN
// Z-score uses LMS values from WHO Growth Standards (simplified — for student practice, not clinical use).

// === IDADE ===
function calcAgeFromDOB(dobStr) {
  if (!dobStr) return null;
  const dob = new Date(dobStr);
  if (isNaN(dob)) return null;
  const now = new Date();
  if (dob > now) return null;
  const ms = now - dob;
  const days = Math.floor(ms / 86400000);
  let years = now.getFullYear() - dob.getFullYear();
  let months = now.getMonth() - dob.getMonth();
  let dayPart = now.getDate() - dob.getDate();
  if (dayPart < 0) {
    months -= 1;
    const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    dayPart += lastMonth;
  }
  if (months < 0) { years -= 1; months += 12; }
  return { years, months, days, dayPart, totalDays: days, totalMonths: years * 12 + months + dayPart / 30 };
}

function formatAge(age) {
  if (!age) return '—';
  const { years, months, dayPart } = age;
  if (years === 0 && months === 0) return `${age.totalDays} dia${age.totalDays !== 1 ? 's' : ''}`;
  if (years === 0) return `${months} ${months === 1 ? 'mês' : 'meses'}${dayPart ? ` e ${dayPart} d` : ''}`;
  if (years < 2) return `${years}a ${months}m`;
  return `${years} ano${years !== 1 ? 's' : ''}${months ? ` e ${months}m` : ''}`;
}

// === IMC ===
function calcIMC(pesoKg, alturaCm) {
  const p = parseFloat(pesoKg), a = parseFloat(alturaCm);
  if (!p || !a || a < 30) return null;
  const m = a / 100;
  return p / (m * m);
}
function classifyIMCAdult(imc) {
  if (!imc) return null;
  if (imc < 18.5) return { tag: 'Baixo peso', tone: 'warn' };
  if (imc < 25) return { tag: 'Eutrófico', tone: 'ok' };
  if (imc < 30) return { tag: 'Sobrepeso', tone: 'warn' };
  return { tag: 'Obesidade', tone: 'danger' };
}

// === CLASSIFICAÇÃO RN ===
// Idade gestacional + peso ao nascer
function classifyIG(weeks, days = 0) {
  if (!weeks) return null;
  const total = weeks + (days || 0) / 7;
  if (total < 28) return { tag: 'Pré-termo extremo', tone: 'danger' };
  if (total < 32) return { tag: 'Pré-termo muito precoce', tone: 'danger' };
  if (total < 34) return { tag: 'Pré-termo moderado', tone: 'warn' };
  if (total < 37) return { tag: 'Pré-termo tardio', tone: 'warn' };
  if (total < 39) return { tag: 'Termo precoce', tone: 'ok' };
  if (total < 41) return { tag: 'Termo pleno', tone: 'ok' };
  if (total < 42) return { tag: 'Termo tardio', tone: 'ok' };
  return { tag: 'Pós-termo', tone: 'warn' };
}
function classifyPesoNascer(peso) {
  if (!peso) return null;
  if (peso < 1000) return { tag: 'EBPN (<1000g)', tone: 'danger' };
  if (peso < 1500) return { tag: 'MBPN (<1500g)', tone: 'danger' };
  if (peso < 2500) return { tag: 'BPN (<2500g)', tone: 'warn' };
  if (peso < 4000) return { tag: 'Peso adequado', tone: 'ok' };
  return { tag: 'Macrossomia (≥4000g)', tone: 'warn' };
}

// === WHO Z-SCORE (LMS) ===
// Simplified LMS tables — peso/idade, estatura/idade, IMC/idade
// Values approximate WHO standards for months 0, 6, 12, 24, 60, 120
// Source: WHO Growth Standards (interpolated linearly between anchor months)
// For student educational use only.

const WHO = {
  weightForAge: {
    M: [
      [0, 0.3487, 3.3464, 0.14602],
      [3, 0.2113, 6.3762, 0.11939],
      [6, 0.1738, 7.934, 0.11410],
      [12, 0.0402, 9.6479, 0.11055],
      [24, -0.0998, 12.1515, 0.10840],
      [60, -0.7521, 18.3, 0.11320],
      [120, -1.4, 30.8, 0.13],
    ],
    F: [
      [0, 0.3809, 3.2322, 0.14171],
      [3, 0.1736, 5.8458, 0.12619],
      [6, 0.1330, 7.297, 0.12082],
      [12, 0.0233, 8.948, 0.11630],
      [24, -0.1037, 11.464, 0.11354],
      [60, -0.7491, 17.7, 0.12100],
      [120, -1.5, 31.4, 0.14],
    ],
  },
  heightForAge: {
    M: [
      [0, 1, 49.8842, 0.0379],
      [3, 1, 61.4292, 0.0354],
      [6, 1, 67.6236, 0.0345],
      [12, 1, 75.7488, 0.0353],
      [24, 1, 87.8161, 0.0379],
      [60, 1, 110.0, 0.040],
      [120, 1, 138.0, 0.043],
    ],
    F: [
      [0, 1, 49.1477, 0.0379],
      [3, 1, 59.8029, 0.0364],
      [6, 1, 65.7311, 0.0355],
      [12, 1, 74.0, 0.0359],
      [24, 1, 86.4, 0.0381],
      [60, 1, 109.4, 0.041],
      [120, 1, 138.6, 0.044],
    ],
  },
  bmiForAge: {
    M: [
      [0, -0.3053, 13.4069, 0.04],
      [6, -0.4843, 17.2517, 0.0796],
      [12, -0.4849, 16.8923, 0.0807],
      [24, -0.6133, 16.0490, 0.0851],
      [60, -0.7037, 15.3, 0.0863],
      [120, -0.9, 16.0, 0.097],
    ],
    F: [
      [0, -0.0631, 13.3363, 0.0395],
      [6, -0.3068, 16.7728, 0.0795],
      [12, -0.3401, 16.3812, 0.0815],
      [24, -0.4296, 15.7508, 0.0851],
      [60, -0.6422, 15.2, 0.0884],
      [120, -1.0, 16.3, 0.108],
    ],
  },
};

function interpolateLMS(table, ageMonths) {
  if (!table || !table.length) return null;
  if (ageMonths <= table[0][0]) return { L: table[0][1], M: table[0][2], S: table[0][3] };
  if (ageMonths >= table[table.length - 1][0]) {
    const last = table[table.length - 1];
    return { L: last[1], M: last[2], S: last[3] };
  }
  for (let i = 0; i < table.length - 1; i++) {
    const a = table[i], b = table[i + 1];
    if (ageMonths >= a[0] && ageMonths <= b[0]) {
      const t = (ageMonths - a[0]) / (b[0] - a[0]);
      return {
        L: a[1] + t * (b[1] - a[1]),
        M: a[2] + t * (b[2] - a[2]),
        S: a[3] + t * (b[3] - a[3]),
      };
    }
  }
  return null;
}

function zScore(measure, L, M, S) {
  if (L === 0) return Math.log(measure / M) / S;
  return (Math.pow(measure / M, L) - 1) / (L * S);
}

function classifyZ(z, type = 'general') {
  if (z == null || isNaN(z)) return { tag: '—', tone: 'neutral' };
  if (type === 'bmi') {
    if (z < -3) return { tag: 'Magreza acentuada', tone: 'danger' };
    if (z < -2) return { tag: 'Magreza', tone: 'warn' };
    if (z <= 1) return { tag: 'Eutrofia', tone: 'ok' };
    if (z <= 2) return { tag: 'Risco sobrepeso', tone: 'warn' };
    if (z <= 3) return { tag: 'Sobrepeso', tone: 'warn' };
    return { tag: 'Obesidade', tone: 'danger' };
  }
  if (type === 'height') {
    if (z < -3) return { tag: 'Muito baixa', tone: 'danger' };
    if (z < -2) return { tag: 'Baixa estatura', tone: 'warn' };
    if (z <= 2) return { tag: 'Adequada', tone: 'ok' };
    return { tag: 'Estatura elevada', tone: 'warn' };
  }
  // weight-for-age
  if (z < -3) return { tag: 'Muito baixo peso', tone: 'danger' };
  if (z < -2) return { tag: 'Baixo peso', tone: 'warn' };
  if (z <= 2) return { tag: 'Adequado', tone: 'ok' };
  return { tag: 'Peso elevado', tone: 'warn' };
}

function calcZScores({ sexo, ageMonths, pesoKg, alturaCm, imc }) {
  if (!sexo || ageMonths == null) return null;
  const sex = sexo === 'F' ? 'F' : 'M';
  const out = {};
  if (pesoKg) {
    const lms = interpolateLMS(WHO.weightForAge[sex], ageMonths);
    if (lms) out.weight = zScore(pesoKg, lms.L, lms.M, lms.S);
  }
  if (alturaCm) {
    const lms = interpolateLMS(WHO.heightForAge[sex], ageMonths);
    if (lms) out.height = zScore(alturaCm, lms.L, lms.M, lms.S);
  }
  if (imc) {
    const lms = interpolateLMS(WHO.bmiForAge[sex], ageMonths);
    if (lms) out.bmi = zScore(imc, lms.L, lms.M, lms.S);
  }
  return out;
}

function fmtZ(z) {
  if (z == null || isNaN(z)) return '—';
  return (z >= 0 ? '+' : '') + z.toFixed(2);
}

window.SitePedUtils = {
  calcAgeFromDOB, formatAge,
  calcIMC, classifyIMCAdult,
  classifyIG, classifyPesoNascer,
  calcZScores, classifyZ, fmtZ,
};
