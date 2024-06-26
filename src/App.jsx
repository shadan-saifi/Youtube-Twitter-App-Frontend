import { useEffect, useState } from 'react'
import './App.css'
import { useDispatch } from 'react-redux'
import { getCurrentUser, refreshAccessToken } from './services/userService'
import { login, logout } from './store/authSlice'
import { Outlet } from 'react-router-dom'
import Header from './components/header/Header'
import { Footer } from './components'
import { ThemeProvider } from "@/components/ThemeProvider"
import { Skeleton } from "@/components/ui/skeleton"



function App() {
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()


  useEffect(() => {
    (async () => {
      try {
        const userData = await getCurrentUser();
        if (userData) {
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
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme" >
      <Header />
      <main >
        <Outlet />
      </main>
      <Footer />
    </ThemeProvider>
  ) : (
    <div className=" flex flex-col justify-center items-center w-full h-svh space-y-3">
      <Skeleton className="h-[125px] w-[250px] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>)

}


export default App
