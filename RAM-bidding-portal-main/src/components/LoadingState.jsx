export default function LoadingState() {
  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20">
      <div className="flex flex-col items-center justify-center py-20">
        <div className="relative w-16 h-16 mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-ram-gold/20" />
          <div className="absolute inset-0 rounded-full border-4 border-ram-primary border-t-transparent animate-spin" />
        </div>
        <p className="text-ink-muted text-sm">Chargement des appels d'offres...</p>
      </div>
    </div>
  )
}
