'use client'

import { useState } from 'react'

type FilterOption = 'alphabets' | 'numbers' | 'highest_lowercase_alphabet'

interface ApiResponse {
  is_success: boolean
  user_id: string
  email: string
  roll_number: string
  numbers: string[]
  alphabets: string[]
  highest_lowercase_alphabet: string[]
  is_prime_found: boolean
  file_valid: boolean
  file_mime_type?: string
  file_size_kb?: string
}

export default function BajajChallengeForm() {
  const [jsonInput, setJsonInput] = useState('')
  const [response, setResponse] = useState<ApiResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [selectedFilters, setSelectedFilters] = useState<FilterOption[]>([])
  const [showFilters, setShowFilters] = useState(false)

  const validateInput = (input: string): boolean => {
    try {
      const parsed = JSON.parse(input)
      if (!Array.isArray(parsed.data)) {
        throw new Error('Input must contain a "data" array')
      }
      return true
    } catch (err) {
      setError(`Invalid JSON input: ${(err as Error).message}`)
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setResponse(null)
    setShowFilters(false)

    if (!validateInput(jsonInput)) {
      return
    }

    try {
    //   const res = await fetch('api/bfhl', {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bfhl`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonInput,
      })

      if (!res.ok) {
        throw new Error(`API error: ${res.status} ${res.statusText}`)
      }

      const data: ApiResponse = await res.json()
      setResponse(data)
      setShowFilters(true)
    } catch (err) {
      setError(`API error: ${(err as Error).message}`)
    }
  }

  const handleFilterChange = (option: FilterOption) => {
    setSelectedFilters((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    )
  }

  const getFilteredResponse = () => {
    if (!response) return null

    const filteredResponse: Partial<ApiResponse> = {
      is_success: response.is_success,
      user_id: response.user_id,
      email: response.email,
      roll_number: response.roll_number,
    }

    if (selectedFilters.includes('alphabets')) {
      filteredResponse.alphabets = response.alphabets
    }
    if (selectedFilters.includes('numbers')) {
      filteredResponse.numbers = response.numbers
    }
    if (selectedFilters.includes('highest_lowercase_alphabet')) {
      filteredResponse.highest_lowercase_alphabet = response.highest_lowercase_alphabet
    }

    return filteredResponse
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="jsonInput" className="block text-sm font-medium text-gray-700">
            JSON Input
          </label>
          <textarea
            id="jsonInput"
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder='{"data": ["A", "1", "B", "2"]}'
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            rows={4}
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Submit
        </button>
      </form>

      {error && (
        <div className="mt-4 p-2 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {showFilters && (
        <div className="mt-8 space-y-4">
          <h2 className="text-xl font-semibold">Response Filters</h2>
          <div className="flex flex-wrap gap-2">
            {(['alphabets', 'numbers', 'highest_lowercase_alphabet'] as FilterOption[]).map((option) => (
              <button
                key={option}
                onClick={() => handleFilterChange(option)}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  selectedFilters.includes(option)
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {option.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
              </button>
            ))}
          </div>
        </div>
      )}

      {response && (
        <div className="mt-8 space-y-4">
          <h2 className="text-xl font-semibold">Filtered Response</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
            {JSON.stringify(getFilteredResponse(), null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}

