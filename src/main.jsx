import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'
import store from './store/store.js'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { CreateAccountPage, GetPlaylistPage, HomeVideoPage, LoginPage, UserPage, UserPlaylistPage, UserSearchVideosPage, UserVideosPage, VideoByIdPage } from './pages/index.js'
import { AuthLayout } from './components/index.js'
import GetAllUserPlaylists from './components/playlist/GetAllUserPlaylists.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <HomeVideoPage />
      },
      {
        path: "/search",
        element: <HomeVideoPage />
      },
      {
        path: "/login",
        element: (<AuthLayout authorization={false}>
          <LoginPage />
        </AuthLayout>)
      },
      {
        path: "/create-account",
        element: (<AuthLayout authorization={false}>
          <CreateAccountPage />
        </AuthLayout>)
      },
      {
        path: "/playlist",
        element: (<AuthLayout authorization={false}>
          <GetPlaylistPage />
        </AuthLayout>)
      },
      {
        path: "/watch",
        element: (<AuthLayout authorization={false}>
          <VideoByIdPage />
        </AuthLayout>)
      },
      {
        path: "/:username",
        element: (<AuthLayout authorization={false}>
          <UserPage />
        </AuthLayout>),
        children: [
          {
            path: "/:username/videos",
            element: (<AuthLayout authorization={false}>
              <UserVideosPage />
            </AuthLayout>)
          },
          {
            path: "/:username/playlists",
            element: (<AuthLayout authorization={false}>
              <UserPlaylistPage />
            </AuthLayout>)
          },
          {
            path: "/:username/search",
            element: (<AuthLayout authorization={false}>
              <UserSearchVideosPage />
            </AuthLayout>)
          },
        
        ]
      }
    ]
  }
])


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
)
