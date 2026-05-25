/* global React, Icon */
// SitePed — Material de consulta (Apgar, Tanner, Bristol, etc.)

const REF_ITEMS = [
  { id: 'apgar',    img: 'ref/Apgar.png',    title: 'Escala de Apgar', sub: 'Vitalidade ao nascimento (1’ e 5’)' },
  { id: 'dnpm',     img: 'ref/DNPM.png',     title: 'DNPM — marcos do desenvolvimento', sub: 'Motor grosso, fino, linguagem, social' },
  { id: 'reflexos', img: 'ref/Reflexos.png', title: 'Reflexos primitivos', sub: 'Moro, sucção, preensão, marcha…' },
  { id: 'tannerf',  img: 'ref/TannerF.png',  title: 'Tanner ♀ — estágios puberais', sub: 'Mamas e pelos pubianos' },
  { id: 'tannerm',  img: 'ref/TannerM.png',  title: 'Tanner ♂ — estágios puberais', sub: 'Genitália e pelos pubianos' },
  { id: 'bristol',  img: 'ref/Bristol.png',  title: 'Escala de Bristol', sub: 'Classificação de fezes' },
  { id: 'kayaba',   img: 'ref/Kayaba.png',   title: 'Escala de Kayaba', sub: 'Avaliação de gravidade respiratória' },
];

function ReferencePage() {
  const [lightbox, setLightbox] = React.useState(null);

  React.useEffect(() => {
    if (!lightbox) return;
    const onKey = (e) => { if (e.key === 'Escape') setLightbox(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox]);

  return (
    <div className="panel-anim">
      <div className="panel-intro">
        <h1>Material de consulta</h1>
        <span className="panel-sub">Escalas e referências usadas no exame e na avaliação pediátrica</span>
      </div>

      <div className="ref-grid">
        {REF_ITEMS.map((r) => (
          <div key={r.id} className="ref-card" onClick={() => setLightbox(r)}>
            <div className="ref-card-img">
              <img src={r.img} alt={r.title} loading="lazy" />
            </div>
            <div className="ref-card-body">
              <div className="ref-card-title">{r.title}</div>
              <div className="ref-card-sub">{r.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <button className="lightbox-close" onClick={() => setLightbox(null)} aria-label="Fechar">
            <Icon name="x" size={18} />
          </button>
          <img src={lightbox.img} alt={lightbox.title} onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}

window.SitePedReference = { ReferencePage };
