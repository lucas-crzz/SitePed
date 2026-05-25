/* global React, Icon, SitePedUtils */
// Form field renderer — renders a single field based on schema.

const { useMemo, useState, useCallback } = React;

// ===== ATOM: text input
function FieldText({ field, value, onChange, type = 'text' }) {
  const hasValue = value && String(value).trim().length > 0;
  return (
    <div className="input-wrap">
      <input
        type={type}
        className={`input ${hasValue ? 'has-value' : ''} ${field.suffix ? 'unit-suffix' : ''}`}
        placeholder={field.placeholder || ''}
        value={value ?? ''}
        step={field.step}
        min={field.min}
        max={field.max}
        onChange={(e) => onChange(e.target.value)}
      />
      {field.suffix && <span className="suffix">{field.suffix}</span>}
    </div>
  );
}

// ===== ATOM: textarea
function FieldTextarea({ field, value, onChange }) {
  const hasValue = value && String(value).trim().length > 0;
  return (
    <textarea
      className={`textarea ${hasValue ? 'has-value' : ''} ${field.tall ? 'tall' : ''}`}
      placeholder={field.placeholder || ''}
      value={value ?? ''}
      rows={field.tall ? 5 : 3}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

// ===== ATOM: choices (radio pills)
function FieldChoices({ field, value, onChange }) {
  return (
    <div className="choices" role="radiogroup">
      {field.options.map((opt) => {
        const checked = value === opt.v;
        return (
          <label key={opt.v} className={`choice ${checked ? 'checked' : ''}`}>
            <input type="radio" checked={checked} onChange={() => onChange(checked ? null : opt.v)} />
            <span className="choice-dot" aria-hidden="true"></span>
            <span>{opt.l}</span>
          </label>
        );
      })}
    </div>
  );
}

// ===== ATOM: checks (multi pills)
function FieldChecks({ field, value, onChange }) {
  const arr = Array.isArray(value) ? value : [];
  return (
    <div className="choices">
      {field.options.map((opt) => {
        const checked = arr.includes(opt.v);
        return (
          <label key={opt.v} className={`choice ${checked ? 'checked' : ''}`}>
            <input type="checkbox" checked={checked} onChange={() => {
              if (checked) onChange(arr.filter(x => x !== opt.v));
              else onChange([...arr, opt.v]);
            }} />
            <span className="choice-check" aria-hidden="true"><Icon name="check" size={8} /></span>
            <span>{opt.l}</span>
          </label>
        );
      })}
    </div>
  );
}

// ===== CALC FIELDS
function CalcIdade({ form }) {
  const age = SitePedUtils.calcAgeFromDOB(form.dataNasc);
  return (
    <div className="input readonly" style={{ display: 'flex', alignItems: 'center' }}>
      {age ? SitePedUtils.formatAge(age) : <span style={{ color: 'var(--ink-4)' }}>preencha a data de nasc.</span>}
    </div>
  );
}

function CalcIMC({ form }) {
  const imc = SitePedUtils.calcIMC(form.peso, form.altura);
  return (
    <div className="input readonly" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={{ fontFamily: 'var(--font-mono)' }}>{imc ? imc.toFixed(2) : '—'}</span>
      <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--ink-3)' }}>kg/m²</span>
    </div>
  );
}

function CalcRNClassif({ form }) {
  const ig = SitePedUtils.classifyIG(parseFloat(form.igSemanas), parseFloat(form.igDias));
  const peso = SitePedUtils.classifyPesoNascer(parseFloat(form.pesoNasc));
  if (!ig && !peso) {
    return <div className="input readonly" style={{ display:'flex', alignItems:'center', color:'var(--ink-4)' }}>preencha IG e peso ao nascer</div>;
  }
  return (
    <div className="result">
      <div className="result-head"><Icon name="baby" size={13} /> Classificação do recém-nascido</div>
      <div className="result-grid">
        <div className="result-cell">
          <div className="result-label">Idade gestacional</div>
          <div className="result-value">{form.igSemanas ? `${form.igSemanas}sem ${form.igDias || 0}d` : '—'}</div>
          {ig && <div className={`result-tag ${ig.tone}`}>{ig.tag}</div>}
        </div>
        <div className="result-cell">
          <div className="result-label">Peso ao nascer</div>
          <div className="result-value">{form.pesoNasc ? `${form.pesoNasc} g` : '—'}</div>
          {peso && <div className={`result-tag ${peso.tone}`}>{peso.tag}</div>}
        </div>
      </div>
    </div>
  );
}

function CalcZScores({ form }) {
  const age = SitePedUtils.calcAgeFromDOB(form.dataNasc);
  const ageMonths = age ? age.totalMonths : null;
  const imc = SitePedUtils.calcIMC(form.peso, form.altura);
  const z = ageMonths != null ? SitePedUtils.calcZScores({
    sexo: form.sexo,
    ageMonths,
    pesoKg: parseFloat(form.peso),
    alturaCm: parseFloat(form.altura),
    imc,
  }) : null;

  if (!ageMonths || !form.sexo) {
    return (
      <div className="callout" style={{ marginBottom: 0 }}>
        <Icon name="info" size={14} />
        <span>Para calcular Z-scores: preencha <strong>data de nascimento</strong>, <strong>sexo</strong>, e medidas antropométricas.</span>
      </div>
    );
  }
  if (!z || (z.weight == null && z.height == null && z.bmi == null)) {
    return (
      <div className="callout" style={{ marginBottom: 0 }}>
        <Icon name="info" size={14} />
        <span>Preencha peso e/ou estatura para calcular os Z-scores.</span>
      </div>
    );
  }

  const cells = [
    { label: 'Peso/Idade',  z: z.weight, type: 'weight' },
    { label: 'Estatura/Idade', z: z.height, type: 'height' },
    { label: 'IMC/Idade', z: z.bmi, type: 'bmi' },
  ];

  return (
    <div className="result">
      <div className="result-head"><Icon name="scale" size={13} /> Z-scores OMS · referência educacional</div>
      <div className="result-grid">
        {cells.map((c) => {
          const cls = SitePedUtils.classifyZ(c.z, c.type);
          return (
            <div className="result-cell" key={c.label}>
              <div className="result-label">{c.label}</div>
              <div className="result-value">{SitePedUtils.fmtZ(c.z)}</div>
              <div className={`result-tag ${cls.tone}`}>{cls.tag}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ===== MAIN FIELD COMPONENT
function FormField({ field, value, onChange, form }) {
  const span = field.span === 2 ? 2 : 1;

  let control;
  if (field.type === 'text') control = <FieldText field={field} value={value} onChange={onChange} />;
  else if (field.type === 'number') control = <FieldText field={field} value={value} onChange={onChange} type="number" />;
  else if (field.type === 'date') control = <FieldText field={field} value={value} onChange={onChange} type="date" />;
  else if (field.type === 'textarea') control = <FieldTextarea field={field} value={value} onChange={onChange} />;
  else if (field.type === 'choices') control = <FieldChoices field={field} value={value} onChange={onChange} />;
  else if (field.type === 'checks') control = <FieldChecks field={field} value={value} onChange={onChange} />;
  else if (field.type === 'calc') {
    if (field.source === 'idade') control = <CalcIdade form={form} />;
    else if (field.source === 'imc') control = <CalcIMC form={form} />;
    else if (field.source === 'rnClassif') control = <CalcRNClassif form={form} />;
    else if (field.source === 'zscores') control = <CalcZScores form={form} />;
  }

  return (
    <div className="field" style={{ gridColumn: `span ${span}` }}>
      <label className="field-label">{field.label}</label>
      {control}
      {field.hint && <div className="field-hint">{field.hint}</div>}
    </div>
  );
}

// ===== FIELD GRID — auto layout (2-col, respects span)
function FieldGrid({ fields, form, onChange }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-4)' }}>
      {fields.map((f) => (
        <FormField
          key={f.name}
          field={f}
          value={form[f.name]}
          onChange={(v) => onChange(f.name, v)}
          form={form}
        />
      ))}
    </div>
  );
}

// ===== SECTION CARD
function SectionCard({ section, form, onChange, open, onToggle, completion }) {
  const headRef = React.useRef(null);
  return (
    <section id={`sec-${section.id}`} className={`section ${open ? 'open' : ''}`} ref={headRef}>
      <header className="section-head" onClick={onToggle}>
        <div className="section-icon"><Icon name={section.icon} size={15} /></div>
        <h2 className="section-title">
          {section.title}
          {section.soap && <span className="soap-tag">{section.soap}</span>}
        </h2>
        <div className={`section-meta ${completion?.complete ? 'complete' : ''}`}>
          {completion ? `${completion.filled}/${completion.total}` : ''}
        </div>
        <div className="section-toggle"><Icon name="chevronRight" size={14} /></div>
      </header>
      <div className="section-body">
        {section.callout && (
          <div className={`callout callout-${section.callout.tone || 'info'}`}>
            <Icon name={section.callout.icon || 'info'} size={15} />
            <span>{section.callout.text}</span>
          </div>
        )}
        <FieldGrid fields={section.fields} form={form} onChange={onChange} />
      </div>
    </section>
  );
}

window.SitePedFields = { FormField, FieldGrid, SectionCard };
