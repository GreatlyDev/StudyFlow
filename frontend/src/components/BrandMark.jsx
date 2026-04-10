export default function BrandMark({ compact = false }) {
  return (
    <div className={`brand-mark ${compact ? "compact" : ""}`}>
      <span />
      <span />
      <span />
    </div>
  );
}
