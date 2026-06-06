import { SignUp } from '@clerk/nextjs'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function SignUpPage() {
  return (
    <main className="relative flex h-screen overflow-hidden flex-col items-center justify-center">
      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft size={16} />
        Back
      </Link>
      <div className="w-full max-w-md flex justify-center">
        <SignUp />
      </div>
    </main>
  )
}