/* global React, ReactDOM, Icon, SitePedSchema, SitePedFields, SitePedShell, SitePedReference, SitePedPrint, SitePedUtils */
// SitePed — App principal.

const { useState, useEffect, useMemo, useCallback, useRef } = React;

const STORAGE_KEY = 'siteped:v2';

const DEFAULT_STATE = {
  tab: 'first',                // 'first' | 'follow' | 'reference'
  meta: { dataConsulta: '', academico: '', prontuario: '' },
  formFirst: {},
  formFollow: {},
  openSections: {},            // { 'first:identificacao': true, ... }
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) { return null; }
}

function saveState(state) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
}

function valueIsFilled(field, value, form) {
  if (field.type === 'calc') {
    if (field.source === 'idade') return !!form.dataNasc;
    if (field.source === 'imc') return !!(form.peso && form.altura);
    if (field.source === 'rnClassif') return !!(form.igSemanas && form.pesoNasc);
    if (field.source === 'zscores') return !!(form.peso && form.altura && form.dataNasc && form.sexo);
    return false;
  }
  if (Array.isArray(value)) return value.length > 0;
  return value != null && String(value).trim() !== '';
}

function computeCompletion(schema, form) {
  const out = {};
  let totalAll = 0;
  let filledAll = 0;
  let sectionsComplete = 0;
  for (const sec of schema) {
    let total = 0, filled = 0;
    for (const f of sec.fields) {
      total += 1;
      if (valueIsFilled(f, form[f.name], form)) filled += 1;
    }
    const complete = total > 0 && filled === total;
    if (complete) sectionsComplete += 1;
    out[sec.id] = { filled, total, complete };
    totalAll += total;
    filledAll += filled;
  }
  const percent = totalAll === 0 ? 0 : Math.round((filledAll / totalAll) * 100);
  return { perSection: out, overall: { filled: filledAll, total: totalAll, percent, sectionsComplete } };
}

