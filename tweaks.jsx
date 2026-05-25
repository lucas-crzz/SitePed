/* global React, Icon, TweaksPanel, useTweaks, TweakSection, TweakRadio, TweakSelect */
// SitePed — Tweaks panel (densidade, tipografia, ícones)

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "density": "balanced",
  "font": "plex",
  "fontSize": "13",
  "icons": "line"
}/*EDITMODE-END*/;

function SitePedTweaks() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Apply tweaks to <html> data-attrs
  React.useEffect(() => {
    document.documentElement.dataset.density = t.density;
    document.documentElement.dataset.font = t.font;
    document.documentElement.dataset.fontSize = t.fontSize;
    document.documentElement.dataset.icons = t.icons;
  }, [t.density, t.font, t.fontSize, t.icons]);

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Densidade" />
      <TweakRadio
        label="Tamanho"
        value={t.density}
        onChange={(v) => setTweak('density', v)}
        options={[
          { value: 'compact',     label: 'Compacto' },
          { value: 'balanced',    label: 'Equilibrado' },
          { value: 'comfortable', label: 'Amplo' },
        ]}
      />

      <TweakSection label="Tipografia" />
      <TweakSelect
        label="Família"
        value={t.font}
        onChange={(v) => setTweak('font', v)}
        options={[
          { value: 'plex',   label: 'IBM Plex Sans' },
          { value: 'public', label: 'Public Sans' },
          { value: 'dm',     label: 'DM Sans' },
        ]}
      />
      <TweakRadio
        label="Tamanho base"
        value={t.fontSize}
        onChange={(v) => setTweak('fontSize', v)}
        options={[
          { value: '13', label: '13' },
          { value: '14', label: '14' },
          { value: '15', label: '15' },
        ]}
      />

      <TweakSection label="Ícones" />
      <TweakRadio
        label="Estilo"
        value={t.icons}
        onChange={(v) => setTweak('icons', v)}
        options={[
          { value: 'line',    label: 'Linha' },
          { value: 'duotone', label: 'Duotone' },
        ]}
      />
    </TweaksPanel>
  );
}

// Mount on a separate root so it doesn't conflict with App
const tweaksContainer = document.createElement('div');
tweaksContainer.id = 'tweaks-root';
document.body.appendChild(tweaksContainer);
ReactDOM.createRoot(tweaksContainer).render(<SitePedTweaks />);
