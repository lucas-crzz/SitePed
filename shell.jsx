/* global React, Icon */
// SitePed — Topbar, Sidebar, Summary panel

function Topbar({ meta, onMetaChange, saveState, onSave, onCopy, onPrint, onClear }) {
  return (
    <header className="topbar">
      <div className="brand-mark">
        <div className="logo"><Icon name="stethoscope" size={15} /></div>
        SitePed
      </div>
      <div className="brand-sep"></div>
      <div className="brand-sub">Prontuário pediátrico</div>

      <div className="topbar-meta">
        <label className="meta-chip">
          <Icon name="calendar" size={14} />
          <input
            type="date"
            value={meta.dataConsulta || ''}
            onChange={(e) => onMetaChange('dataConsulta', e.target.value)}
          />
        </label>
        <label className="meta-chip">
          <Icon name="user" size={14} />
          <input
            type="text"
            placeholder="acadêmico"
            value={meta.academico || ''}
            onChange={(e) => onMetaChange('academico', e.target.value)}
          />
        </label>
        <label className="meta-chip" title="Número do prontuário">
          <Icon name="hash" size={14} />
          <input
            type="text"
            placeholder="prontuário nº"
            style={{ width: 80 }}
            value={meta.prontuario || ''}
            onChange={(e) => onMetaChange('prontuario', e.target.value)}
          />
        </label>
        <span className="save-state">{saveState}</span>
        <button className="btn" onClick={onCopy} title="Copiar texto do prontuário (Ctrl+Shift+C)">
          <Icon name="copy" size={14} /> Copiar
        </button>
        <button className="btn btn-danger" onClick={onClear} title="Limpar formulário">
          <Icon name="trash" size={14} />
        </button>
        <button className="btn" onClick={onSave} title="Salvar rascunho (Ctrl+S)">
          <Icon name="save" size={14} /> Salvar
        </button>
        <button className="btn btn-primary" onClick={onPrint} title="Imprimir / exportar PDF">
          <Icon name="print" size={14} /> Imprimir
        </button>
      </div>
    </header>
  );
}