function App() {
  const [hydrated, setHydrated] = useState(false);
  const [state, setState] = useState(DEFAULT_STATE);
  const [saveStateLabel, setSaveStateLabel] = useState('rascunho local');
  const [activeSection, setActiveSection] = useState('identificacao');
  const [toast, setToast] = useState(null);
  const [copyModal, setCopyModal] = useState(null);
  const mainScrollRef = useRef(null);

  // Hydrate
  useEffect(() => {
    const loaded = loadState();
    if (loaded) {
      setState({ ...DEFAULT_STATE, ...loaded, openSections: loaded.openSections || {} });
    } else {
      // open first sections by default
      setState((s) => ({
        ...s,
        openSections: {
          'first:identificacao': true,
          'first:hma': true,
          'first:exameFisico': true,
          'first:avaliacao': true,
          'first:plano': true,
          'follow:identificacao': true,
          'follow:evolucao': true,
          'follow:exameFisico': true,
          'follow:avaliacao': true,
          'follow:plano': true,
        },
      }));
    }
    setHydrated(true);
  }, []);

  // Auto-save
  useEffect(() => {
    if (!hydrated) return;
    setSaveStateLabel('salvando…');
    const t = setTimeout(() => {
      saveState(state);
      const time = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      setSaveStateLabel(`salvo ${time}`);
    }, 600);
    return () => clearTimeout(t);
  }, [state, hydrated]);

  const tab = state.tab;
  const isFirst = tab === 'first';
  const isFollow = tab === 'follow';
  const isRef   = tab === 'reference';
  const schema = isFirst ? SitePedSchema.SCHEMA_FIRST : SitePedSchema.SCHEMA_FOLLOW;
  const form = isFirst ? state.formFirst : state.formFollow;
  const formKey = isFirst ? 'formFirst' : 'formFollow';

  const { perSection, overall } = useMemo(
    () => computeCompletion(schema, form),
    [schema, form]
  );

  const handleFieldChange = useCallback((name, value) => {
    setState((s) => ({
      ...s,
      [formKey]: { ...s[formKey], [name]: value },
    }));
  }, [formKey]);

  const handleMetaChange = useCallback((k, v) => {
    setState((s) => ({ ...s, meta: { ...s.meta, [k]: v } }));
  }, []);

  const handleTabChange = useCallback((t) => {
    setState((s) => ({ ...s, tab: t }));
  }, []);

  const handleToggleSection = useCallback((sectionId) => {
    setState((s) => {
      const key = `${s.tab}:${sectionId}`;
      return { ...s, openSections: { ...s.openSections, [key]: !s.openSections[key] } };
    });
  }, []);

  const handleJump = useCallback((sectionId) => {
    setState((s) => {
      const key = `${s.tab}:${sectionId}`;
      return { ...s, openSections: { ...s.openSections, [key]: true } };
    });
    setActiveSection(sectionId);
    requestAnimationFrame(() => {
      const el = document.getElementById(`sec-${sectionId}`);
      if (el && mainScrollRef.current) {
        const top = el.offsetTop - 16;
        mainScrollRef.current.scrollTo({ top, behavior: 'smooth' });
      }
    });
  }, []);

  // Track active section based on scroll
  useEffect(() => {
    if (!isFirst && !isFollow) return;
    const main = mainScrollRef.current;
    if (!main) return;
    const onScroll = () => {
      const sections = schema.map(s => document.getElementById(`sec-${s.id}`)).filter(Boolean);
      const scrollTop = main.scrollTop;
      let cur = sections[0]?.id?.replace('sec-', '') || 'identificacao';
      for (const el of sections) {
        if (el.offsetTop - 40 <= scrollTop) cur = el.id.replace('sec-', '');
      }
      setActiveSection(cur);
    };
    main.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => main.removeEventListener('scroll', onScroll);
  }, [schema, isFirst, isFollow, tab]);

  // Save / copy / print / clear
  const handleSave = useCallback(() => {
    saveState(state);
    const time = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    setSaveStateLabel(`salvo ${time}`);
    setToast({ type: 'ok', text: 'Rascunho salvo localmente' });
  }, [state]);

  const handleCopy = useCallback(() => {
    const sch = isRef ? SitePedSchema.SCHEMA_FIRST : schema;
    const f = isRef ? state.formFirst : form;
    const text = SitePedPrint.toPlainText({ schema: sch, form: f, meta: state.meta });
    setCopyModal({ text });
  }, [schema, form, state.meta, isRef, state.formFirst]);

  const handleClear = useCallback(() => {
    if (!window.confirm('Limpar todos os campos da consulta atual? Esta ação não pode ser desfeita.')) return;
    setState((s) => ({ ...s, [formKey]: {} }));
    setToast({ type: 'ok', text: 'Formulário limpo' });
  }, [formKey]);

  const handlePrint = useCallback(() => {
    document.body.classList.add('printing');
    requestAnimationFrame(() => {
      window.print();
      setTimeout(() => document.body.classList.remove('printing'), 500);
    });
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault(); handleSave();
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'C' || e.key === 'c')) {
        e.preventDefault(); handleCopy();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault(); handlePrint();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleSave, handleCopy, handlePrint]);

  // Auto-dismiss toast
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  if (!hydrated) return null;

  return (
    <div className="app">
      <SitePedShell.Topbar
        meta={state.meta}
        onMetaChange={handleMetaChange}
        saveState={saveStateLabel}
        onSave={handleSave}
        onCopy={handleCopy}
        onPrint={handlePrint}
        onClear={handleClear}
      />

      <SitePedShell.Sidebar
        tab={tab}
        onTabChange={handleTabChange}
        schema={isRef ? SitePedSchema.SCHEMA_FIRST : schema}
        activeSection={activeSection}
        onJump={(id) => {
          if (isRef) {
            setState((s) => ({ ...s, tab: 'first' }));
            requestAnimationFrame(() => handleJump(id));
          } else handleJump(id);
        }}
        completion={perSection}
      />

      <main className="main" ref={mainScrollRef}>
        <div className="main-inner">
          {isRef ? (
            <SitePedReference.ReferencePage />
          ) : (
            <div className="panel-anim" key={tab}>
              <div className="panel-intro">
                <h1>{isFirst ? 'Primeira consulta' : 'Consulta subsequente'}</h1>
                <span className="panel-sub">
                  {isFirst
                    ? 'Anamnese completa · estrutura SOAP · cálculos OMS'
                    : 'Evolução do paciente · ajuste de conduta'}
                </span>
              </div>

              {schema.map((sec) => (
                <SitePedFields.SectionCard
                  key={sec.id}
                  section={sec}
                  form={form}
                  onChange={handleFieldChange}
                  open={!!state.openSections[`${tab}:${sec.id}`]}
                  onToggle={() => handleToggleSection(sec.id)}
                  completion={perSection[sec.id]}
                />
              ))}

              <div style={{ height: '40vh' }}></div>
            </div>
          )}
        </div>

        <SitePedPrint.PrintView
          schema={isRef ? SitePedSchema.SCHEMA_FIRST : schema}
          form={isRef ? state.formFirst : form}
          meta={state.meta}
        />
      </main>

      <SitePedShell.SummaryPanel
        form={form}
        meta={state.meta}
        schema={schema}
        completion={perSection}
        overall={overall}
      />

      {toast && (
        <div className="toast">
          <Icon name="check" size={14} />
          {toast.text}
        </div>
      )}

      {copyModal && (
        <CopyModal text={copyModal.text} onClose={() => setCopyModal(null)} onCopied={() => setToast({ type: 'ok', text: 'Copiado para área de transferência' })} />
      )}
    </div>
  );
}

function CopyModal({ text, onClose, onCopied }) {
  const taRef = useRef(null);
  const doCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      onCopied();
      setTimeout(onClose, 300);
    } catch (e) {
      taRef.current?.select();
      document.execCommand('copy');
      onCopied();
      setTimeout(onClose, 300);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3>Texto do prontuário</h3>
          <button className="btn btn-ghost" onClick={onClose}><Icon name="x" size={14} /></button>
        </div>
        <div className="modal-body">
          <textarea ref={taRef} readOnly value={text}></textarea>
        </div>
        <div className="modal-foot">
          <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--ink-3)' }}>
            {text.split('\n').length} linhas · estrutura SOAP
          </span>
          <span className="spacer"></span>
          <button className="btn" onClick={onClose}>Fechar</button>
          <button className="btn btn-primary" onClick={doCopy}>
            <Icon name="copy" size={14} /> Copiar para área de transferência
          </button>
        </div>
      </div>
    </div>
  );
}

window.SitePedApp = App;

// Mount
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
