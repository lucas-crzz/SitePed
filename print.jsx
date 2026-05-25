/* global React, SitePedUtils */
// SitePed — SOAP plain-text generator and print view component.

function fmtChoice(field, value) {
  if (!value) return '';
  if (Array.isArray(value)) {
    const labels = value.map(v => field.options?.find(o => o.v === v)?.l || v);
    return labels.join(', ');
  }
  return field.options?.find(o => o.v === value)?.l || value;
}

function getFieldText(field, value, form) {
  if (field.type === 'calc') {
    if (field.source === 'idade') {
      const a = SitePedUtils.calcAgeFromDOB(form.dataNasc);
      return a ? SitePedUtils.formatAge(a) : '';
    }
    if (field.source === 'imc') {
      const i = SitePedUtils.calcIMC(form.peso, form.altura);
      return i ? `${i.toFixed(2)} kg/m²` : '';
    }
    if (field.source === 'rnClassif') {
      const ig = SitePedUtils.classifyIG(parseFloat(form.igSemanas), parseFloat(form.igDias));
      const p  = SitePedUtils.classifyPesoNascer(parseFloat(form.pesoNasc));
      if (!ig && !p) return '';
      return [ig?.tag, p?.tag].filter(Boolean).join(' · ');
    }
    if (field.source === 'zscores') {
      const age = SitePedUtils.calcAgeFromDOB(form.dataNasc);
      if (!age || !form.sexo) return '';
      const i = SitePedUtils.calcIMC(form.peso, form.altura);
      const z = SitePedUtils.calcZScores({
        sexo: form.sexo, ageMonths: age.totalMonths,
        pesoKg: parseFloat(form.peso), alturaCm: parseFloat(form.altura), imc: i,
      });
      if (!z) return '';
      const parts = [];
      if (z.weight != null) parts.push(`P/I ${SitePedUtils.fmtZ(z.weight)}`);
      if (z.height != null) parts.push(`E/I ${SitePedUtils.fmtZ(z.height)}`);
      if (z.bmi != null)    parts.push(`IMC/I ${SitePedUtils.fmtZ(z.bmi)}`);
      return parts.join(' · ');
    }
    return '';
  }
  if (field.type === 'choices') return fmtChoice(field, value);
  if (field.type === 'checks')  return fmtChoice(field, value);
  if (field.type === 'number' && value && field.suffix) return `${value} ${field.suffix}`;
  return value || '';
}

// Build SOAP grouping
const SOAP_HEADERS = {
  S: 'Subjetivo',
  O: 'Objetivo',
  A: 'Avaliação',
  P: 'Plano',
};

function buildSOAP(schema, form) {
  // Identificação isolated
  const idSection = schema.find(s => s.id === 'identificacao');
  const soapGroups = { S: [], O: [], A: [], P: [] };

  for (const sec of schema) {
    if (sec.id === 'identificacao') continue;
    const tag = sec.soap || 'S';
    const sectionEntry = { title: sec.title, items: [] };
    for (const f of sec.fields) {
      const txt = getFieldText(f, form[f.name], form);
      if (txt && String(txt).trim()) {
        sectionEntry.items.push({ label: f.label, value: String(txt).trim() });
      }
    }
    if (sectionEntry.items.length) soapGroups[tag].push(sectionEntry);
  }

  return { idSection, soapGroups };
}

function toPlainText({ schema, form, meta }) {
  const { idSection, soapGroups } = buildSOAP(schema, form);
  const lines = [];

  lines.push('=== PRONTUÁRIO PEDIÁTRICO ===');
  if (meta.dataConsulta) lines.push(`Data da consulta: ${meta.dataConsulta}`);
  if (meta.academico)    lines.push(`Acadêmico: ${meta.academico}`);
  if (meta.prontuario)   lines.push(`Prontuário nº ${meta.prontuario}`);
  lines.push('');

  if (idSection) {
    lines.push('-- IDENTIFICAÇÃO --');
    for (const f of idSection.fields) {
      const t = getFieldText(f, form[f.name], form);
      if (t) lines.push(`${f.label}: ${t}`);
    }
    lines.push('');
  }

  for (const tag of ['S', 'O', 'A', 'P']) {
    const group = soapGroups[tag];
    if (!group.length) continue;
    lines.push(`== ${tag} — ${SOAP_HEADERS[tag].toUpperCase()} ==`);
    for (const sec of group) {
      lines.push(`> ${sec.title}`);
      for (const it of sec.items) {
        lines.push(`  · ${it.label}: ${it.value}`);
      }
      lines.push('');
    }
  }

  return lines.join('\n').trim();
}

function PrintView({ schema, form, meta }) {
  const { idSection, soapGroups } = buildSOAP(schema, form);
  const idFields = idSection ? idSection.fields.map(f => ({ f, t: getFieldText(f, form[f.name], form) })).filter(x => x.t) : [];

  return (
    <div className="print-view">
      <div className="print-head">
        <h1>Prontuário pediátrico</h1>
        <div className="print-sub">SitePed · estrutura SOAP</div>
        <div className="print-meta">
          <div><strong>Data:</strong> {meta.dataConsulta || '—'}</div>
          <div><strong>Acadêmico:</strong> {meta.academico || '—'}</div>
          <div><strong>Prontuário nº:</strong> {meta.prontuario || '—'}</div>
        </div>
      </div>

      {idFields.length > 0 && (
        <div className="print-section">
          <h2>Identificação</h2>
          {idFields.map(({ f, t }) => (
            <div className="print-row" key={f.name}>
              <span className="key">{f.label}:</span> {t}
            </div>
          ))}
        </div>
      )}

      {['S', 'O', 'A', 'P'].map((tag) => {
        const group = soapGroups[tag];
        if (!group.length) return null;
        return (
          <div className="print-section" key={tag}>
            <h2>{tag} — {SOAP_HEADERS[tag]}</h2>
            {group.map((sec, i) => (
              <div key={i} style={{ marginBottom: 6 }}>
                <div style={{ fontWeight: 600, fontSize: 11.5, marginTop: 6, marginBottom: 2 }}>{sec.title}</div>
                {sec.items.map((it, j) => (
                  <div className="print-row" key={j}>
                    <span className="key">{it.label}:</span> {it.value}
                  </div>
                ))}
              </div>
            ))}
          </div>
        );
      })}

      {Object.values(soapGroups).every(g => g.length === 0) && idFields.length === 0 && (
        <div className="print-empty" style={{ textAlign: 'center', padding: 32 }}>Prontuário vazio.</div>
      )}
    </div>
  );
}

window.SitePedPrint = { PrintView, toPlainText, buildSOAP };
