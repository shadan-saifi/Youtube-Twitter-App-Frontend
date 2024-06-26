import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'
import store from './store/store.js'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { CreateAccountPage, DashboardPage, EditChannelDeatilsPage, EditChannelImagesPage, EditVideoPage, GetChannelPlaylistsPage, GetChannnelVideosPage, GetDashboardStatsPage, GetPlaylistPage, HomeVideoPage, LoginPage, UploadVideoPage,  UserPage, UserPlaylistPage, UserSearchVideosPage, UserVideosPage, VideoByIdPage } from './pages/index.js'
import { AuthLayout } from './components/index.js'


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
        element: <CreateAccountPage />
      },
      {
        path: "/playlist",
        element: <GetPlaylistPage />
      },
      {
        path: "/watch",
        element: <VideoByIdPage />
      },
      {
        path: "/:username",
        element: <UserPage />
        ,
        children: [
          {
            path: "/:username/videos",
            element:
              <UserVideosPage />
          },
          {
            path: "/:username/playlists",
            element: <UserPlaylistPage />
          },
          {
            path: "/:username/search",
            element: <UserSearchVideosPage />
          },

        ]
      },
      {
        path: "/channel",
        element: (<AuthLayout authorization={true} ><DashboardPage /></AuthLayout>),
        children: [
          {
            path: "/channel/uploadvideo",
            element: (<AuthLayout authorization={true} ><UploadVideoPage /></AuthLayout>),
          },
          {
            path: "/channel/dashboard",
            element: (<AuthLayout authorization={true} ><GetDashboardStatsPage /></AuthLayout>),
          },
          {
            path: "/channel/videos",
            element: (<AuthLayout authorization={true} ><GetChannnelVideosPage /></AuthLayout>),
          },
          {
            path: "/channel/playlists",
            element: (<AuthLayout authorization={true} ><GetChannelPlaylistsPage /></AuthLayout>),
          },
          {
            path: "/channel/:videoId/editvideo",
            element: (<AuthLayout authorization={true} ><EditVideoPage /></AuthLayout>),
          }, 
          {
            path: "/channel/user/:username/edit/details",
            element: (<AuthLayout authorization={true} ><EditChannelDeatilsPage /></AuthLayout>),
          }, 
          {
            path: "/channel/user/:username/edit/images",
            element: (<AuthLayout authorization={true} ><EditChannelImagesPage /></AuthLayout>),
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
