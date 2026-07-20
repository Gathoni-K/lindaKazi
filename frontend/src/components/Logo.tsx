interface LogoProps {
  size?: number;
  className?: string;
}

export default function Logo({ size = 32, className = "" }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M20 2L36 8V20C36 30.4934 29.6127 38.7508 20 42C10.3873 38.7508 4 30.4934 4 20V8L20 2Z"
        fill="var(--color-teal)"
        fillOpacity="0.12"
        stroke="var(--color-teal)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M20 30C20 30 12 25.2 12 19.2C12 16.3281 14.2386 14 17 14C18.3132 14 19.5 14.6 20 15.6C20.5 14.6 21.6868 14 23 14C25.7614 14 28 16.3281 28 19.2C28 25.2 20 30 20 30Z"
        fill="var(--color-amber)"
      />
    </svg>
  );
}