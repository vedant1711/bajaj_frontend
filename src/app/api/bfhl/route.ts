import { NextRequest, NextResponse } from 'next/server'

const USER_ID = 'trideep_nandi_14082003' 
const EMAIL = 'nandi.trideep2003@gmail.com' 
const ROLL_NUMBER = '0827CS211248'

export async function GET() {
  return NextResponse.json({ operation_code: 1 })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { data, file_b64 } = body

    const numbers = data.filter((item: string) => !isNaN(Number(item)))
    const alphabets = data.filter((item: string) => isNaN(Number(item)))
    const highestLowercaseAlphabet = alphabets
      .filter((char: string) => char === char.toLowerCase())
      .sort((a: string, b: string) => b.localeCompare(a))[0] || []

    const isPrimeFound = numbers.some((num: string) => isPrime(Number(num)))

    let fileValid = false
    let fileMimeType = ''
    let fileSizeKb = 0

    if (file_b64) {
      // Basic validation for Base64 string
      fileValid = /^[A-Za-z0-9+/]+={0,2}$/.test(file_b64)
      
      // Assuming the first part of the Base64 string contains MIME type info
      const mimeMatch = file_b64.match(/^data:(.+);base64,/)
      if (mimeMatch) {
        fileMimeType = mimeMatch[1]
      }

      // Calculate file size (approximate)
      const base64Length = file_b64.replace(/^data:.*?;base64,/, '').length
      fileSizeKb = Math.round((base64Length * 3 / 4) / 1024)
    }

    const response = {
      is_success: true,
      user_id: USER_ID,
      email: EMAIL,
      roll_number: ROLL_NUMBER,
      numbers,
      alphabets,
      highest_lowercase_alphabet: highestLowercaseAlphabet ? [highestLowercaseAlphabet] : [],
      is_prime_found: isPrimeFound,
      file_valid: fileValid,
      file_mime_type: fileMimeType,
      file_size_kb: fileSizeKb.toString()
    }

    return NextResponse.json(response)
  } catch (error) {
    return NextResponse.json({ is_success: false, error: 'Invalid input' }, { status: 400 })
  }
}

function isPrime(num: number): boolean {
  if (num <= 1) return false
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false
  }
  return true
}

