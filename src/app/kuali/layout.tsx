// src/app/kuali/layout.tsx
// Este layout aísla la página de Kuali del layout raíz de finans
// (evita que el navbar/sidebar de finans se monte sobre Kuali, que tiene el suyo propio)

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
