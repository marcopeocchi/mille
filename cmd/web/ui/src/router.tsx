import { Suspense, lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import Layout from './Layout'
import Loader from './components/Loader'
import Home from './views/Home'

const Album = lazy(() => import('./views/Album'))
const Albums = lazy(() => import('./views/Albums'))
const Artists = lazy(() => import('./views/Artists'))

const Songs = lazy(() => import('./views/Songs'))
const Search = lazy(() => import('./views/Search'))

const Settings = lazy(() => import('./views/Settings'))

export const router = createBrowserRouter([
  {
    path: '/',
    Component: () => <Layout />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/album/:id',
        element: (
          <Suspense fallback={<Loader />}>
            <Album />
          </Suspense>
        )
      },
      {
        path: '/songs',
        element: (
          <Suspense fallback={<Loader />}>
            <Songs />
          </Suspense>
        )
      },
      {
        path: '/albums',
        element: (
          <Suspense fallback={<Loader />}>
            <Albums />
          </Suspense>
        )
      },
      {
        path: '/artists',
        element: (
          <Suspense fallback={<Loader />}>
            <Artists />
          </Suspense>
        )
      },
      {
        path: '/search/:query',
        element: (
          <Suspense fallback={<Loader />}>
            <Search />
          </Suspense>
        )
      },
      {
        path: '/settings',
        element: (
          <Suspense fallback={<Loader />}>
            <Settings />
          </Suspense>
        )
      },
    ]
  },
])