export default function KualiLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50 }}>
      {children}
    </div>
  )
}
