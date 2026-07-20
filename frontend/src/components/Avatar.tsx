interface AvatarProps {
  name: string;
  size?: number;
}

export default function Avatar({ name, size = 36 }: AvatarProps) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");

  return (
    <div
      style={{ width: size, height: size }}
      className="flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal to-violet font-display text-xs font-semibold text-ink"
    >
      {initials || "?"}
    </div>
  );
}