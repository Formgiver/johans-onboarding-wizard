'use client'

import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'
import Link from 'next/link'
import { EnvelopeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'
import { Button, Alert } from '@/components/ui'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/projects`,
      },
    })

    setLoading(false)

    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else {
      setMessage({ type: 'success', text: 'Check your email for the login link!' })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex justify-center">
          <svg className="h-12 w-auto text-indigo-600" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V7.3l7-3.11v8.8z"/>
          </svg>
        </Link>
        <h2 className="mt-6 text-center text-3xl font-semibold tracking-tight text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link href="/" className="font-semibold text-indigo-600 hover:text-indigo-500">
            go back to home
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm sm:rounded-lg sm:px-10 inset-ring inset-ring-gray-200">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                Email address
              </label>
              <div className="mt-2 relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <EnvelopeIcon aria-hidden="true" className="size-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="block w-full rounded-md bg-white pl-10 px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 disabled:bg-gray-50 disabled:text-gray-500"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={loading}
                className="w-full justify-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 size-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Sending...
                  </>
                ) : (
                  'Send magic link'
                )}
              </Button>
            </div>
          </form>

          {message && (
            <div className="mt-6">
              <Alert variant={message.type}>
                {message.text}
              </Alert>
            </div>
          )}

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm/6">
                <span className="bg-white px-6 text-gray-500">How it works</span>
              </div>
            </div>

            <div className="mt-6 text-sm text-gray-600">
              <p className="mb-2">We&apos;ll send you a magic link to sign in without a password.</p>
              <ul className="list-disc list-inside space-y-1 text-gray-500">
                <li>No password required</li>
                <li>Secure authentication via email</li>
                <li>Link expires after use</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-x-1.5 text-sm font-semibold text-gray-900 hover:text-indigo-600"
          >
            <ArrowLeftIcon aria-hidden="true" className="size-4" />
            Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
