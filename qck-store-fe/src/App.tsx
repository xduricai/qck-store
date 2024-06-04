import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Navbar } from './navigation/Navbar';
import { useEffect, useRef, useState } from 'react';
import { CurrentUserContext } from './global/UserContext';
import { User } from './api/responses/User';
import { Route, Navigate, Routes } from 'react-router-dom';
import { Home } from './home/Home';
import { Login } from './login/Login';
import { Initial } from './home/Initial';
import { Registration } from './registration/Registration';
import { Snackbar, SnackbarProps, SnackbarStyle } from './global/Snackbar';
import { SnackbarContext } from './global/SnackbarContext';
import { authenticate } from './api/UserClient';
import { LoadingPage } from './shared/Loading';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Admin } from './admin/Admin';
import { Settings } from './settings/Settings';
import './App.css'

function App() {
  const queryClient = useRef(new QueryClient());
  const [loading, setLoading] = useState(true);
  const [user, setUser]  = useState<User>();
  const [snackbarData, setSnackbarData] = useState<SnackbarProps | null>();
  const snackbarTimer = useRef<number>();

  useEffect(() => {
    authenticate()
    .then((user: User) => setUser(user))
    .finally(() => setLoading(false));
  }, []);

  function showSnackbar(message: string, style: SnackbarStyle = "default", duration = 6000) {
    clearTimeout(snackbarTimer.current);
    setSnackbarData({ message, style });
    if (duration == Infinity) return; 
    snackbarTimer.current = setTimeout(() => setSnackbarData(null), duration);
  }

  if (loading) return <LoadingPage />;

  return (
    <QueryClientProvider client={queryClient.current}>
      <ReactQueryDevtools initialIsOpen={false} />
      <SnackbarContext.Provider value={showSnackbar}>
        <CurrentUserContext.Provider value={{ user, setUser }}>
          <Navbar />
          {!user && 
            <Routes>
              <Route path="/" element={<Initial />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Registration />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          }
  
          {user?.role === "user" &&
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/folder/:folderId" element={<Home />} />
              <Route path="/search/:query" element={<Home />} />
              <Route path="/settings/" element={<Settings user={user} setUser={setUser} />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes> 
          }

          {user?.role === "admin" &&
            <Routes>
              <Route path="/" element={<Admin />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes> 
          }
          {snackbarData && <Snackbar {...snackbarData} />}
        </CurrentUserContext.Provider>
      </SnackbarContext.Provider>
    </QueryClientProvider>
  )
}
export default App
