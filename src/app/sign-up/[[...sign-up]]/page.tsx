import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <main className="flex h-screen w-full flex-col items-center justify-center bg-gray-50 p-10 overflow-hidden">
      <div className="w-full max-w-md flex justify-center">
        <SignUp />
      </div>
    </main>
  )
}