interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
}

export default function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <header className="wc-page-header">
      <p className="wc-kicker">{eyebrow}</p>
      <div className="wc-page-header-line">
        <h1 className="wc-page-title">{title}</h1>
        <span className="wc-issue-mark">WORLD CUP 26 / DATA DESK</span>
      </div>
      <p className="wc-page-subtitle">{description}</p>
    </header>
  );
}
