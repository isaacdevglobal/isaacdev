export default function VerifiedStar({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-label="Verified skills"
    >
      <circle
        cx="16"
        cy="16"
        r="14"
        stroke="#55cc93"
        strokeWidth="2"
        strokeDasharray="70 18"
        strokeLinecap="round"
      />
      <path
        d="M16 6.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L16 21.4l-5.9 3.1 1.2-6.5-4.8-4.6 6.6-.9z"
        fill="#55cc93"
      />
    </svg>
  );
}