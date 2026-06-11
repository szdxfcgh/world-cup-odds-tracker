interface EditorialIconProps {
  name: 'calendar' | 'table' | 'teams' | 'chart' | 'bracket' | 'arrow';
  className?: string;
}

const paths = {
  calendar: (
    <>
      <path d="M7 3v3M17 3v3M4 9h16" />
      <rect x="4" y="5" width="16" height="16" rx="2" />
      <path d="M8 13h3M8 17h3M14 13h2M14 17h2" />
    </>
  ),
  table: (
    <>
      <rect x="3.5" y="4" width="17" height="16" rx="2" />
      <path d="M3.5 9h17M9 9v11M15 9v11" />
    </>
  ),
  teams: (
    <>
      <circle cx="9" cy="8" r="3" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M3.5 20c.4-4 2.4-6 5.5-6s5.1 2 5.5 6M14 15c3.6-.5 5.7 1.2 6.5 5" />
    </>
  ),
  chart: (
    <>
      <path d="M4 20V9M10 20V4M16 20v-7M22 20H2" />
      <path d="m4 8 6-4 6 8 5-5" />
    </>
  ),
  bracket: (
    <>
      <path d="M4 5h5v4H4zM4 15h5v4H4zM15 10h5v4h-5z" />
      <path d="M9 7h3v5h3M9 17h3v-5" />
    </>
  ),
  arrow: <path d="M5 12h14M14 7l5 5-5 5" />,
};

export default function EditorialIcon({ name, className = '' }: EditorialIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
