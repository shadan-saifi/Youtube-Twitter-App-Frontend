import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'
import store from './store/store.js'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { CreateAccountPage, HomePage, LoginPage, UserPage, UserVideosPage, VideoByIdPage } from './pages/index.js'
import { AuthLayout } from './components/index.js'
import UserSearchPage from './pages/userPages/UserSearchPage.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <HomePage />
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
        path: "/watch",
        element: (<AuthLayout authorization={true}>
          <VideoByIdPage />
        </AuthLayout>)
      },
      {
        path: "/:username",
        element: (<AuthLayout authorization={true}>
          <UserPage />
        </AuthLayout>),
        children: [
          {
            path: "/:username/videos",
            element: (<AuthLayout authorization={true}>
              <UserVideosPage />
            </AuthLayout>)
          },
          {
            path: "/:username/search",
            element: (<AuthLayout authorization={true}>
              <UserSearchPage />
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
