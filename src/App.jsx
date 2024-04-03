import { useEffect, useState } from 'react'
import './App.css'
import { useDispatch } from 'react-redux'
import { getCurrentUser, refreshAccessToken } from './services/userService'
import { login, logout } from './store/authSlice'
import { Outlet } from 'react-router-dom'
import Header from './components/header/Header'
import { Footer } from './components'

function App() {
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()


  useEffect(() => {
    (async () => {
      try {
        const userData = await getCurrentUser();
        console.log("userData:",userData);
        if (userData.data) {
          dispatch(login({ userData }));
        } else {
          dispatch(logout());
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          dispatch(logout());
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [dispatch]);


  useEffect(() => {
    const refresh = async () => {
      try {
        await refreshAccessToken();
      } catch (error) {
        console.error('Error refreshing access token:', error);
        throw error;
      }
    };

    const interval = setInterval(refresh, 3600000);

    return () => clearInterval(interval);
  }, [dispatch]);


  return !loading ? (
    <div>
      <Header />
      <main className=''>
        <Outlet />
      </main>
      <Footer />
    </div>
  ) : (
    <div>...Loading</div>
  )

}


export default App
