/* global React */
// Lucide-style icon set — line, 1.6 stroke, 24x24 viewBox
// Usage: <Icon name="user" size={16} />

const ICON_PATHS = {
  // identity / people
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" /></>,
  users: <><circle cx="9" cy="8" r="3.5" /><path d="M3 20c1-3 3-4.5 6-4.5s5 1.5 6 4.5" /><path d="M16 4.5a3.5 3.5 0 0 1 0 7" /><path d="M21 20c-0.5-2.5-2-4-4-4.5" /></>,
  baby: <><circle cx="12" cy="9" r="5" /><path d="M9 9h.01" /><path d="M15 9h.01" /><path d="M10 12c.5.5 1.5 1 2 1s1.5-.5 2-1" /><path d="M7 20c1.5-2.5 3-3 5-3s3.5.5 5 3" /></>,

  // medical
  stethoscope: <><path d="M4 4v6a4 4 0 0 0 8 0V4" /><path d="M4 4h2" /><path d="M10 4h2" /><path d="M8 14v3a4 4 0 0 0 4 4 4 4 0 0 0 4-4v-2" /><circle cx="18" cy="11" r="2.5" /></>,
  heart: <><path d="M12 21s-7-4.5-9-9.5C1.5 7.5 5 4 8.5 5.5 10.5 6.4 12 8 12 8s1.5-1.6 3.5-2.5C19 4 22.5 7.5 21 11.5 19 16.5 12 21 12 21z" /></>,
  pulse: <><path d="M3 12h4l2-7 4 14 2-7h6" /></>,
  pill: <><rect x="3" y="9" width="18" height="6" rx="3" transform="rotate(-45 12 12)" /><path d="M8.5 8.5l7 7" /></>,
  syringe: <><path d="M14 4l6 6" /><path d="M16 6l2-2 2 2-2 2" /><path d="M14 8l-9 9v3h3l9-9" /><path d="M10 12l2 2" /></>,
  thermometer: <><path d="M14 14V5a2 2 0 1 0-4 0v9a4 4 0 1 0 4 0z" /></>,
  ruler: <><path d="M3 17l14-14 4 4-14 14z" /><path d="M7 13l2 2" /><path d="M11 9l2 2" /><path d="M15 5l2 2" /></>,
  scale: <><path d="M5 6h14l-1 4H6z" /><path d="M5 6c0-1 1-2 2-2h10c1 0 2 1 2 2" /><circle cx="9" cy="14" r="1" /><circle cx="15" cy="14" r="1" /><path d="M6 10v9a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-9" /></>,
  microscope: <><path d="M6 18h12" /><path d="M8 18v-2h8v2" /><path d="M14 9l-3-3a2 2 0 0 1 0-3 2 2 0 0 1 3 0l3 3" /><path d="M14 9l-4 4 3 3 4-4" /><path d="M9 14a4 4 0 1 0 4 4" /></>,
  brain: <><path d="M12 5a3 3 0 0 0-3 3v1a2 2 0 0 0-2 2v1a2 2 0 0 0 1 1.7V15a3 3 0 0 0 3 3h1" /><path d="M12 5a3 3 0 0 1 3 3v1a2 2 0 0 1 2 2v1a2 2 0 0 1-1 1.7V15a3 3 0 0 1-3 3h-1" /><path d="M12 5v13" /></>,
  utensils: <><path d="M5 3v7c0 1.5 1 2.5 2 2.5s2-1 2-2.5V3" /><path d="M7 12.5V21" /><path d="M16 3c-2 0-3 2-3 4.5S14 12 16 12v9" /></>,
  home: <><path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1z" /></>,
  family: <><circle cx="6" cy="7" r="2.5" /><circle cx="18" cy="7" r="2.5" /><circle cx="12" cy="14" r="2" /><path d="M3 14c0-2 1.5-3 3-3" /><path d="M21 14c0-2-1.5-3-3-3" /><path d="M8 20c0-2 2-3 4-3s4 1 4 3" /></>,
  message: <><path d="M4 5h16v11h-9l-5 4v-4H4z" /></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 9h18" /><path d="M8 3v4" /><path d="M16 3v4" /></>,
  shield: <><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" /></>,
  clipboard: <><rect x="6" y="4" width="12" height="17" rx="2" /><rect x="9" y="2" width="6" height="4" rx="1" /><path d="M9 11h6" /><path d="M9 15h6" /></>,
  notebook: <><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M9 3v18" /><path d="M12 7h4" /><path d="M12 11h4" /><path d="M12 15h2" /></>,
  bookOpen: <><path d="M3 5h6a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H3z" /><path d="M21 5h-6a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h7z" /></>,
  book: <><path d="M5 4v16a2 2 0 0 0 2 2h13V2H7a2 2 0 0 0-2 2z" /><path d="M5 18h15" /></>,
  folder: <><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></>,

  // ui actions
  save: <><path d="M5 3h11l3 3v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" /><path d="M8 3v5h7V3" /><path d="M8 14h8" /><path d="M8 18h8" /></>,
  print: <><path d="M7 9V4h10v5" /><rect x="3" y="9" width="18" height="9" rx="2" /><path d="M7 14h10v6H7z" /><circle cx="18" cy="12" r="0.7" fill="currentColor" stroke="none" /></>,
  copy: <><rect x="8" y="8" width="13" height="13" rx="2" /><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" /></>,
  check: <><polyline points="4 12 10 18 20 6" /></>,
  checkCircle: <><circle cx="12" cy="12" r="9" /><polyline points="8 12 11 15 16 9" /></>,
  x: <><path d="M6 6l12 12" /><path d="M18 6L6 18" /></>,
  trash: <><path d="M4 7h16" /><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" /><path d="M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13" /><path d="M10 11v6" /><path d="M14 11v6" /></>,
  chevronRight: <><polyline points="9 6 15 12 9 18" /></>,
  chevronDown: <><polyline points="6 9 12 15 18 9" /></>,
  chevronLeft: <><polyline points="15 6 9 12 15 18" /></>,
  plus: <><path d="M12 5v14" /><path d="M5 12h14" /></>,
  minus: <><path d="M5 12h14" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.5-4.5" /></>,
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v6" /><circle cx="12" cy="7.5" r="0.7" fill="currentColor" stroke="none" /></>,
  alert: <><path d="M12 3l10 18H2z" /><path d="M12 10v5" /><circle cx="12" cy="18" r="0.7" fill="currentColor" stroke="none" /></>,
  bell: <><path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z" /><path d="M10 21a2 2 0 0 0 4 0" /></>,
  edit: <><path d="M14 4l6 6L9 21H3v-6z" /><path d="M13 5l6 6" /></>,
  zap: <><polygon points="13 2 4 14 12 14 11 22 20 10 12 10" /></>,
  external: <><path d="M14 4h6v6" /><path d="M20 4L10 14" /><path d="M20 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h5" /></>,
  download: <><path d="M12 3v13" /><polyline points="7 11 12 16 17 11" /><path d="M4 20h16" /></>,
  more: <><circle cx="6" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="18" cy="12" r="1" fill="currentColor" stroke="none" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 16 14" /></>,
  refresh: <><path d="M21 12a9 9 0 0 1-15.5 6.5L3 17" /><polyline points="3 22 3 17 8 17" /><path d="M3 12a9 9 0 0 1 15.5-6.5L21 7" /><polyline points="21 2 21 7 16 7" /></>,
  list: <><path d="M8 6h13" /><path d="M8 12h13" /><path d="M8 18h13" /><circle cx="4" cy="6" r="1" fill="currentColor" stroke="none" /><circle cx="4" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="4" cy="18" r="1" fill="currentColor" stroke="none" /></>,
  layers: <><polygon points="12 2 21 8 12 14 3 8" /><polyline points="3 13 12 19 21 13" /><polyline points="3 18 12 24 21 18" transform="translate(0 -6)" /></>,
  settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 0 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 0 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 0 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h0a1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 0 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v0a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" /></>,
  hash: <><path d="M5 9h14" /><path d="M5 15h14" /><path d="M10 3l-2 18" /><path d="M16 3l-2 18" /></>,
  hospital: <><path d="M4 21V8l8-5 8 5v13" /><path d="M10 21v-6h4v6" /><path d="M12 10v3" /><path d="M10.5 11.5h3" /></>,
  bed: <><path d="M3 18V8" /><path d="M3 14h18v4" /><path d="M21 18V11a3 3 0 0 0-3-3h-7v6" /><circle cx="7" cy="12" r="2" /></>,
  flask: <><path d="M10 3v5l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3" /><path d="M9 3h6" /><path d="M7 14h10" /></>,
  warning: <><path d="M12 3l10 18H2z" /><path d="M12 10v5" /><circle cx="12" cy="18" r="0.7" fill="currentColor" stroke="none" /></>,
  sparkle: <><path d="M12 3v6" /><path d="M12 15v6" /><path d="M3 12h6" /><path d="M15 12h6" /></>,
  filter: <><polygon points="3 4 21 4 14 13 14 20 10 20 10 13" /></>,
  history: <><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><polyline points="3 3 3 8 8 8" /><polyline points="12 7 12 12 16 14" /></>,
  arrowUpDown: <><path d="M7 4v16" /><polyline points="3 8 7 4 11 8" /><path d="M17 4v16" /><polyline points="13 16 17 20 21 16" /></>,
  vitamin: <><circle cx="12" cy="12" r="9" /><path d="M12 8v8" /><path d="M8 12h8" /></>,
};

function Icon({ name, size = 16, strokeWidth = 1.6, className = '', style = {} }) {
  const path = ICON_PATHS[name];
  if (!path) return null;
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden="true"
    >
      {path}
    </svg>
  );
}

window.Icon = Icon;
