import { Navigate, createBrowserRouter } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { MovieListPage } from '@/pages/MovieListPage'
import { BookingPage } from '@/pages/BookingPage'
import { BookingHistoryPage } from '@/pages/BookingHistoryPage'
import { ProtectedRoute } from './ProtectedRoute'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="/movies" replace /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'movies', element: <MovieListPage /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: 'book/:id', element: <BookingPage /> },
          { path: 'bookings', element: <BookingHistoryPage /> },
        ],
      },
      { path: '*', element: <Navigate to="/movies" replace /> },
    ],
  },
])
