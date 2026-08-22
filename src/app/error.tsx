'use client';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-6 text-center">
      <div style={{ fontSize: 13, fontWeight: 800, color: '#B91C1C', textTransform: 'uppercase', letterSpacing: '.5px' }}>
        Something went wrong
      </div>
      <p style={{ fontSize: 13, color: '#4B5A50', maxWidth: 420 }}>
        An unexpected error occurred while loading this page. You can retry — your session data is untouched.
      </p>
      <button
        onClick={reset}
        className="btn primary"
        style={{ padding: '10px 22px', borderRadius: 10, fontSize: 13, fontWeight: 700 }}
      >
        Try again
      </button>
    </div>
  );
}