function Sidebar({ tab, onTabChange, schema, activeSection, onJump, completion }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <div className="consult-switch" role="tablist">
          <button
            className={tab === 'first' ? 'active' : ''}
            onClick={() => onTabChange('first')}
          >Primeira</button>
          <button
            className={tab === 'follow' ? 'active' : ''}
            onClick={() => onTabChange('follow')}
          >Subsequente</button>
        </div>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-label">Seções</div>
        <nav>
          {schema.map((sec) => {
            const c = completion[sec.id];
            const active = sec.id === activeSection;
            return (
              <button
                key={sec.id}
                className={`nav-item ${active ? 'active' : ''} ${c?.complete ? 'has-progress' : ''}`}
                onClick={() => onJump(sec.id)}
              >
                <Icon name={sec.icon} size={15} />
                <span>{sec.title}</span>
                <span className="nav-progress">
                  {c?.total ? (c.complete ? '✓' : `${c.filled}/${c.total}`) : ''}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-label">Apoio</div>
        <button
          className={`nav-item ${tab === 'reference' ? 'active' : ''}`}
          onClick={() => onTabChange('reference')}
        >
          <Icon name="bookOpen" size={15} />
          <span>Material de consulta</span>
        </button>
      </div>

      <div className="sidebar-footer">
        <span>v2 · clinical petrol</span>
        <span><Icon name="check" size={12} /> local</span>
      </div>
    </aside>
  );
}

function SummaryPanel({ form, meta, schema, completion, overall }) {
  const age = window.SitePedUtils.calcAgeFromDOB(form.dataNasc);
  const imc = window.SitePedUtils.calcIMC(form.peso, form.altura);
  const sexo = form.sexo === 'F' ? 'Feminino' : form.sexo === 'M' ? 'Masculino' : null;

  // Z-score quick read
  let zbmi = null;
  let zbmiCls = null;
  if (age && form.sexo && imc) {
    const z = window.SitePedUtils.calcZScores({
      sexo: form.sexo, ageMonths: age.totalMonths, imc,
    });
    if (z?.bmi != null) {
      zbmi = z.bmi;
      zbmiCls = window.SitePedUtils.classifyZ(z.bmi, 'bmi');
    }
  }

  // Alerts: count problems
  const alerts = [];
  if (form.apAlergias && form.apAlergias.length > 3 && !/^nega/i.test(form.apAlergias)) {
    alerts.push({ icon: 'alert', text: 'Alergia relatada', value: form.apAlergias });
  }
  if (form.apMedicacoes && form.apMedicacoes.length > 3 && !/^nega/i.test(form.apMedicacoes)) {
    alerts.push({ icon: 'pill', text: 'Medicação contínua', value: form.apMedicacoes });
  }

  return (
    <aside className="summary-panel">
      <div className="summary-block">
        <div className="summary-label"><Icon name="user" size={12} /> Paciente</div>
        <div className="patient-card">
          <div className={`patient-name ${!form.nome ? 'placeholder' : ''}`}>
            {form.nome || 'Sem identificação'}
          </div>
          <div className="patient-meta">
            {age && <span>{window.SitePedUtils.formatAge(age)}</span>}
            {age && sexo && <span className="dot"></span>}
            {sexo && <span>{sexo}</span>}
            {(age || sexo) && meta.prontuario && <span className="dot"></span>}
            {meta.prontuario && <span>nº {meta.prontuario}</span>}
            {!form.nome && !age && !sexo && <span style={{ color: 'var(--ink-4)' }}>preencha identificação</span>}
          </div>
        </div>
      </div>

      <div className="summary-block">
        <div className="summary-label"><Icon name="pulse" size={12} /> Sinais vitais</div>
        <div className="vital-grid">
          <Vital label="Peso" value={form.peso} unit="kg" />
          <Vital label="Estatura" value={form.altura} unit="cm" />
          <Vital label="IMC" value={imc ? imc.toFixed(1) : ''} unit="kg/m²" tag={zbmiCls?.tag} tagTone={zbmiCls?.tone} />
          <Vital label="PC" value={form.pc} unit="cm" />
          <Vital label="PA" value={form.pa} mono />
          <Vital label="FC" value={form.fc} mono />
          <Vital label="FR" value={form.fr} mono />
          <Vital label="Temp." value={form.temp} mono />
        </div>
      </div>

      {zbmi != null && (
        <div className="summary-block">
          <div className="summary-label"><Icon name="scale" size={12} /> Z-score IMC/Idade</div>
          <div className="vital">
            <div className="vital-label">Z-score</div>
            <div className="vital-value">{window.SitePedUtils.fmtZ(zbmi)}<span className="vital-unit">DP</span></div>
            {zbmiCls && <div className={`result-tag ${zbmiCls.tone}`} style={{ marginTop: 4 }}>{zbmiCls.tag}</div>}
          </div>
        </div>
      )}

      {alerts.length > 0 && (
        <div className="summary-block">
          <div className="summary-label"><Icon name="alert" size={12} /> Alertas</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {alerts.map((a, i) => (
              <div key={i} className="callout callout-warn" style={{ margin: 0, padding: '8px 10px' }}>
                <Icon name={a.icon} size={14} />
                <div>
                  <div style={{ fontWeight: 500, fontSize: 'var(--fs-xs)' }}>{a.text}</div>
                  <div style={{ fontSize: 'var(--fs-xs)', color: 'inherit', opacity: 0.85, marginTop: 2 }}>{a.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="summary-block">
        <div className="summary-label"><Icon name="checkCircle" size={12} /> Preenchimento</div>
        <div className="progress-overall">
          <span className="num">{overall.percent}%</span>
          <span className="txt">
            {overall.filled} de {overall.total} campos preenchidos<br/>
            <span style={{ color: 'var(--ink-3)' }}>{overall.sectionsComplete} seções completas</span>
          </span>
        </div>
        <div className="progress-stack" style={{ marginTop: 10 }}>
          {schema.map((sec) => {
            const c = completion[sec.id];
            const pct = c?.total ? Math.round((c.filled / c.total) * 100) : 0;
            return (
              <div className="progress-row" key={sec.id}>
                <span className="pname">
                  <Icon name={sec.icon} size={11} />
                  <span style={{ color: 'var(--ink-2)' }}>{sec.title}</span>
                </span>
                <span className="progress-bar"><span className="fill" style={{ width: pct + '%' }}></span></span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="summary-block" style={{ marginTop: 'auto', fontSize: 'var(--fs-xs)', color: 'var(--ink-3)', borderTop: '1px solid var(--line)', paddingTop: 'var(--space-3)' }}>
        Os dados ficam salvos no seu navegador. Nada é enviado para servidores.
      </div>
    </aside>
  );
}

function Vital({ label, value, unit, mono, tag, tagTone }) {
  const has = value && String(value).trim().length > 0;
  return (
    <div className="vital">
      <div className="vital-label">{label}</div>
      <div className={`vital-value ${!has ? 'empty' : ''}`}>
        {has ? value : '—'}
        {has && unit && <span className="vital-unit">{unit}</span>}
      </div>
    </div>
  );
}

window.SitePedShell = { Topbar, Sidebar, SummaryPanel };
