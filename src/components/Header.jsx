import { NavLink } from 'react-router-dom';
import { useAssessment } from '../context/AssessmentContext';
import { ThemeIcon } from './icons';
import { useCopy } from '../hooks/useCopy';
import { copy } from '../i18n/copy';

function Header() {
  const { theme, setTheme, uiLanguage, setUiLanguage } = useAssessment();
  const c = useCopy();
  const uiOptions = Object.entries(copy).map(([code, value]) => ({
    code,
    label: value.uiName || code
  }));

  return (
    <header className="app-header">
      <div className="header-left">
        <p className="eyebrow">{c.badge}</p>
        <div className="brand-row">
          <h1>{c.title}</h1>
          <div className="pill accent">蓝白 · Mediterranean</div>
        </div>
        <p className="subtitle">{c.subtitle}</p>
        <nav className="nav-links">
          <NavLink to="/" end className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            {c.navHome}
          </NavLink>
          <NavLink to="/test" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            {c.navTest}
          </NavLink>
          <NavLink
            to="/manual"
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            {c.navManual}
          </NavLink>
          <NavLink
            to="/results"
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            {c.navResults}
          </NavLink>
        </nav>
      </div>
      <div className="header-actions">
        <select
          className="ghost select"
          value={uiLanguage}
          onChange={(e) => setUiLanguage(e.target.value)}
          aria-label={c.uiLangLabel}
        >
          {uiOptions.map((opt) => (
            <option key={opt.code} value={opt.code}>
              {opt.label}
            </option>
          ))}
        </select>
        <button className="ghost icon-btn" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
          <ThemeIcon mode={theme} />
        </button>
      </div>
    </header>
  );
}

export default Header;
