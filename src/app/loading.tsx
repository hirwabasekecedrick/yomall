export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <div className="spinner" />
      <div style={{ fontSize: 12.5, fontWeight: 600, color: '#8A968D', letterSpacing: '.3px' }}>
        Loading yoMall…
      </div>
    </div>
  );
}
