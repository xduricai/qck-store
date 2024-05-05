import './App.css'
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

function App() {
  const queryClient = new QueryClient();
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

  return (
    <QueryClientProvider client={queryClient}>
      <SnackbarContext.Provider value={showSnackbar}>
        <CurrentUserContext.Provider value={{ user, setUser }}>
          <Navbar />
          {loading ? <LoadingPage /> :
            <Routes>
              <Route path="/" element={user ? <Home /> : <Initial />} />
              <Route path="/folder/:folderId" element={user ? <Home /> : <Navigate replace to="/" />} />
              <Route path="/search/:query" element={user ? <Home /> : <Navigate replace to="/" />} />
              <Route path="/login" element={user ? <Navigate replace to="/" /> : <Login />} />
              <Route path="/register" element={user ? <Navigate replace to="/" /> : <Registration />} />
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
