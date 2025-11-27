import React from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import RequireAuth from '../components/RequireAuth'
import { vi } from 'vitest'

// Mock the auth context to simulate loading / unauthenticated / authenticated
vi.mock('../contexts/AuthContext', () => {
  return {
    useAuth: () => ({ user: null, loading: false }),
  }
})

test('redirects unauthenticated user to /login', () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route element={<RequireAuth />}>
          <Route path="/" element={<div>Protected</div>} />
        </Route>
        <Route path="/login" element={<div>LoginPage</div>} />
      </Routes>
    </MemoryRouter>
  )

  expect(screen.getByText('LoginPage')).toBeInTheDocument()
})
