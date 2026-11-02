export default function StarRating({
  value,
  size = 16,
}: {
  value: number;
  size?: number;
}) {
  const filled = Math.round(value);
  return (
    <span
      className="inline-flex"
      style={{ fontSize: size, letterSpacing: 1 }}
      aria-label={`${value} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          style={{ color: n <= filled ? "#f2b544" : "rgba(255,255,255,0.2)" }}
        >
          ★
        </span>
      ))}
    </span>
  );
}