import { SignIn } from '@clerk/nextjs'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function SignInPage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center py-12">
      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft size={16} />
        Back
      </Link>
      <SignIn />
    </main>
  )
}