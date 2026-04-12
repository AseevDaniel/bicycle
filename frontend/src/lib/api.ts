const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/v1'

export async function fetchAPI<T>(
  path: string,
  options?: RequestInit
): Promise<{ success: true; data: T } | { success: false; error: string }> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      headers: { 'Content-Type': 'application/json', ...options?.headers },
      ...options,
    })
    const json = await res.json()
    return json
  } catch {
    return { success: false, error: 'Network error' }
  }
}
