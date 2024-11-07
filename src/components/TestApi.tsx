// src/components/TestApi.tsx
'use client'

import { useEffect } from 'react'

export default function TestApi() {
  useEffect(() => {
    // Test basic route
    fetch('/api/test')
      .then(res => res.json())
      .then(data => console.log('Basic route:', data))
      .catch(err => console.error('Basic route error:', err))

    // Test dynamic route
    fetch('/api/test/123')
      .then(res => res.json())
      .then(data => console.log('Dynamic route:', data))
      .catch(err => console.error('Dynamic route error:', err))
  }, [])

  return <div>Check console for API responses</div>
}
