import Link from "next/link";

type Props = {
  title?: string;
  children: React.ReactNode;
};

// PUBLIC_INTERFACE
export default function AppShell({ title, children }: Props) {
  /** App frame with retro header and content container. */
  return (
    <div className="app-bg">
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <header className="app-header">
        <div className="app-container header-inner">
          <div className="brand">
            <Link href="/" className="brand-link">
              <span className="brand-mark" aria-hidden="true">
                ◼
              </span>
              <span className="brand-text">Recipe Hub</span>
              <span className="brand-tag">retro edition</span>
            </Link>
          </div>

          <nav className="nav">
            <Link className="nav-link" href="/">
              Browse
            </Link>
          </nav>
        </div>

        {title ? (
          <div className="app-container header-title">
            <h1 className="page-title">{title}</h1>
          </div>
        ) : null}
      </header>

      <main id="main" className="app-main">
        <div className="app-container">{children}</div>
      </main>

      <footer className="app-footer">
        <div className="app-container footer-inner">
          <p className="muted">
            Data from backend API: <code className="inline-code">/recipes</code>
          </p>
        </div>
      </footer>
    </div>
  );
}
