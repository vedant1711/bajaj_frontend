import { Metadata } from 'next'
import BajajChallengeForm from '@/components/bajaj-challenge-form'

export const metadata: Metadata = {
  title: '0827CS211248',
  description: 'Bajaj Finserv Health Dev Challenge',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-br from-purple-700 to-blue-500">
      <h1 className="text-4xl font-bold text-white mb-8">Bajaj Finserv Health Dev Challenge</h1>
      <BajajChallengeForm />
    </main>
  )
}

