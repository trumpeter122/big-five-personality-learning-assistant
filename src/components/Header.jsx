import { NavLink } from 'react-router-dom';
import { useAssessment } from '../context/AssessmentContext';
import { ThemeIcon } from './icons';

function Header() {
  const { theme, setTheme } = useAssessment();

  return (
    <header className="app-header">
      <div className="header-left">
        <p className="eyebrow">人格学习助手</p>
        <div className="brand-row">
          <h1>「人格适配」学习策略引擎</h1>
          <div className="pill accent">蓝白 · Mediterranean</div>
        </div>
        <p className="subtitle">
          基于 Big Five（120 题）与学习风格适配理论，生成与你气质吻合的学习路线与复习仪式。
        </p>
        <nav className="nav-links">
          <NavLink to="/" end className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            主页
          </NavLink>
          <NavLink to="/test" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            严谨测试
          </NavLink>
          <NavLink
            to="/manual"
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            直接输入
          </NavLink>
          <NavLink
            to="/results"
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            策略结果
          </NavLink>
        </nav>
      </div>
      <div className="header-actions">
        <button className="ghost icon-btn" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
          <ThemeIcon mode={theme} />
        </button>
      </div>
    </header>
  );
}

export default Header;
