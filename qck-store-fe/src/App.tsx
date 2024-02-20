import './App.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Navbar } from './navigation/Navbar';
import { useState } from 'react';
import { CurrentUserContext } from './global/UserContext';
import { User } from './types/User';
import { Route, Navigate, Routes } from 'react-router-dom';
import { Home } from './home/Home';
import { Login } from './login/Login';
import { Registration } from './registration/Registration';
import { Snackbar, SnackbarProps, SnackbarStyle } from './global/Snackbar';
import { SnackbarContext } from './global/SnackbarContext';

function App() {
  const queryClient = new QueryClient();
  const [user, setUser]  = useState<User>();
  const [snackbarData, setSnackbarData] = useState<SnackbarProps | null>();
  let snackbarTimer: number;

  function showSnackbar(message: string, style: SnackbarStyle = "default", duration = 4000) {
    clearTimeout(snackbarTimer);
    setSnackbarData({ message, style });
    snackbarTimer = setTimeout(() => setSnackbarData(null), duration);
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SnackbarContext.Provider value={showSnackbar}>
        <CurrentUserContext.Provider value={{ user, setUser }}>
            <Navbar />
            <Routes>
              <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
              <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
              <Route path="/register" element={user ? <Navigate to="/" /> : <Registration />} />
              <Route path="*" element={user ? <Navigate to="/" /> : <Navigate to="/login" />} />
            </Routes>
            {snackbarData && <Snackbar {...snackbarData} />}
        </CurrentUserContext.Provider>
      </SnackbarContext.Provider>
    </QueryClientProvider>
  )
}

export default App
